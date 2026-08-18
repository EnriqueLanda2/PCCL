/* ───────────────────────────────────────────
   Validación pública de certificados
   Destino del QR del reverso de cada tarjeta:
   /validate/[folio] — consulta el certificado
   real vía GET /certificates/verify/:folio, un
   endpoint público que no requiere sesión.
   ─────────────────────────────────────────── */

'use client';

import { Suspense, use, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { publicToCardData } from '@/lib/certificates';
import { CertificateHoloCard, type CertificateCardData } from '@/app/components/ui/CertificateHoloCard';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

type Verdict = 'checking' | 'valid' | 'expired' | 'revoked' | 'not-found' | 'error';

/** Banner de veredicto por estado del certificado encontrado */
const FOUND_BANNERS = {
  valid: {
    tone:    'ok',
    title:   'Certificado auténtico',
    message: 'Este certificado existe y fue emitido por Rumbo · Plataforma de cursos.',
  },
  expired: {
    tone:    'warn',
    title:   'Certificado vencido',
    message: 'El certificado es auténtico, pero su vigencia ya expiró.',
  },
  revoked: {
    tone:    'bad',
    title:   'Certificado revocado',
    message: 'Este certificado fue emitido por Rumbo pero posteriormente se revocó. No es válido.',
  },
} as const;

const TONE_STYLES = {
  ok:   { border: '#CDEFD9', bg: '#ECF8EF', chip: 'var(--green-500)', title: 'var(--green-700)' },
  warn: { border: '#F3E0B5', bg: '#FDF7E7', chip: '#C8901B',          title: '#8A6212'          },
  bad:  { border: '#F7C7B9', bg: '#FFF1ED', chip: 'var(--red-500)',   title: 'var(--red-600)'   },
} as const;

export default function ValidateCertificatePage({
  params,
}: Readonly<{ params: Promise<{ folio: string }> }>) {
  return (
    <Suspense fallback={null}>
      <ValidateCertificateContent params={params} />
    </Suspense>
  );
}

function ValidateCertificateContent({
  params,
}: Readonly<{ params: Promise<{ folio: string }> }>) {
  const { folio: rawFolio } = use(params);
  const folio = decodeURIComponent(rawFolio);

  const [verdict, setVerdict] = useState<Verdict>('checking');
  const [cert,    setCert]    = useState<CertificateCardData | null>(null);

  useEffect(() => {
    let alive = true;
    api.verifyCertificate(folio)
      .then((res) => {
        if (!alive) return;
        if (!res.found || !res.certificate) {
          setCert(null);
          setVerdict('not-found');
          return;
        }
        setCert(publicToCardData(res.certificate));
        setVerdict(res.certificate.status);
      })
      .catch(() => {
        // Un fallo de red no prueba que el folio sea falso: se reporta como
        // servicio no disponible en vez de "certificado no encontrado".
        if (alive) { setCert(null); setVerdict('error'); }
      });
    return () => { alive = false; };
  }, [folio]);

  const banner = verdict in FOUND_BANNERS
    ? FOUND_BANNERS[verdict as keyof typeof FOUND_BANNERS]
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center px-5 py-12">
      {/* Marca */}
      <Link href="/" className="mb-8 flex items-center gap-2.5 no-underline">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-[0.625rem] text-white"
          style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-400))' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 17 L11 11 L15 14 L19 7" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="19" cy="7" r="1.6" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span className="text-xl font-extrabold tracking-tight text-[var(--ink)]">Rumbo</span>
      </Link>

      <h1 className="text-center text-[clamp(24px,3vw,36px)] font-extrabold tracking-tight text-[var(--ink)]">
        Verificación de certificado
      </h1>
      <p className="mt-1 font-mono text-[0.8125rem] tracking-[0.1em] text-[var(--ink-muted)]">{folio}</p>

      {verdict === 'checking' && (
        <div className="mt-16 flex flex-col items-center gap-4">
          <WaveSpinner size="lg" label="Verificando certificado…" />
          <p className="text-sm text-[var(--ink-muted)]">Consultando el certification-service…</p>
        </div>
      )}

      {banner && cert && (
        <div className="mt-8 flex w-full max-w-[33.75rem] flex-col items-center gap-6 animate-fade-in">
          {/* Veredicto */}
          <div
            className="flex w-full items-center gap-3 rounded-2xl border px-5 py-4"
            style={{
              borderColor:     TONE_STYLES[banner.tone].border,
              backgroundColor: TONE_STYLES[banner.tone].bg,
            }}
          >
            <span
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: TONE_STYLES[banner.tone].chip }}
            >
              {banner.tone === 'ok' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                  <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                  <path d="M12 7v7" strokeLinecap="round" />
                  <circle cx="12" cy="17.5" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              )}
            </span>
            <div>
              <p className="text-[0.9375rem] font-bold" style={{ color: TONE_STYLES[banner.tone].title }}>
                {banner.title}
              </p>
              <p className="text-[0.8125rem] text-[var(--ink-soft)]">{banner.message}</p>
            </div>
          </div>

          <CertificateHoloCard data={cert} showSparkles={verdict === 'valid'} className="w-full" />
        </div>
      )}

      {verdict === 'error' && (
        <div className="mt-8 flex w-full max-w-[33.75rem] flex-col items-center gap-6 animate-fade-in">
          <div className="flex w-full items-center gap-3 rounded-2xl border border-[#F3E0B5] bg-[#FDF7E7] px-5 py-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C8901B] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                <path d="M12 7v7" strokeLinecap="round" />
                <circle cx="12" cy="17.5" r="1.1" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <div>
              <p className="text-[0.9375rem] font-bold text-[#8A6212]">No se pudo verificar</p>
              <p className="text-[0.8125rem] text-[var(--ink-soft)]">
                El servicio de certificación no respondió. Esto no significa que el folio sea
                inválido — vuelve a intentarlo en unos momentos.
              </p>
            </div>
          </div>
        </div>
      )}

      {verdict === 'not-found' && (
        <div className="mt-8 flex w-full max-w-[33.75rem] flex-col items-center gap-6 animate-fade-in">
          <div className="flex w-full items-center gap-3 rounded-2xl border border-[#F7C7B9] bg-[#FFF1ED] px-5 py-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--red-500)] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-[0.9375rem] font-bold text-[var(--red-600)]">Certificado no encontrado</p>
              <p className="text-[0.8125rem] text-[var(--ink-soft)]">
                El folio <span className="font-mono">{folio}</span> no existe en nuestros registros.
                Verifica que el código QR o el enlace sean correctos.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full px-7 text-sm font-bold text-white no-underline"
            style={{ background: 'linear-gradient(120deg, var(--green-700), var(--green-500))' }}
          >
            Ir a Rumbo
          </Link>
        </div>
      )}

      <p className="mt-auto pt-12 text-[0.75rem] text-[var(--ink-muted)]">
        certification-service · Rumbo © 2026
      </p>
    </main>
  );
}

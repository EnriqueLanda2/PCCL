/* ───────────────────────────────────────────
   Validación pública de certificados
   Destino del QR del reverso de cada tarjeta:
   /validate/[folio] — comprueba que el folio
   exista en el certification-service.
   ─────────────────────────────────────────── */

'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DEMO_CERTIFICATES, toCardData } from '@/lib/certificates';
import { CertificateHoloCard, type CertificateCardData } from '@/app/components/ui/CertificateHoloCard';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

type Verdict = 'checking' | 'valid' | 'not-found';

export default function ValidateCertificatePage({
  params,
}: Readonly<{ params: Promise<{ folio: string }> }>) {
  const { folio: rawFolio } = use(params);
  const folio = decodeURIComponent(rawFolio);

  const [verdict, setVerdict] = useState<Verdict>('checking');
  const [cert,    setCert]    = useState<CertificateCardData | null>(null);

  useEffect(() => {
    let alive = true;
    api.certificates()
      .then((list) => list.map(toCardData))
      .catch(() => DEMO_CERTIFICATES)
      .then((cards) => {
        if (!alive) return;
        const found = cards.find((c) => c.folio.toLowerCase() === folio.toLowerCase()) ?? null;
        setCert(found);
        setVerdict(found ? 'valid' : 'not-found');
      });
    return () => { alive = false; };
  }, [folio]);

  return (
    <main className="flex min-h-screen flex-col items-center px-5 py-12">
      {/* Marca */}
      <Link href="/" className="mb-8 flex items-center gap-2.5 no-underline">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-white"
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
      <p className="mt-1 font-mono text-[13px] tracking-[0.1em] text-[var(--ink-muted)]">{folio}</p>

      {verdict === 'checking' && (
        <div className="mt-16 flex flex-col items-center gap-4">
          <WaveSpinner size="lg" label="Verificando certificado…" />
          <p className="text-sm text-[var(--ink-muted)]">Consultando el certification-service…</p>
        </div>
      )}

      {verdict === 'valid' && cert && (
        <div className="mt-8 flex w-full max-w-[540px] flex-col items-center gap-6 animate-fade-in">
          {/* Veredicto */}
          <div className="flex w-full items-center gap-3 rounded-2xl border border-[#CDEFD9] bg-[#ECF8EF] px-5 py-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--green-500)] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-[15px] font-bold text-[var(--green-700)]">Certificado auténtico</p>
              <p className="text-[13px] text-[var(--ink-soft)]">
                Este certificado existe y fue emitido por Rumbo · Plataforma de cursos.
              </p>
            </div>
          </div>

          <CertificateHoloCard data={cert} showSparkles className="w-full" />
        </div>
      )}

      {verdict === 'not-found' && (
        <div className="mt-8 flex w-full max-w-[540px] flex-col items-center gap-6 animate-fade-in">
          <div className="flex w-full items-center gap-3 rounded-2xl border border-[#F7C7B9] bg-[#FFF1ED] px-5 py-4">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--red-500)] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-[15px] font-bold text-[var(--red-600)]">Certificado no encontrado</p>
              <p className="text-[13px] text-[var(--ink-soft)]">
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

      <p className="mt-auto pt-12 text-[12px] text-[var(--ink-muted)]">
        certification-service · Rumbo © 2026
      </p>
    </main>
  );
}

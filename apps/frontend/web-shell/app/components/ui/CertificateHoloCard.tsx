/* ───────────────────────────────────────────
   CertificateHoloCard — certificado oficial Rumbo
   Tilt holográfico que sigue al puntero · sparkles
   Flip 3D completo: frente = certificado oficial,
   reverso = datos + QR de verificación pública.
   ─────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { cn } from '@/lib/cn';

export interface CertificateCardData {
  folio: string;
  studentName: string;
  courseTitle: string;
  issuedAt: string | null;
  status: 'valid' | 'expired' | 'revoked' | 'pending';
  verificationCode: string;
  instructorName?: string;
}

interface CertificateHoloCardProps {
  data: CertificateCardData;
  showSparkles?: boolean;
  className?: string;
  /** Ruta relativa de validación; se antepone el origin en cliente */
  verifyPath?: string;
}

const STATUS_META: Record<CertificateCardData['status'], { label: string; bg: string; fg: string; border: string }> = {
  valid:   { label: 'Emitido',   bg: '#E4F4E9', fg: 'var(--green-700)', border: '#CDEFD9' },
  pending: { label: 'Pendiente', bg: '#FFF8E8', fg: '#B26A00',          border: '#F4E2A9' },
  expired: { label: 'Expirado',  bg: '#FFF1ED', fg: 'var(--red-600)',   border: '#F7C7B9' },
  revoked: { label: 'Revocado',  bg: '#FFF1ED', fg: 'var(--red-700)',   border: '#F7C7B9' },
};

const SPARKLES = [
  { top: '8%',  left: '12%', size: 12, delay: 0 },
  { top: '18%', left: '86%', size: 10, delay: 0.7 },
  { top: '62%', left: '6%',  size: 9,  delay: 1.3 },
  { top: '78%', left: '90%', size: 12, delay: 1.9 },
  { top: '40%', left: '94%', size: 8,  delay: 2.4 },
];

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
}

/* Logo Rumbo: cuadrito verde con nodo de trayectoria */
function RumboSeal({ size = 34 }: Readonly<{ size?: number }>) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[10px] text-white flex-shrink-0"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, var(--green-600), var(--green-400))' }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M5 17 L11 11 L15 14 L19 7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19" cy="7" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

export function CertificateHoloCard({
  data,
  showSparkles = true,
  className,
  verifyPath,
}: Readonly<CertificateHoloCardProps>) {
  const [flipped, setFlipped] = useState(false);
  const [origin, setOrigin]   = useState('');
  const tiltRef = useRef<HTMLDivElement>(null);
  const status  = STATUS_META[data.status];

  useEffect(() => { setOrigin(window.location.origin); }, []);

  const path      = verifyPath ?? `/validate/${encodeURIComponent(data.folio)}`;
  const verifyUrl = `${origin || 'https://rumbo.mx'}${path}`;

  /* ── Tilt holográfico ── */
  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0..1
    const py = (e.clientY - rect.top)  / rect.height;  // 0..1
    const rotY = (px - 0.5) * 16;   // -8°..8°
    const rotX = (0.5 - py) * 12;   // -6°..6°
    el.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    el.style.setProperty('--hx', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--hy', `${(py * 100).toFixed(1)}%`);
  }, []);

  const handleLeave = useCallback(() => {
    const el = tiltRef.current;
    if (el) el.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }, []);

  const toggleFlip = () => setFlipped((f) => !f);

  return (
    <div className={cn('holo-scene', className)}>
      <div ref={tiltRef} className="holo-tilt" onPointerMove={handleMove} onPointerLeave={handleLeave}>
        <div
          role="button"
          tabIndex={0}
          aria-label={flipped ? 'Ver frente del certificado' : 'Ver reverso del certificado'}
          onClick={toggleFlip}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(); } }}
          className={cn('holo-flipper cursor-pointer outline-none aspect-[10/8] w-full', flipped && 'is-flipped')}
        >

          {/* ══════════ FRENTE — certificado oficial ══════════ */}
          <div className="holo-face absolute inset-0 rounded-[20px] border-2 border-[var(--green-500)] bg-white shadow-[0_24px_50px_rgba(23,50,77,0.10)] overflow-hidden flex flex-col px-7 py-6">
            {/* Badge estado */}
            <span
              className="absolute top-4 right-4 rounded-full px-3 py-1 text-[11px] font-bold border"
              style={{ background: status.bg, color: status.fg, borderColor: status.border }}
            >
              {status.label}
            </span>

            {/* Marca */}
            <div className="flex flex-col items-center gap-1.5 mt-1">
              <div className="flex items-center gap-2.5">
                <RumboSeal />
                <span className="text-[22px] font-extrabold tracking-[0.08em] text-[var(--ink)]">RUMBO</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--ink-muted)]">
                Plataforma de cursos
              </span>
            </div>

            {/* Cuerpo */}
            <div className="flex flex-col items-center text-center flex-1 justify-center gap-1 py-2">
              <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-[var(--ink)]">
                Certificado de finalización
              </span>
              <span className="mt-2 text-[12.5px] text-[var(--ink-muted)]">Se otorga el presente a</span>
              <span className="text-[clamp(20px,2.2vw,28px)] font-extrabold tracking-tight text-[var(--ink)] leading-tight">
                {data.studentName}
              </span>
              <span className="text-[12.5px] text-[var(--ink-muted)]">por completar satisfactoriamente el curso</span>
              <span className="text-[15.5px] font-bold text-[var(--green-600)]">{data.courseTitle}</span>
            </div>

            {/* Pie: fecha · sello · instructor */}
            <div className="flex items-end justify-between gap-3">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] text-[var(--ink-muted)]">Fecha de emisión</span>
                <span className="text-[12.5px] font-bold text-[var(--ink)]">{formatDate(data.issuedAt)}</span>
              </div>

              <div className="flex flex-col items-center flex-shrink-0">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--green-500)] text-[var(--green-600)] relative">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="absolute -bottom-1 rounded-full bg-white px-1 text-[5.5px] font-bold uppercase tracking-[0.14em] text-[var(--green-600)]">
                    Verificado
                  </span>
                </span>
              </div>

              <div className="flex flex-col items-center gap-0.5 min-w-0">
                <span className="text-[13px] font-bold text-[var(--ink)] border-t border-[var(--ink)] pt-1 px-2 truncate max-w-[140px]">
                  {data.instructorName ?? 'Instructor'}
                </span>
                <span className="text-[10px] text-[var(--ink-muted)]">Instructor</span>
              </div>
            </div>

            {/* Folio */}
            <div className="mt-4 border-t border-dashed border-[#DCE7D4] pt-2.5 text-center">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-[var(--ink-muted)]">
                Folio {data.folio} · Verificación {data.verificationCode}
              </span>
            </div>

            {/* Brillo holográfico + sparkles */}
            <span className="holo-shine" aria-hidden />
            {showSparkles && SPARKLES.map((s) => (
              <svg
                key={`${s.top}-${s.left}`}
                className="holo-sparkle"
                style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}
                width={s.size} height={s.size} viewBox="0 0 24 24" fill="currentColor" aria-hidden
              >
                <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" />
              </svg>
            ))}
          </div>

          {/* ══════════ REVERSO — datos + QR ══════════ */}
          <div className="holo-face holo-face-back rounded-[20px] border-2 border-[var(--green-500)] overflow-hidden flex flex-col px-7 py-6 text-white"
            style={{ background: 'linear-gradient(150deg, #0F4724 0%, #176C38 55%, #1E8B48 100%)' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RumboSeal size={26} />
                <span className="text-[13px] font-extrabold tracking-[0.1em]">RUMBO</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/70">
                Verificación oficial
              </span>
            </div>

            <div className="flex flex-1 items-center gap-6 py-3">
              {/* Datos */}
              <dl className="flex flex-1 flex-col gap-2.5 min-w-0">
                {[
                  ['Folio',        data.folio],
                  ['Estudiante',   data.studentName],
                  ['Curso',        data.courseTitle],
                  ['Emisión',      formatDate(data.issuedAt)],
                  ['Estado',       status.label],
                  ['Código',       data.verificationCode],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">{label}</dt>
                    <dd className={cn('text-[13px] font-semibold truncate', label === 'Folio' || label === 'Código' ? 'font-mono tracking-wider' : '')}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* QR */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="rounded-xl bg-white p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
                  <QRCode value={verifyUrl} size={116} fgColor="#0F4724" bgColor="#FFFFFF" />
                </div>
                <span className="max-w-[130px] text-center text-[9.5px] leading-snug text-white/75">
                  Escanea para validar este certificado en nuestra página
                </span>
              </div>
            </div>

            <div className="border-t border-white/15 pt-2.5 text-center">
              <span className="font-mono text-[9.5px] tracking-[0.1em] text-white/60 break-all">{verifyUrl}</span>
            </div>

            <span className="holo-shine" aria-hidden />
          </div>
        </div>
      </div>

      {/* Hint girar */}
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-[var(--ink-muted)] select-none">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Haz clic para girar el certificado
      </p>
    </div>
  );
}

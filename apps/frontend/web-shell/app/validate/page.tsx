/* ───────────────────────────────────────────
   Escáner de QR — validación de certificados
   Enciende la cámara, decodifica el QR del
   reverso de la tarjeta y redirige a
   /validate/[folio]. Si no hay cámara
   disponible, cae a un input manual de folio.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ScanState = 'requesting' | 'scanning' | 'denied' | 'unsupported';

/** Extrae el folio de un texto decodificado: URL completa con /validate/ o folio suelto. */
function extractFolio(raw: string): string {
  const trimmed = raw.trim();
  const marker = '/validate/';
  const idx = trimmed.indexOf(marker);
  if (idx !== -1) {
    const tail = trimmed.slice(idx + marker.length);
    const folio = tail.split(/[/?#]/)[0];
    return decodeURIComponent(folio);
  }
  return trimmed;
}

export default function ScanCertificatePage() {
  const router = useRouter();
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef    = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const decodedRef = useRef(false);

  const [state, setState]   = useState<ScanState>('requesting');
  const [manualFolio, setManualFolio] = useState('');

  const goToFolio = (folio: string) => {
    if (decodedRef.current || !folio) return;
    decodedRef.current = true;
    stopCamera();
    router.push(`/validate/${encodeURIComponent(folio)}`);
  };

  const stopCamera = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState('unsupported');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setState('scanning');
        void decodeLoop();
      } catch {
        if (!cancelled) setState('denied');
      }
    }

    async function decodeLoop() {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const hasNativeDetector = 'BarcodeDetector' in window;
      const detector = hasNativeDetector
        ? new (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => {
            detect: (source: CanvasImageSource) => Promise<Array<{ rawValue: string }>>;
          } }).BarcodeDetector({ formats: ['qr_code'] })
        : null;

      let jsQR: typeof import('jsqr').default | null = null;
      if (!detector) {
        jsQR = (await import('jsqr')).default;
      }

      const tick = async () => {
        if (cancelled || decodedRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width  = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          try {
            if (detector) {
              const results = await detector.detect(canvas);
              if (results.length > 0) {
                goToFolio(extractFolio(results[0].rawValue));
                return;
              }
            } else if (jsQR) {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const result = jsQR(imageData.data, imageData.width, imageData.height);
              if (result?.data) {
                goToFolio(extractFolio(result.data));
                return;
              }
            }
          } catch {
            // frame ilegible — se reintenta en el próximo tick
          }
        }

        if (detector) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      if (detector) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        intervalRef.current = setInterval(tick, 350);
      }
    }

    void start();
    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualFolio.trim()) goToFolio(manualFolio.trim());
  };

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
        Escanear certificado
      </h1>
      <p className="mt-1 text-[13px] text-[var(--ink-muted)]">
        Apunta la cámara al código QR del reverso de la tarjeta
      </p>

      <div className="mt-8 flex w-full max-w-[440px] flex-col items-center gap-6">
        {(state === 'requesting' || state === 'scanning') && (
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-[#CDEFD9] bg-black"
            style={{ aspectRatio: '3 / 4' }}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              playsInline
            />
            {/* Marco guía */}
            <div className="pointer-events-none absolute inset-8 rounded-xl border-2 border-white/70" />
            {state === 'requesting' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white">
                Solicitando acceso a la cámara…
              </div>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />

        {(state === 'denied' || state === 'unsupported') && (
          <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-[#F7C7B9] bg-[#FFF1ED] px-5 py-4 text-center">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--red-500)] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <p className="text-[15px] font-bold text-[var(--red-600)]">
                {state === 'unsupported' ? 'Cámara no disponible' : 'Acceso a la cámara denegado'}
              </p>
              <p className="mt-1 text-[13px] text-[var(--ink-soft)]">
                {state === 'unsupported'
                  ? 'Este navegador no soporta acceso a cámara. Ingresa el folio manualmente.'
                  : 'Otorga permiso de cámara o ingresa el folio manualmente para validar el certificado.'}
              </p>
            </div>
          </div>
        )}

        {/* Fallback: ingreso manual de folio — siempre disponible */}
        <form onSubmit={handleManualSubmit} className="flex w-full flex-col gap-2">
          <label htmlFor="folio" className="text-[12px] font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            O ingresa el folio manualmente
          </label>
          <div className="flex gap-2">
            <input
              id="folio"
              type="text"
              value={manualFolio}
              onChange={(e) => setManualFolio(e.target.value)}
              placeholder="Ej. RB-2026-0001"
              className="h-11 flex-1 rounded-xl border border-[var(--neutral-200)] bg-white px-4 font-mono text-[13px] tracking-[0.05em] text-[var(--ink)] outline-none focus:border-[var(--green-500)]"
            />
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-full px-6 text-sm font-bold text-white no-underline"
              style={{ background: 'linear-gradient(120deg, var(--green-700), var(--green-500))' }}
            >
              Validar
            </button>
          </div>
        </form>
      </div>

      <p className="mt-auto pt-12 text-[12px] text-[var(--ink-muted)]">
        certification-service · Rumbo © 2026
      </p>
    </main>
  );
}

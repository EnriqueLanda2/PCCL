/* ───────────────────────────────────────────
   CardCarousel — carrusel de tarjetas horizontal
   Fila de tarjetas con scroll-snap (varias visibles
   a la vez, con "peek" de la siguiente), flechas de
   navegación y entrada escalonada.

   Cada tarjeta se inclina siguiendo al puntero y se
   puede girar con un clic para ver más detalle en el
   reverso — la misma mecánica holográfica que
   CertificateHoloCard (mismas clases .holo-*), solo
   que aquí sin el sello de verificación/QR.
   ─────────────────────────────────────────── */

'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { ProgressBar } from '@/app/components/ui/ProgressBar';

export interface CardCarouselItem {
  id: string;
  title: string;
  description: string;
  eyebrow?: string;
  /** Clase de gradiente ya definida (p. ej. cover-1..6) para el encabezado */
  coverClass?: string;
  /** Estilo inline alternativo para el encabezado (gradientes ad-hoc) */
  coverStyle?: CSSProperties;
  /** Portada real (Cloudinary) — si está presente, reemplaza el gradiente/ícono */
  coverImageUrl?: string;
  icon?: ReactNode;
  progress?: number;
  href?: string;
  /** Si se provee (en vez de href), la tarjeta no navega — solo notifica la selección */
  onSelect?: () => void;
  linkLabel?: string;
}

function CardLink({ item }: Readonly<{ item: CardCarouselItem }>) {
  if (!item.href && !item.onSelect) return null;

  const inner = (
    <>
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[6px] bg-[var(--green-500)] text-white transition-transform group-hover:translate-x-0.5">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {item.linkLabel ?? 'Ver más'}
    </>
  );

  const className = 'mt-auto inline-flex w-fit items-center gap-2 pt-2.5 text-[13px] font-semibold text-[var(--green-700)] no-underline';

  if (item.onSelect) {
    return (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); item.onSelect!(); }}
        className={className}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link href={item.href!} onClick={(e) => e.stopPropagation()} className={className}>
      {inner}
    </Link>
  );
}

/**
 * Tarjeta holográfica de curso — tilt al mover el mouse, se voltea con un clic
 * para ver el reverso. Usada tanto en el carrusel horizontal (Tu contenido)
 * como en grids (p. ej. Mis cursos) vía la prop `fluid`.
 */
export function CourseHoloCard({ item, fluid = false }: Readonly<{ item: CardCarouselItem; fluid?: boolean }>) {
  const [flipped, setFlipped] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 14;
    const rotX = (0.5 - py) * 10;
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
    <div data-carousel-card className={fluid ? 'w-full animate-fade-in' : 'w-[236px] flex-shrink-0 snap-start animate-fade-in sm:w-[260px]'}>
      <div className="holo-scene">
        <div ref={tiltRef} className="holo-tilt" onPointerMove={handleMove} onPointerLeave={handleLeave}>
          <div
            role="button"
            tabIndex={0}
            aria-label={flipped ? 'Ver frente de la tarjeta' : 'Girar para ver más detalle'}
            onClick={toggleFlip}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(); } }}
            className={cn('holo-flipper h-[420px] cursor-pointer outline-none', flipped && 'is-flipped')}
          >
            {/* ── Frente ── */}
            <div className="holo-face group relative flex h-[420px] flex-col overflow-hidden rounded-[20px] border border-[#E4EBDD] bg-white shadow-[0_10px_28px_rgba(23,50,77,0.06)]">
              <div className={cn(item.coverImageUrl ? 'bg-neutral-200' : item.coverClass, 'relative flex h-[150px] w-full flex-shrink-0 items-center justify-center overflow-hidden')} style={item.coverStyle}>
                {item.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  item.icon
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 overflow-hidden p-5">
                {item.eyebrow && (
                  <span className="line-clamp-1 flex-shrink-0 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--green-600)]">
                    {item.eyebrow}
                  </span>
                )}
                <h3 className="line-clamp-2 flex-shrink-0 font-serif text-[16px] leading-snug text-[var(--ink)]">{item.title}</h3>
                <p className="line-clamp-2 text-[13px] leading-6 text-[var(--ink-soft)]">{item.description}</p>
                {typeof item.progress === 'number' && (
                  <div className="mt-0.5 flex items-center gap-2.5">
                    <ProgressBar value={item.progress} color="green" className="flex-1" />
                    <span className="text-[11px] font-semibold text-[var(--ink-muted)]">{item.progress}%</span>
                  </div>
                )}
                <CardLink item={item} />
              </div>
              <span className="holo-shine" aria-hidden />
            </div>

            {/* ── Reverso ── */}
            <div className="holo-face holo-face-back group flex h-[420px] flex-col overflow-hidden rounded-[20px] border border-[#E4EBDD] bg-white p-5 shadow-[0_10px_28px_rgba(23,50,77,0.06)]">
              <div className="flex flex-shrink-0 items-center justify-between">
                <span
                  className={cn(item.coverImageUrl ? 'bg-neutral-200' : item.coverClass, 'relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[12px] text-[26px]')}
                  style={item.coverStyle}
                >
                  {item.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    item.icon
                  )}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-[var(--ink-muted)]">
                  <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {item.eyebrow && (
                <span className="mt-3 line-clamp-1 flex-shrink-0 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--green-600)]">
                  {item.eyebrow}
                </span>
              )}
              <h3 className="mt-1 line-clamp-2 flex-shrink-0 font-serif text-[16px] leading-snug text-[var(--ink)]">{item.title}</h3>
              <p className="mt-2 line-clamp-4 flex-1 text-[13px] leading-6 text-[var(--ink-soft)]">{item.description}</p>
              <CardLink item={item} />
              <span className="holo-shine" aria-hidden />
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 select-none text-center text-[11px] text-[var(--ink-muted)]">Gira para ver más ↻</p>
    </div>
  );
}

export function CardCarousel({ items }: Readonly<{ items: CardCarouselItem[] }>) {
  const trackRef = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;

  const scrollByCards = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-carousel-card]');
    const step = (card?.offsetWidth ?? 260) + 20;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div ref={trackRef} className="scrollbar-hide flex snap-x snap-mandatory items-start gap-5 overflow-x-auto scroll-smooth pb-1 pl-0.5 pt-0.5">
        {items.map((item) => (
          <CourseHoloCard key={item.id} item={item} />
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollByCards(-1)}
            className="absolute -left-3 top-[36%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4EBDD] bg-white text-[var(--ink)] shadow-md hover:bg-neutral-50 sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollByCards(1)}
            className="absolute -right-3 top-[36%] hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4EBDD] bg-white text-[var(--ink)] shadow-md hover:bg-neutral-50 sm:flex"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

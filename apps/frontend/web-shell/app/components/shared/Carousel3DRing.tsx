/* ───────────────────────────────────────────
   Carousel3DRing — anillo de tarjetas en 3D
   Prisma de tarjetas (rotateY + translateZ) que
   avanza sola cada pocos segundos — el mismo
   índice que gira el anillo se reporta vía
   onSelect, así la tarjeta lateral siempre sabe
   qué curso está al frente, con o sin que el
   usuario intervenga. Se pausa al pasar el mouse
   o mientras se arrastra/gira a mano.
   ─────────────────────────────────────────── */

'use client';

import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/cn';

export interface Carousel3DItem {
  id: string;
  title: string;
  category: string;
  coverClass: string;
  href: string;
  /** Portada real (Cloudinary) — si está presente, reemplaza el gradiente */
  coverImageUrl?: string;
}

interface Carousel3DRingProps {
  items: Carousel3DItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /**
   * 'backdrop' (por defecto) — el modo original: fondo a pantalla completa
   * del hero de la landing (position:absolute + inset:0 contra la sección).
   * 'inline' — anillo acotado al tamaño de su contenedor, para insertarlo
   * dentro de una tarjeta/panel normal (p. ej. el hero del dashboard).
   */
  variant?: 'backdrop' | 'inline';
}

/** Umbral de arrastre (px) antes de considerarlo un swipe y no un clic */
const DRAG_THRESHOLD = 6;
/** Cada cuánto avanza solo al curso siguiente, en reposo */
const AUTO_ADVANCE_MS = 4200;

export function Carousel3DRing({ items, activeIndex, onSelect, variant = 'backdrop' }: Readonly<Carousel3DRingProps>) {
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; moved: boolean; dragged: boolean } | null>(null);
  const total = items.length;

  const theta = 360 / total;
  const rotation = -activeIndex * theta;

  /* Avance automático — reutiliza el mismo onSelect que dispara el drag/clic,
     así la tarjeta lateral queda sincronizada aunque el usuario no toque nada */
  useEffect(() => {
    if (paused || total <= 1) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      onSelect((activeIndex + 1) % total);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused, total, activeIndex, onSelect]);

  if (total === 0) return null;

  const selectRelative = (delta: number) => {
    onSelect(((activeIndex + delta) % total + total) % total);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragState.current = { startX: e.clientX, moved: false, dragged: false };
    setPaused(true);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;
    if (!drag) return;
    const deltaX = e.clientX - drag.startX;
    if (Math.abs(deltaX) > DRAG_THRESHOLD && !drag.dragged) {
      drag.dragged = true;
      onSelect(deltaX > 0
        ? ((activeIndex - 1) % total + total) % total
        : (activeIndex + 1) % total);
      drag.startX = e.clientX;
    }
    drag.moved = true;
  };

  const endDrag = () => {
    dragState.current = null;
    setPaused(false);
  };

  const handleSceneMouseMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
    handlePointerMove(e);
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <>
      {/* Fondo (variant="backdrop") o anillo acotado (variant="inline") — ver globals.css */}
      <div
        className={cn('carousel3d-scene', variant === 'inline' && 'carousel3d-scene--inline')}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          resetTilt();
        }}
        onPointerMove={handleSceneMouseMove}
        onPointerDown={handlePointerDown}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        style={{ '--tilt-x': `${tilt.x}deg`, '--tilt-y': `${tilt.y}deg` } as CSSProperties}
      >
        <div className="carousel3d-tilt-stage">
          <div
            className="carousel3d-ring"
            style={{
              '--ring-count': total,
              '--manual-rotation': `${rotation}deg`,
            } as CSSProperties}
          >
            {items.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    item.coverImageUrl ? 'bg-neutral-700' : item.coverClass,
                    'carousel3d-card',
                    isActive && 'carousel3d-card--active',
                  )}
                  style={{ '--i': i } as CSSProperties}
                  onClick={(e) => {
                    const drag = dragState.current;
                    if (drag?.dragged) {
                      e.preventDefault();
                      return;
                    }
                    if (!isActive) {
                      e.preventDefault();
                      onSelect(i);
                    }
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {item.coverImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  <span className="carousel3d-card-eyebrow">{item.category}</span>
                  <span className="carousel3d-card-title">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Brújula de aprendizaje — fuera de la capa de fondo, así queda por
          encima del scrim (z-index normal, no hereda el -1 del carrusel) */}
      <div className={cn('carousel3d-compass', variant === 'inline' && 'carousel3d-compass--inline')}>
        <button
          type="button"
          aria-label="Curso anterior"
          className="carousel3d-compass-btn"
          onClick={() => selectRelative(-1)}
        >
          <Icon icon="solar:alt-arrow-left-linear" width={18} height={18} />
        </button>
        <div className="carousel3d-compass-dots">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ir a ${item.title}`}
              onClick={() => onSelect(i)}
              className={cn('carousel3d-compass-dot', i === activeIndex && 'carousel3d-compass-dot--active')}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Siguiente curso"
          className="carousel3d-compass-btn"
          onClick={() => selectRelative(1)}
        >
          <Icon icon="solar:alt-arrow-right-linear" width={18} height={18} />
        </button>
      </div>
    </>
  );
}

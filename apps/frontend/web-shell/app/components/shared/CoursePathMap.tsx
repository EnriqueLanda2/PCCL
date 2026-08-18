/* ───────────────────────────────────────────
   CoursePathMap — camino vertical serpenteante
   ───────────────────────────────────────────
   Versión vertical de la ruta de temas (ver también CourseRoadmap, la
   variante horizontal usada dentro de la ficha de curso). Esta se usa en
   CoursePathView: una pantalla propia, sin nada más alrededor, así que el
   camino puede serpentear como en Duolingo — un nodo por tema, conectados
   por una curva, con el tema pendiente señalado con una llamada fija (no
   solo al pasar el mouse, porque en esta vista es lo único que importa).

   Genérico a propósito: no sabe qué es una "lección" ni un "examen" — recibe
   ítems ya resueltos (ícono, etiqueta, completado o no) para poder mezclar
   lecciones y quizzes en un solo camino secuencial. Quien arma esa mezcla
   es CoursePathView.

   Las coordenadas de cada nodo se calculan con una onda seno: no hace falta
   medir el DOM para dibujar los conectores, y el resultado es un serpenteo
   suave y estable entre renders.
   ─────────────────────────────────────────── */

'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { APP_ICONS } from '@/lib/icons';
import { cn } from '@/lib/cn';

export type PathNodeStatus = 'done' | 'current' | 'upcoming';

const NODE_SIZE = 76;
const ROW_GAP = 122;
const TRACK_WIDTH = 320;
const AMPLITUDE = 96;

export interface PathMapItem {
  id: string;
  title: string;
  icon: string;
  typeLabel: string;
  durationMinutes?: number;
  completed: boolean;
}

interface PathNode {
  item: PathMapItem;
  status: PathNodeStatus;
  x: number;
  y: number;
}

export interface CoursePathMapProps {
  items: PathMapItem[];
  onOpen?: (item: PathMapItem) => void;
  sequential?: boolean;
  className?: string;
}

export function CoursePathMap({
  items,
  onOpen,
  sequential = true,
  className,
}: Readonly<CoursePathMapProps>) {
  const nodes = useMemo<PathNode[]>(() => {
    const currentIndex = items.findIndex((item) => !item.completed);

    return items.map((item, index) => {
      let status: PathNodeStatus = 'done';
      if (index === currentIndex) status = 'current';
      else if (currentIndex !== -1 && index > currentIndex) status = 'upcoming';

      const center = TRACK_WIDTH / 2;
      return {
        item,
        status,
        x: center + AMPLITUDE * Math.sin(index * 1.15),
        y: NODE_SIZE / 2 + index * ROW_GAP,
      };
    });
  }, [items]);

  const [hovered, setHovered] = useState<number | null>(null);
  const currentIndex = nodes.findIndex((n) => n.status === 'current');
  const calloutIndex = hovered ?? (currentIndex >= 0 ? currentIndex : null);

  if (nodes.length === 0) return null;

  const totalHeight = NODE_SIZE + Math.max(0, nodes.length - 1) * ROW_GAP + NODE_SIZE / 2;

  return (
    <div className={cn('relative mx-auto', className)} style={{ width: TRACK_WIDTH, height: totalHeight }}>
      {/* ── Conectores ── */}
      <svg
        aria-hidden="true"
        width={TRACK_WIDTH}
        height={totalHeight}
        viewBox={`0 0 ${TRACK_WIDTH} ${totalHeight}`}
        className="absolute inset-0"
      >
        {nodes.slice(1).map((node, i) => {
          const prev = nodes[i];
          const done = prev.status === 'done';
          return (
            <path
              key={node.item.id}
              d={`M ${prev.x} ${prev.y} C ${prev.x} ${(prev.y + node.y) / 2}, ${node.x} ${(prev.y + node.y) / 2}, ${node.x} ${node.y}`}
              fill="none"
              stroke={done ? 'var(--green-600)' : 'var(--neutral-200)'}
              strokeWidth={7}
              strokeLinecap="round"
              className="transition-[stroke] duration-500 motion-reduce:transition-none"
            />
          );
        })}
      </svg>

      {/* ── Nodos ── */}
      {nodes.map((node, index) => {
        const { item, status } = node;
        const blocked = sequential && status === 'upcoming';
        const showCallout = calloutIndex === index;
        const calloutOnRight = node.x < TRACK_WIDTH / 2;

        return (
          <div
            key={item.id}
            className="absolute flex flex-col items-center"
            style={{ left: node.x - NODE_SIZE / 2, top: node.y - NODE_SIZE / 2, width: NODE_SIZE }}
          >
            <button
              type="button"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              onClick={() => !blocked && onOpen?.(item)}
              aria-current={status === 'current' ? 'step' : undefined}
              aria-disabled={blocked}
              title={item.title}
              style={{ width: NODE_SIZE, height: NODE_SIZE }}
              className={cn(
                'relative flex items-center justify-center rounded-full border-[3px] transition-transform duration-200 ease-out',
                blocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105',
                status === 'done' &&
                  'border-[var(--green-700)] bg-[var(--green-700)] text-white shadow-[0_8px_20px_rgba(31,154,75,0.28)]',
                status === 'current' &&
                  'border-[var(--green-500)] bg-white text-[var(--green-700)] shadow-[0_10px_28px_rgba(31,154,75,0.35)] scale-[1.08]',
                status === 'upcoming' &&
                  'border-[var(--neutral-200)] bg-[var(--neutral-100)] text-[var(--neutral-300)]',
              )}
            >
              <Icon icon={item.icon} width={28} height={28} />

              {status === 'done' && (
                <span className="absolute -right-0.5 -top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[var(--green-600)] text-white">
                  <Icon icon={APP_ICONS.check} width={13} height={13} />
                </span>
              )}
              {status === 'upcoming' && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[var(--neutral-300)] text-white">
                  <Icon icon={APP_ICONS.lock} width={12} height={12} />
                </span>
              )}
              <span
                className={cn(
                  'absolute -bottom-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center',
                  'rounded-full border-2 border-white text-[0.6875rem] font-extrabold',
                  status === 'upcoming' ? 'bg-[var(--neutral-200)] text-[var(--ink-muted)]' : 'bg-[var(--green-600)] text-white',
                )}
              >
                {index + 1}
              </span>
            </button>

            {/* ── Llamada fija del tema pendiente: siempre visible en el nodo
                "actual" (no solo al pasar el mouse) — es lo que en el boceto
                es la flecha roja + texto señalando la lección pendiente. ── */}
            {showCallout && (
              <div
                role={status === 'current' ? 'status' : 'tooltip'}
                className={cn(
                  'absolute top-1/2 z-20 flex w-[15.5rem] -translate-y-1/2 items-center gap-2.5',
                  calloutOnRight ? 'left-[calc(100%+1.1rem)]' : 'right-[calc(100%+1.1rem)] flex-row-reverse',
                )}
              >
                {/* Flecha */}
                <svg
                  aria-hidden="true"
                  width="30" height="14" viewBox="0 0 30 14"
                  className={cn('shrink-0 text-[var(--green-600)]', !calloutOnRight && 'rotate-180')}
                >
                  <path d="M0 7h24M16 1l8 6-8 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <div className="min-w-0 rounded-2xl border border-[var(--neutral-100)] bg-white p-3.5 text-left shadow-[0_16px_36px_rgba(23,50,77,0.16)]">
                  <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-[var(--green-600)]">
                    {status === 'current' ? 'Siguiente actividad pendiente' : item.typeLabel}
                  </p>
                  <p className="mt-0.5 truncate text-[0.875rem] font-bold leading-tight text-[var(--ink)]">{item.title}</p>
                  <p className="mt-0.5 text-[0.75rem] text-[var(--ink-muted)]">
                    {item.typeLabel}{item.durationMinutes ? ` · ${item.durationMinutes} min` : ''}
                  </p>
                  {!blocked && (
                    <button
                      type="button"
                      onClick={() => onOpen?.(item)}
                      className="mt-2.5 w-full rounded-full bg-[var(--green-600)] px-3 py-2 text-[0.8125rem] font-bold text-white transition-colors hover:bg-[var(--green-700)]"
                    >
                      {status === 'done' ? 'Repasar' : 'Continuar'}
                    </button>
                  )}
                </div>
              </div>
            )}

            <p className="mt-3 max-w-[6.5rem] text-center text-[0.75rem] font-bold uppercase leading-tight text-[var(--ink-muted)]">
              {item.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}

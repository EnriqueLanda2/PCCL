/* ───────────────────────────────────────────
   CourseRoadmap — ruta de temas del curso
   ───────────────────────────────────────────
   Presenta las lecciones como un camino de nodos: un círculo por tema, unidos
   por una línea que se va llenando conforme se completan. Comunica de un
   vistazo dos cosas que una lista no comunica — cuánto falta y cuál es el
   siguiente paso.

   Estados de un nodo:
     completado → círculo lleno con check
     actual     → círculo destacado, con el tooltip abierto y la llamada a la
                  acción; es el único que "invita" a seguir
     próximo    → apagado y con candado

   El candado es informativo: indica que aún no toca, no que el servidor lo
   impida. Se controla con `sequential`; con `sequential={false}` los temas
   próximos se pueden abrir igualmente.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { APP_ICONS } from '@/lib/icons';
import { cn } from '@/lib/cn';
import type { Lesson } from '@/lib/types';

export type RoadmapStatus = 'done' | 'current' | 'upcoming';

/** Icono según el tipo de contenido; el genérico es un libro. */
function iconFor(lesson: Lesson): string {
  const byType: Record<string, string> = {
    video: APP_ICONS.video,
    quiz: APP_ICONS.quiz,
    practice: APP_ICONS.practice,
    reading: APP_ICONS.reading,
    live: APP_ICONS.live,
    link: APP_ICONS.link,
    file: APP_ICONS.file,
    text: APP_ICONS.document,
  };
  return byType[lesson.contentType] ?? APP_ICONS.book;
}

/** Texto plano a partir del contenido, para el resumen del tooltip. */
function summarise(lesson: Lesson, limit = 150): string {
  const plain = (lesson.content ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!plain) return 'Sin descripción disponible para este tema.';
  return plain.length > limit ? `${plain.slice(0, limit).trimEnd()}…` : plain;
}

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  done: 'Completado',
  current: 'Actual',
  upcoming: 'Bloqueado',
};

interface RoadmapNode {
  lesson: Lesson;
  status: RoadmapStatus;
}

function NodeTooltip({
  node,
  onOpen,
  blocked,
}: Readonly<{ node: RoadmapNode; onOpen: () => void; blocked: boolean }>) {
  const { lesson, status } = node;
  return (
    <div
      role="tooltip"
      className={cn(
        'absolute bottom-[calc(100%+0.9rem)] left-1/2 z-20 w-[17.5rem] -translate-x-1/2',
        'rounded-2xl border border-[var(--neutral-100)] bg-white p-4 text-left',
        'shadow-[0_18px_40px_rgba(23,50,77,0.18)]',
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--green-50)] text-[var(--green-700)]">
          <Icon icon={iconFor(lesson)} width={18} height={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
            Título
          </p>
          <p className="text-[0.9375rem] font-bold leading-tight text-[var(--ink)]">{lesson.title}</p>
        </div>
      </div>

      <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
        Descripción
      </p>
      <p className="mt-0.5 text-[0.8125rem] leading-snug text-[var(--ink-soft)]">{summarise(lesson)}</p>

      <p className="mt-3 text-[0.8125rem] text-[var(--ink-soft)]">
        <span className="font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">Estado: </span>
        {STATUS_LABEL[status]}
      </p>

      <button
        type="button"
        onClick={onOpen}
        disabled={blocked}
        className={cn(
          'mt-3 w-full rounded-full px-4 py-2.5 text-[0.875rem] font-bold text-white transition-colors',
          blocked
            ? 'cursor-not-allowed bg-[var(--neutral-200)] text-[var(--ink-muted)]'
            : 'bg-[var(--green-600)] hover:bg-[var(--green-700)]',
        )}
      >
        {blocked ? 'Completa el tema anterior' : status === 'done' ? 'Repasar lección' : 'Continuar lección'}
      </button>

      {/* Pico del bocadillo. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[var(--neutral-100)] bg-white"
      />
    </div>
  );
}

export interface CourseRoadmapProps {
  lessons: Lesson[];
  /** Ids de lecciones ya completadas. */
  completedIds?: ReadonlySet<string>;
  onOpen?: (lesson: Lesson) => void;
  /** Si los temas posteriores al actual quedan bloqueados. */
  sequential?: boolean;
  className?: string;
}

export function CourseRoadmap({
  lessons,
  completedIds,
  onOpen,
  sequential = true,
  className,
}: Readonly<CourseRoadmapProps>) {
  const nodes = useMemo<RoadmapNode[]>(() => {
    const ordered = [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const isDone = (lesson: Lesson) => completedIds?.has(lesson.id) ?? lesson.completed ?? false;
    /* El tema actual es el primero sin completar. Si están todos hechos no hay
       "actual": el curso está terminado y ningún nodo debe pedir acción. */
    const currentIndex = ordered.findIndex((lesson) => !isDone(lesson));

    return ordered.map((lesson, index) => {
      let status: RoadmapStatus = 'done';
      if (index === currentIndex) status = 'current';
      else if (currentIndex !== -1 && index > currentIndex) status = 'upcoming';
      return { lesson, status };
    });
  }, [lessons, completedIds]);

  const currentIndex = nodes.findIndex((node) => node.status === 'current');
  const [hovered, setHovered] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  /* Se desplaza la vista hasta el tema actual. En un curso largo el nodo que
     importa queda fuera de pantalla y el usuario no lo encontraría. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || currentIndex < 0) return;
    const node = rail.querySelector<HTMLElement>(`[data-node-index="${currentIndex}"]`);
    node?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentIndex]);

  if (nodes.length === 0) return null;

  /* El tooltip visible: el que se señala con el ratón/teclado y, si no hay
     ninguno, el tema actual. */
  const openIndex = hovered ?? (currentIndex >= 0 ? currentIndex : null);

  return (
    <section className={cn('relative', className)} aria-label="Ruta de temas del curso">
      <div
        ref={railRef}
        /* pt generoso: el tooltip se despliega hacia arriba y necesita aire
           dentro del contenedor con scroll, o quedaría recortado. */
        className="flex items-start gap-0 overflow-x-auto px-1 pb-2 pt-[17.5rem]"
      >
        {nodes.map((node, index) => {
          const { lesson, status } = node;
          const blocked = sequential && status === 'upcoming';
          const isOpen = openIndex === index;

          return (
            <div key={lesson.id} className="flex min-w-0 shrink-0 items-start">
              {/* ── Conector con el nodo anterior ── */}
              {index > 0 && (
                <div
                  aria-hidden="true"
                  className="relative mt-[2.1rem] h-1.5 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--neutral-200)] sm:w-16"
                >
                  <span
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full bg-[var(--green-600)]',
                      /* La animación de avance: el tramo se llena al pasar el
                         tema anterior. `motion-reduce` lo desactiva para quien
                         pidió menos movimiento. */
                      'transition-[width] duration-700 ease-out motion-reduce:transition-none',
                    )}
                    style={{
                      width: nodes[index - 1].status === 'done' ? '100%' : '0%',
                      transitionDelay: `${Math.min(index, 8) * 90}ms`,
                    }}
                  />
                </div>
              )}

              {/* ── Nodo ── */}
              <div
                data-node-index={index}
                className="relative flex w-[7.5rem] flex-col items-center gap-2 px-1"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {isOpen && (
                  <NodeTooltip
                    node={node}
                    blocked={blocked}
                    onOpen={() => !blocked && onOpen?.(lesson)}
                  />
                )}

                <button
                  type="button"
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                  onClick={() => !blocked && onOpen?.(lesson)}
                  aria-current={status === 'current' ? 'step' : undefined}
                  aria-disabled={blocked}
                  title={lesson.title}
                  className={cn(
                    'relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full border-[3px]',
                    'transition-transform duration-200 ease-out',
                    blocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105',
                    status === 'done' &&
                      'border-[var(--green-700)] bg-[var(--green-700)] text-white shadow-[0_8px_20px_rgba(31,154,75,0.28)]',
                    status === 'current' &&
                      'border-[var(--green-500)] bg-white text-[var(--green-700)] shadow-[0_10px_26px_rgba(31,154,75,0.32)] scale-105',
                    status === 'upcoming' &&
                      'border-[var(--neutral-200)] bg-[var(--neutral-100)] text-[var(--neutral-300)]',
                  )}
                >
                  <Icon icon={iconFor(lesson)} width={30} height={30} />

                  {/* Marca de estado sobre el círculo. */}
                  {status === 'done' && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[var(--green-600)] text-white">
                      <Icon icon={APP_ICONS.check} width={14} height={14} />
                    </span>
                  )}
                  {status === 'upcoming' && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[var(--neutral-300)] text-white">
                      <Icon icon={APP_ICONS.lock} width={13} height={13} />
                    </span>
                  )}

                  {/* Número del tema, colgando bajo el círculo. */}
                  <span
                    className={cn(
                      'absolute -bottom-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center',
                      'rounded-full border-2 border-white text-[0.6875rem] font-extrabold',
                      status === 'upcoming'
                        ? 'bg-[var(--neutral-200)] text-[var(--ink-muted)]'
                        : 'bg-[var(--green-600)] text-white',
                    )}
                  >
                    {index + 1}
                  </span>
                </button>

                <div className="mt-3 text-center">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                    Tema {index + 1}
                  </p>
                  <p
                    className={cn(
                      'text-[0.8125rem] font-bold uppercase leading-tight',
                      status === 'upcoming' ? 'text-[var(--ink-muted)]' : 'text-[var(--ink)]',
                    )}
                  >
                    {lesson.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

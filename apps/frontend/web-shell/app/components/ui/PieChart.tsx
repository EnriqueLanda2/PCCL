/* ───────────────────────────────────────────
   PieChart — gráfica de dona SVG, mismo lenguaje
   visual que RadarChart (mismo archivo hermano):
   trazado a mano, sin librería externa, paleta
   validada, tooltip por segmento, leyenda.
   ─────────────────────────────────────────── */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

export interface PieChartDatum {
  label: string;
  value: number;
  /** Permite reusar los mismos datos en <RadarChart> (que espera Record<string, string | number>) */
  [key: string]: string | number;
}

interface PieChartProps {
  data: PieChartDatum[];
  title?: string;
  description?: string;
  className?: string;
}

/* Mismos tonos que Badge.tsx (variantCls) — para que un segmento "verde" en
   una gráfica y una insignia verde en el resto de la UI signifiquen lo mismo */
const SLICE_COLORS = ['#1F9A4B', '#2566CB', '#B87400', '#5A4AB2', '#14A6A6', '#BF2600'];

const CX = 110;
const CY = 110;
const R_OUTER = 96;
const R_INNER = 58;

function arcPath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const p = (r: number, deg: number): [number, number] => [cx + r * Math.cos(toRad(deg)), cy + r * Math.sin(toRad(deg))];
  const [x1, y1] = p(rOuter, startDeg);
  const [x2, y2] = p(rOuter, endDeg);
  const [x3, y3] = p(rInner, endDeg);
  const [x4, y4] = p(rInner, startDeg);
  return [
    `M ${x1} ${y1}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

export function PieChart({ data, title, description, className }: Readonly<PieChartProps>) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <figure className={cn('m-0', className)}>
        {(title || description) && (
          <figcaption className="mb-3">
            {title && <p className="text-lg font-semibold text-[var(--ink)] leading-tight">{title}</p>}
            {description && <p className="mt-0.5 text-sm text-[var(--ink-muted)]">{description}</p>}
          </figcaption>
        )}
        <p className="py-8 text-center text-sm text-[var(--ink-muted)]">Sin datos aún.</p>
      </figure>
    );
  }

  const slices = data.reduce<Array<PieChartDatum & { start: number; end: number; color: string }>>((acc, d, i) => {
    const start = acc.at(-1)?.end ?? 0;
    const end = start + (d.value / total) * 360;
    acc.push({ ...d, start, end, color: SLICE_COLORS[i % SLICE_COLORS.length] });
    return acc;
  }, []);

  return (
    <figure className={cn('m-0', className)}>
      {(title || description) && (
        <figcaption className="mb-3">
          {title && <p className="text-lg font-semibold text-[var(--ink)] leading-tight">{title}</p>}
          {description && <p className="mt-0.5 text-sm text-[var(--ink-muted)]">{description}</p>}
        </figcaption>
      )}

      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-shrink-0">
          <svg viewBox="0 0 220 220" width={180} height={180} role="img" aria-label={title ?? 'Gráfica circular'}>
            {slices.map((s, i) => (
              <path
                key={s.label}
                d={arcPath(CX, CY, hovered === i ? R_OUTER + 4 : R_OUTER, R_INNER, s.start, s.end)}
                fill={s.color}
                opacity={hovered === null || hovered === i ? 1 : 0.45}
                stroke="#fff"
                strokeWidth={2}
                className="transition-all duration-150"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-2xl text-[var(--ink)]">
              {hovered !== null ? slices[hovered].value : total}
            </span>
            <span className="text-[0.625rem] uppercase tracking-wide text-[var(--ink-muted)]">
              {hovered !== null ? slices[hovered].label : 'Total'}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          {slices.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-2 py-1 text-left text-[0.8125rem] transition-colors',
                hovered === i ? 'bg-[#F8FBF5]' : 'bg-transparent',
              )}
            >
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 truncate text-[var(--ink-soft)]">{s.label}</span>
              <span className="font-semibold text-[var(--ink)]">{s.value}</span>
              <span className="w-9 flex-shrink-0 text-right text-[0.6875rem] text-[var(--ink-muted)]">
                {Math.round((s.value / total) * 100)}%
              </span>
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
}

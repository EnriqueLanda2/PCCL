/* ───────────────────────────────────────────
   RadarChart — gráfica de radar SVG
   Hasta 2 series (paleta verde/azul validada
   para CVD sobre superficie clara) · leyenda ·
   tooltip por vértice · texto en tokens de tinta.
   ─────────────────────────────────────────── */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

type Datum = Record<string, string | number>;

interface RadarChartProps {
  data: Datum[];
  /** Campo que nombra cada eje (p. ej. "categoria") */
  angleKey: string;
  /** Campos numéricos a graficar (máx. 2 series) */
  valueKeys: string[];
  /** Etiquetas visibles de cada serie, en el mismo orden que valueKeys */
  seriesLabels?: string[];
  title?: string;
  description?: string;
  /** Valor máximo de la escala (por defecto 100) */
  max?: number;
  className?: string;
}

/* Orden fijo de tonos — verde Rumbo y azul de apoyo (ΔE CVD 91 entre sí) */
const SERIES_COLORS = ['#1F9A4B', '#2566CB'];

const CX = 160;
const CY = 148;
const R  = 102;
const RINGS = 4;

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export function RadarChart({
  data,
  angleKey,
  valueKeys,
  seriesLabels,
  title,
  description,
  max = 100,
  className,
}: Readonly<RadarChartProps>) {
  const [hovered, setHovered] = useState<number | null>(null);

  const n = data.length;
  const keys = valueKeys.slice(0, SERIES_COLORS.length);
  const labels = seriesLabels ?? keys;
  const angleFor = (i: number) => (360 / n) * i;

  const ringPolys = Array.from({ length: RINGS }, (_, ring) => {
    const r = (R * (ring + 1)) / RINGS;
    return data.map((_, i) => polar(CX, CY, r, angleFor(i)).join(',')).join(' ');
  });

  const seriesPoints = keys.map((key) =>
    data.map((d, i) => {
      const v = Math.max(0, Math.min(max, Number(d[key]) || 0));
      return polar(CX, CY, (R * v) / max, angleFor(i));
    })
  );

  return (
    <figure className={cn('m-0', className)}>
      {(title || description) && (
        <figcaption className="mb-3">
          {title && <p className="text-lg font-semibold text-[var(--ink)] leading-tight">{title}</p>}
          {description && <p className="mt-0.5 text-sm text-[var(--ink-muted)]">{description}</p>}
        </figcaption>
      )}

      <div className="relative">
        <svg viewBox="0 0 320 300" className="w-full" role="img" aria-label={title ?? 'Gráfica de radar'}>
          {/* Rejilla recesiva */}
          {ringPolys.map((points, i) => (
            <polygon key={points} points={points} fill="none" stroke="#E7EDE2" strokeWidth={i === RINGS - 1 ? 1.4 : 1} />
          ))}
          {data.map((_, i) => {
            const [x, y] = polar(CX, CY, R, angleFor(i));
            return <line key={`axis-${angleFor(i)}`} x1={CX} y1={CY} x2={x} y2={y} stroke="#E7EDE2" strokeWidth={1} />;
          })}

          {/* Series: relleno suave + línea 2px + marcador ≥8px */}
          {seriesPoints.map((points, s) => (
            <g key={keys[s]}>
              <polygon
                points={points.map((p) => p.join(',')).join(' ')}
                fill={SERIES_COLORS[s]}
                fillOpacity={0.13}
                stroke={SERIES_COLORS[s]}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              {points.map(([x, y], i) => (
                <circle
                  key={`${keys[s]}-${data[i][angleKey]}`}
                  cx={x} cy={y} r={hovered === i ? 5 : 4}
                  fill={SERIES_COLORS[s]}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </g>
          ))}

          {/* Etiquetas de eje — tokens de tinta, nunca color de serie */}
          {data.map((d, i) => {
            const angle = angleFor(i);
            const [x, y] = polar(CX, CY, R + 16, angle);
            let anchor: 'middle' | 'start' | 'end' = 'middle';
            if (x > CX + 8) anchor = 'start';
            else if (x < CX - 8) anchor = 'end';
            return (
              <text
                key={`label-${d[angleKey]}`}
                x={x} y={y + 4}
                textAnchor={anchor}
                fontSize={12}
                fontWeight={hovered === i ? 700 : 500}
                fill={hovered === i ? 'var(--ink)' : 'var(--ink-soft)'}
              >
                {String(d[angleKey])}
              </text>
            );
          })}

          {/* Zonas de hover por eje (blancos de interacción amplios) */}
          {data.map((d, i) => {
            const [x, y] = polar(CX, CY, R * 0.72, angleFor(i));
            return (
              <circle
                key={`hit-${d[angleKey]}`}
                cx={x} cy={y} r={26}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>

        {/* Tooltip del vértice activo */}
        {hovered !== null && (
          <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-xl border border-[#E4EBDD] bg-white px-3.5 py-2 shadow-lg animate-fade-in">
            <p className="text-[12px] font-bold text-[var(--ink)]">{String(data[hovered][angleKey])}</p>
            {keys.map((key, s) => (
              <p key={key} className="flex items-center gap-1.5 text-[12px] text-[var(--ink-soft)]">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: SERIES_COLORS[s] }} />
                {labels[s]}: <strong className="text-[var(--ink)]">{Number(data[hovered][key]) || 0}</strong>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Leyenda — siempre presente con ≥2 series */}
      {keys.length > 1 && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          {keys.map((key, s) => (
            <span key={key} className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--ink-soft)]">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: SERIES_COLORS[s] }} />
              {labels[s]}
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}

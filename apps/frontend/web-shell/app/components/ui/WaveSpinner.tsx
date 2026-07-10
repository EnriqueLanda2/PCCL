/* ───────────────────────────────────────────
   WaveSpinner — loader global de la plataforma
   Barras verdes que ondulan en secuencia.
   Tamaños: sm · md · lg · xl
   ─────────────────────────────────────────── */

import { cn } from '@/lib/cn';

type WaveSpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface WaveSpinnerProps {
  size?: WaveSpinnerSize;
  /** Texto accesible anunciado a lectores de pantalla */
  label?: string;
  className?: string;
}

const sizeTokens: Record<WaveSpinnerSize, { bar: string; gap: string; height: string }> = {
  sm: { bar: 'w-[3px]', gap: 'gap-[3px]', height: 'h-4'  },
  md: { bar: 'w-1',     gap: 'gap-1',     height: 'h-6'  },
  lg: { bar: 'w-1.5',   gap: 'gap-1.5',   height: 'h-9'  },
  xl: { bar: 'w-2',     gap: 'gap-2',     height: 'h-12' },
};

const BARS = [0, 1, 2, 3, 4];

export function WaveSpinner({ size = 'md', label = 'Cargando…', className }: Readonly<WaveSpinnerProps>) {
  const t = sizeTokens[size];
  return (
    <output
      aria-label={label}
      className={cn('inline-flex items-center justify-center', t.gap, t.height, className)}
    >
      {BARS.map((i) => (
        <span
          key={i}
          className={cn('h-full rounded-full bg-[var(--green-500)] wave-spinner-bar', t.bar)}
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </output>
  );
}

/** Loader de página completa — úsalo en loading.tsx y estados de carga de módulos */
export function PageLoader({ label = 'Cargando contenido…' }: Readonly<{ label?: string }>) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4">
      <WaveSpinner size="lg" label={label} />
      <p className="text-sm text-[var(--ink-muted)] animate-fade-in">{label}</p>
    </div>
  );
}

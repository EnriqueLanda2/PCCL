/* ───────────────────────────────────────────
   WaveSpinner — loader global de la plataforma.

   La implementación real vive en el componente del
   registry (registry/new-york/ui/wave-spinner). Este
   archivo se conserva como fachada para no tocar los
   ~14 puntos de carga que ya lo importan con la firma
   { size, label }: cambiar el motor aquí los actualiza
   a todos de golpe.
   ─────────────────────────────────────────── */

'use client';

import { WaveSpinner as RegistryWaveSpinner } from '@/registry/new-york/ui/wave-spinner';

type WaveSpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface WaveSpinnerProps {
  size?: WaveSpinnerSize;
  /** Texto accesible anunciado a lectores de pantalla */
  label?: string;
  className?: string;
}

export function WaveSpinner({ size = 'md', label = 'Cargando…', className }: Readonly<WaveSpinnerProps>) {
  return (
    <RegistryWaveSpinner
      size={size}
      /* Verde de marca en vez del azul por defecto del registry */
      color="var(--green-500)"
      pattern="square3x3"
      animation="ripple"
      dotShape="rounded"
      aria-label={label}
      className={className}
    />
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

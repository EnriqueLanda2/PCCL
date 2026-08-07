/* ───────────────────────────────────────────
   StudentAvatar — componente ÚNICO de avatar
   ───────────────────────────────────────────
   Todo el producto pinta avatares de persona a través de este componente.
   Tenerlo centralizado es lo que garantiza que el mismo alumno se vea igual en
   el listado, en su perfil, en una tarjeta o en una tabla, y que un cambio de
   estilo futuro se haga en un solo sitio.

   Cascada de resolución, en este orden y por este motivo:
     1. `avatarUrl` — el avatar que el propio alumno publicó. Nunca se
        sustituye ni se regenera: es su identidad.
     2. Retrato de la galería, elegido de forma determinista por `userId`.
     3. Iniciales — solo si no hay ninguna de las dos (usuario sin id, o
        fallo de carga de la imagen).
   ─────────────────────────────────────────── */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { avatarImageFor } from '@/lib/avatar/portraits';

export type StudentAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Lado en píxeles por tamaño. Se usa también como `width/height` reales de la
 *  imagen para que el navegador reserve el espacio y no haya salto de layout. */
const SIZE_PX: Record<StudentAvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 48,
  lg: 72,
  xl: 128,
  '2xl': 192,
};

const TEXT_CLS: Record<StudentAvatarSize, string> = {
  xs: 'text-[0.625rem]',
  sm: 'text-[0.75rem]',
  md: 'text-[0.875rem]',
  lg: 'text-[1.125rem]',
  xl: 'text-[1.75rem]',
  '2xl': 'text-[2.5rem]',
};

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '··';
  const first = parts[0][0] ?? '';
  const second = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : (parts[0][1] ?? '');
  return (first + second).toUpperCase();
}

export interface StudentAvatarProps {
  /** Identifica al alumno. Determina qué retrato de la galería le toca. */
  userId: string;
  fullName: string;
  /** Avatar publicado por el alumno. Si existe, manda sobre la galería. */
  avatarUrl?: string | null;
  size?: StudentAvatarSize;
  /** Anillo claro alrededor; se usa sobre fondos de color. */
  ring?: boolean;
  className?: string;
}

export function StudentAvatar({
  userId,
  fullName,
  avatarUrl,
  size = 'md',
  ring = false,
  className,
}: Readonly<StudentAvatarProps>) {
  const source = avatarImageFor(userId, avatarUrl);
  /* Se guarda QUÉ imagen falló, no un booleano. Así, cuando cambia la fuente
     (por ejemplo el alumno publica su avatar), el fallo anterior deja de
     aplicar solo — sin un efecto que reinicie el estado. */
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = source !== null && failedSource === source;

  const px = SIZE_PX[size];
  const shell = cn(
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
    'bg-[var(--green-50)]',
    ring && 'ring-2 ring-white shadow-[0_2px_10px_rgba(31,154,75,0.18)]',
    className,
  );

  if (!source || failed) {
    return (
      <span
        className={cn(shell, 'font-semibold text-[var(--green-700)]', TEXT_CLS[size])}
        style={{ width: px, height: px }}
        title={fullName}
      >
        {getInitials(fullName)}
      </span>
    );
  }

  return (
    <span className={shell} style={{ width: px, height: px }} title={fullName}>
      {/* <img> y no next/image: la fuente puede ser una URL del almacenamiento
          remoto configurado en el backend, que exigiría declarar el host en
          next.config y cambia según el despliegue. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={source}
        alt=""
        width={px}
        height={px}
        loading="lazy"
        decoding="async"
        onError={() => setFailedSource(source)}
        /* `object-top` porque los retratos encuadran cabeza y hombros: centrar
           recortaría la cara en los tamaños pequeños. */
        className="h-full w-full object-cover object-top"
      />
    </span>
  );
}

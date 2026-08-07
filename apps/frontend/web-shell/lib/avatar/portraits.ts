/* ───────────────────────────────────────────
   Galería de retratos compartida
   ───────────────────────────────────────────
   Reserva de avatares para alumnos que todavía no han personalizado el suyo.

   Son PNG pre-renderizados por el pipeline (`tools/blender/render_portraits.py`)
   con cámara, luz, escala y perspectiva IDÉNTICAS. Esa es la razón de que sean
   imágenes y no visores 3D: una vista de alumnos pinta decenas de avatares a la
   vez, y montar un canvas WebGL por tarjeta cuesta memoria y fps además de
   producir encuadres ligeramente distintos según el tamaño del contenedor.

   La asignación es DETERMINISTA por `userId`: el mismo alumno muestra siempre
   el mismo retrato, en cualquier pantalla y entre sesiones. Sin esto, un
   alumno cambiaría de cara al navegar, que es justo lo que hay que evitar.
   ─────────────────────────────────────────── */

import { validateCustomPath } from './custom';

/** Cuerpos y cuántos retratos aporta cada uno. Debe coincidir con el pipeline
 *  (`PORTRAITS_PER_BODY` en tools/avatar-pipeline/config.mjs). */
const BODIES = ['female-base', 'male-base', 'neutral-base'] as const;
const PER_BODY = 8;

/**
 * Rutas de la galería, en el mismo orden que las genera el pipeline: cada
 * cuerpo ocupa un bloque consecutivo de índices.
 */
export const PORTRAITS: string[] = BODIES.flatMap((bodyId, bodyIndex) =>
  Array.from(
    { length: PER_BODY },
    (_, offset) =>
      `/avatars/custom/portraits/${bodyId}-${String(bodyIndex * PER_BODY + offset).padStart(2, '0')}.png`,
  ),
);

/**
 * Hash estable de una cadena (FNV-1a de 32 bits).
 *
 * Se usa una función explícita y no algo como `length % n` porque los ids son
 * UUID y variantes triviales repartirían mal: haría falta que alumnos
 * consecutivos no compartieran retrato.
 */
function hash(value: string): number {
  let result = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 0x01000193);
  }
  return result >>> 0;
}

/** Retrato asignado a un usuario. Siempre el mismo para el mismo `userId`. */
export function portraitForUser(userId: string): string {
  if (PORTRAITS.length === 0) return '';
  return PORTRAITS[hash(userId) % PORTRAITS.length];
}

/**
 * Resuelve qué imagen mostrar para un alumno.
 *
 * Prioridad deliberada: si el alumno ya publicó su avatar, se respeta y no se
 * sustituye nunca por uno de la galería. La galería solo cubre el hueco.
 */
export function avatarImageFor(userId: string, avatarUrl?: string | null): string | null {
  if (avatarUrl) return avatarUrl;
  if (!userId) return null;
  const portrait = portraitForUser(userId);
  return validateCustomPath(portrait, '.png') ? portrait : null;
}

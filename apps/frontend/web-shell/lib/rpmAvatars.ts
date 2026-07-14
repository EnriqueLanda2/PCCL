/* ───────────────────────────────────────────
   Ready Player Me — configuración de avatares
   ─────────────────────────────────────────────
   RPM solo puede renderizar avatares que YA EXISTEN (creados con su
   Avatar Creator). No hay forma de generar avatares "cyberpunk" (o de
   cualquier estilo específico) al vuelo sin una cuenta RPM propia con
   esos assets — por eso este pool empieza vacío en vez de traer IDs
   inventados que romperían en producción.

   Cómo poblarlo:
   1. Crea avatares en https://demo.readyplayer.me (o tu subdominio RPM)
      con el outfit/estilo que quieras (cyberpunk, casual, etc.).
   2. Al exportar, copia el ID del .glb resultante
      (https://models.readyplayer.me/<ID>.glb → el <ID>).
   3. Pega esos IDs aquí abajo. Mientras el pool esté vacío, la UI usa
      el avatar de iniciales normal (StudentAvatar hace el fallback solo).
   ─────────────────────────────────────────── */

export const RPM_AVATAR_POOL: string[] = [];

/** Elige un avatar del pool de forma determinística según el userId (mismo alumno → mismo avatar siempre). */
export function pickAvatarId(userId: string): string | null {
  if (RPM_AVATAR_POOL.length === 0) return null;
  const hash = [...userId].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  return RPM_AVATAR_POOL[hash % RPM_AVATAR_POOL.length];
}

interface Rpm2dRenderOptions {
  pose?: 'relaxed' | 'thumbs-up' | 'power-stance' | 'standing';
  expression?: 'happy' | 'lol' | 'sad' | 'scared' | 'rage';
}

/** URL de render 2D (imagen estática, liviana — ideal para grillas de tarjetas). */
export function rpm2dRenderUrl(avatarId: string, opts?: Rpm2dRenderOptions): string {
  const params = new URLSearchParams({ scene: 'fullbody-portrait-v1-transparent' });
  if (opts?.pose) params.set('pose', opts.pose);
  if (opts?.expression) params.set('expression', opts.expression);
  return `https://models.readyplayer.me/${avatarId}.png?${params.toString()}`;
}

/** URL del modelo 3D (.glb) para cargar en un visor interactivo (three.js). */
export function rpm3dModelUrl(avatarId: string): string {
  return `https://models.readyplayer.me/${avatarId}.glb`;
}

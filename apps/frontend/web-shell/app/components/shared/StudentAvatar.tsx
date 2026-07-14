/* ───────────────────────────────────────────
   StudentAvatar — avatar de alumno para la grilla
   de "Progreso de estudiantes". Usa el render 2D de
   Ready Player Me si hay un avatarId configurado en
   lib/rpmAvatars.ts; si no (pool vacío o falla la
   imagen), cae al Avatar de iniciales de siempre.
   ─────────────────────────────────────────── */

'use client';

import { useState } from 'react';
import { Avatar, getInitials, type AvatarProps } from '@/app/components/ui/Avatar';
import { pickAvatarId, rpm2dRenderUrl } from '@/lib/rpmAvatars';

interface StudentAvatarProps {
  userId: string;
  fullName: string;
  size?: AvatarProps['size'];
  /** px — tamaño de la imagen RPM cuando hay avatarId (independiente del tamaño del fallback) */
  imageSize?: number;
}

export function StudentAvatar({ userId, fullName, size = 'md', imageSize = 96 }: StudentAvatarProps) {
  const avatarId = pickAvatarId(userId);
  const [failed, setFailed] = useState(false);

  if (!avatarId || failed) {
    return <Avatar initials={getInitials(fullName)} size={size} />;
  }

  return (
    <img
      src={rpm2dRenderUrl(avatarId, { pose: 'relaxed' })}
      alt={fullName}
      width={imageSize}
      height={imageSize}
      onError={() => setFailed(true)}
      style={{ width: imageSize, height: imageSize, objectFit: 'contain', flexShrink: 0 }}
    />
  );
}

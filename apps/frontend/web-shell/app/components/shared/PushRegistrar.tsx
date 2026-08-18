/* ───────────────────────────────────────────
   PushRegistrar — pide permiso de notificaciones y registra el token FCM
   del dispositivo apenas hay una sesión activa. No pinta nada.
   ─────────────────────────────────────────── */

'use client';

import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { requestPushToken } from '@/lib/firebase';
import { api } from '@/lib/api';

export function PushRegistrar() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;
    let alive = true;
    requestPushToken().then((token) => {
      if (alive && token) api.registerPushToken(token).catch(() => {});
    });
    return () => { alive = false; };
  }, [user]);

  return null;
}

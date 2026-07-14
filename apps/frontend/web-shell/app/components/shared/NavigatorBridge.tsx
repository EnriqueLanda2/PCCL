'use client';

/* ───────────────────────────────────────────
   NavigatorBridge — registra el router de Next
   en el singleton de lib/apiClient.ts para que
   el interceptor de 401 (fuera del árbol React)
   navegue por SPA en vez de forzar un reload
   con window.location. Se monta una sola vez
   en el layout raíz, cubre rutas públicas y
   protegidas por igual.
   ─────────────────────────────────────────── */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setNavigator } from '@/lib/apiClient';

export function NavigatorBridge() {
  const router = useRouter();

  useEffect(() => {
    setNavigator((path) => router.replace(path));
  }, [router]);

  return null;
}

/* ───────────────────────────────────────────
   RouteGuard — protección de rutas por RBAC
   A diferencia de proxy.ts (que solo exige sesión),
   este componente exige el privilegio específico del
   módulo que corresponde a la ruta actual. Se monta
   una sola vez en <PortalShell>, así que protege
   automáticamente toda la app sin tocar cada página.
   ─────────────────────────────────────────── */

'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { requiredModuleFor } from '@/lib/routeGuard';
import { EmptyState } from './EmptyState';
import { APP_ICONS } from '@/lib/icons';

type GuardState = 'checking' | 'allowed' | 'denied';

function getCachedPermissions(): string[] | null {
  try {
    const raw = sessionStorage.getItem('pccl_access');
    if (!raw) return null;
    return (JSON.parse(raw) as { permissions?: string[] }).permissions ?? [];
  } catch {
    return null;
  }
}

export function RouteGuard({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [state, setState] = useState<GuardState>('checking');

  useEffect(() => {
    const requiredModule = requiredModuleFor(pathname);

    if (!requiredModule) {
      setState('allowed');
      return;
    }

    const permissions = getCachedPermissions();
    if (permissions === null) {
      /* Sin perfil cacheado aún (primer render tras login) — proxy.ts ya exige sesión */
      setState('allowed');
      return;
    }

    const ok = permissions.some((p) => p.startsWith(`${requiredModule}:`));
    setState(ok ? 'allowed' : 'denied');
  }, [pathname]);

  if (state === 'checking') return null;

  if (state === 'denied') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={APP_ICONS.lock}
          title="Acceso restringido"
          description="Tu rol no tiene permisos para ver esta sección."
        />
      </div>
    );
  }

  return <>{children}</>;
}

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
import { api } from '@/lib/api';
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

    const cached = getCachedPermissions();
    if (cached !== null) {
      const ok = cached.some((p) => p.startsWith(`${requiredModule}:`));
      setState(ok ? 'allowed' : 'denied');
      return;
    }

    /* Sin perfil cacheado aún (primer render tras login/reload) — proxy.ts ya
       exige sesión, pero eso no basta para RBAC por módulo, así que se pide
       el perfil real en vez de asumir acceso permitido. */
    let alive = true;
    api.access()
      .then((access) => {
        if (!alive) return;
        sessionStorage.setItem('pccl_access', JSON.stringify(access));
        const ok = access.permissions.some((p) => p.startsWith(`${requiredModule}:`));
        setState(ok ? 'allowed' : 'denied');
      })
      .catch(() => { if (alive) setState('denied'); });
    return () => { alive = false; };
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

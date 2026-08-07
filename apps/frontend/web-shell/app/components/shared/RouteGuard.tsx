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
import { requiredModuleFor, requiredRolesFor } from '@/lib/routeGuard';
import { api } from '@/lib/api';
import type { AccessProfile } from '@/lib/types';
import { EmptyState } from './EmptyState';
import { APP_ICONS } from '@/lib/icons';

type GuardState = 'checking' | 'allowed' | 'denied';

function getCachedAccess(): Pick<AccessProfile, 'permissions' | 'roles'> | null {
  try {
    const raw = sessionStorage.getItem('pccl_access');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AccessProfile>;
    return { permissions: parsed.permissions ?? [], roles: parsed.roles ?? [] };
  } catch {
    return null;
  }
}

/** Una ruta se permite si cumple el privilegio de módulo Y el rol exigido. */
function isAllowed(
  access: Pick<AccessProfile, 'permissions' | 'roles'>,
  requiredModule: string | null,
  requiredRoles: string[] | null,
): boolean {
  if (requiredModule && !access.permissions.some((p) => p.startsWith(`${requiredModule}:`))) return false;
  if (requiredRoles && !access.roles.some((r) => requiredRoles.includes(r))) return false;
  return true;
}

export function RouteGuard({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [state, setState] = useState<GuardState>('checking');

  useEffect(() => {
    let alive = true;
    const requiredModule = requiredModuleFor(pathname);
    const requiredRoles  = requiredRolesFor(pathname);

    const resolveState = (nextState: GuardState) => {
      if (alive) setState(nextState);
    };

    if (!requiredModule && !requiredRoles) {
      const accessCheck = requestAnimationFrame(() => resolveState('allowed'));
      return () => {
        alive = false;
        cancelAnimationFrame(accessCheck);
      };
    }

    const cached = getCachedAccess();
    if (cached !== null) {
      const accessCheck = requestAnimationFrame(() => resolveState(isAllowed(cached, requiredModule, requiredRoles) ? 'allowed' : 'denied'));
      return () => {
        alive = false;
        cancelAnimationFrame(accessCheck);
      };
    }

    /* Sin perfil cacheado aún (primer render tras login/reload) — proxy.ts ya
       exige sesión, pero eso no basta para RBAC por módulo, así que se pide
       el perfil real en vez de asumir acceso permitido. */
    api.access()
      .then((access) => {
        if (!alive) return;
        sessionStorage.setItem('pccl_access', JSON.stringify(access));
        setState(isAllowed(access, requiredModule, requiredRoles) ? 'allowed' : 'denied');
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

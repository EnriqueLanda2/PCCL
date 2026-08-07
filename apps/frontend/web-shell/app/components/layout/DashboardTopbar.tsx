/* ───────────────────────────────────────────
   DashboardTopbar — barra superior del panel
   autenticado. Convive con el Sidebar (que sigue
   siendo la navegación completa/admin); esta barra
   es la identidad + accesos rápidos + perfil, igual
   que en el mockup de referencia del dashboard.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StudentAvatar } from '@/app/components/shared/StudentAvatar';
import { api } from '@/lib/api';
import { appRoutes } from '@/lib/routes';
import { cn } from '@/lib/cn';

/* "Catálogo" iba a /learning/courses y "Mis cursos" a /learning/inscriptions:
   justo al revés de lo que dicen. Ahora el catálogo es la vista de
   descubrimiento y "Mis cursos" la lista propia. */
const NAV_LINKS = [
  { label: 'Inicio', href: appRoutes.dashboard },
  { label: 'Catálogo', href: appRoutes.catalog },
  { label: 'Mis cursos', href: appRoutes.courses },
  { label: 'Certificados', href: appRoutes.certificates },
];
const STAFF_NAV_LINKS = [
  { label: 'Ganancias', href: appRoutes.earnings },
];

function getCached<T>(key: string): T | null {
  try { return JSON.parse(sessionStorage.getItem(key) ?? 'null') as T; }
  catch { return null; }
}

export function DashboardTopbar() {
  const pathname = usePathname();
  const [userLabel, setUserLabel] = useState('Usuario');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  /* Identidad estable para elegir retrato de la galería mientras el usuario no
     haya publicado su avatar. */
  const [userId, setUserId] = useState('');
  const [resolved,  setResolved]  = useState(false);
  const [roles,     setRoles]     = useState<string[]>([]);

  useEffect(() => {
    let alive = true;

    const apply = (u: { id?: string; fullName?: string | null; email?: string; avatarUrl?: string | null }) => {
      const label = u.fullName || u.email;
      if (label) { setUserLabel(label); setResolved(true); }
      setAvatarUrl(u.avatarUrl ?? null);
      setUserId(u.id ?? u.email ?? '');
      return Boolean(u.fullName);
    };

    const syncUser = () => {
      const cached = getCached<{ id?: string; fullName?: string; email?: string; avatarUrl?: string | null }>('pccl_user');
      return cached ? apply(cached) : false;
    };
    const syncAccess = () => {
      const access = getCached<{ roles?: string[] }>('pccl_access');
      setRoles(access?.roles ?? []);
    };

    queueMicrotask(() => {
      syncAccess();
      /* sessionStorage es por pestaña: en una pestaña nueva (o tras recargar
         fuera del login) no hay nada y el avatar quedaba en "U". Se resuelve
         contra /auth/me, que ahora sí devuelve el nombre. */
      if (!syncUser()) {
        api.me()
          .then((me) => {
            if (!alive) return;
            apply(me);
            setRoles(me.roles);
            const prev = getCached<Record<string, unknown>>('pccl_user') ?? {};
            sessionStorage.setItem('pccl_user', JSON.stringify({
              ...prev, id: me.id, email: me.email, fullName: me.fullName, avatarUrl: me.avatarUrl,
            }));
          })
          .catch(() => { /* sin sesión: el proxy ya redirige al login */ });
      }
    });

    window.addEventListener('pccl_user_updated', syncUser);
    window.addEventListener('pccl_user_updated', syncAccess);
    return () => {
      alive = false;
      window.removeEventListener('pccl_user_updated', syncUser);
      window.removeEventListener('pccl_user_updated', syncAccess);
    };
  }, []);
  const navLinks = roles.some((role) => role === 'admin' || role === 'instructor')
    ? [...NAV_LINKS, ...STAFF_NAV_LINKS]
    : NAV_LINKS;

  return (
    /* max-lg:pl-16 reserva el hueco del botón hamburguesa, que va fijo sobre
       esta barra debajo de lg; sin eso se encimaba con el primer elemento. */
    <header className="flex items-center gap-3 border-b border-[#E4EBDD] bg-white px-4 py-3 max-lg:pl-16 sm:gap-6 lg:px-7">
      {/* Sin logo aquí — el Sidebar ya es la marca persistente; esta barra es
          solo nav rápida + estado de sesión, para no duplicar el logo. */}
      <nav className="hidden items-center gap-1 md:flex">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'rounded-full px-3.5 py-2 text-[0.875rem] font-medium no-underline transition-colors',
                active ? 'bg-[var(--green-50)] text-[var(--green-700)] font-semibold' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]',
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-3">

        <div className="flex items-center gap-2.5">
          <StudentAvatar userId={userId} fullName={userLabel} avatarUrl={avatarUrl} size="sm" ring />
          {/* Hasta que se resuelve el nombre se muestra un placeholder en vez de
              "Usuario", que se leería como si ese fuera su nombre real. */}
          {resolved ? (
            <span
              className="hidden max-w-[11.25rem] truncate text-[0.875rem] font-semibold text-[var(--ink)] lg:block"
              title={userLabel}
            >
              {userLabel}
            </span>
          ) : (
            <span className="hidden h-[0.875rem] w-[5.75rem] animate-pulse rounded bg-[var(--neutral-100)] lg:block" />
          )}
        </div>
      </div>
    </header>
  );
}

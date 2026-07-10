'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { Avatar, getInitials } from '@/app/components/ui/Avatar';
import { api } from '@/lib/api';
import { appRoutes } from '@/lib/routes';
import { cn } from '@/lib/cn';

/* ── Icons ── */
const icons: Record<string, React.ReactNode> = {
  home:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M3 12 12 4l9 8M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  catalog:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  courses:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM4 19a2 2 0 0 1 2-2h12" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  progress:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  certificates:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 13.5 7 22l5-3 5 3-1.5-8.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  users:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><circle cx="9" cy="8" r="4" strokeLinecap="round"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M17 11a4 4 0 1 0 0-8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  profile:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  inscriptions:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  lessons:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  live:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><rect x="2" y="6" width="14" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path d="m22 8-6 4 6 4z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  califications: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  audit:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  rbac:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  logout:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronLeft:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronRight:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

type MenuItem = { key: string; path: string; label: string; icon: string };

const menuCatalog: MenuItem[] = [
  { key: 'dashboard',     path: appRoutes.dashboard,     label: 'Resumen',             icon: 'home'       },
  { key: 'courses',       path: appRoutes.courses,       label: 'Mis cursos',          icon: 'courses'    },
  { key: 'liveClasses',   path: appRoutes.liveClasses,   label: 'Clases en vivo',      icon: 'live'       },
  { key: 'lessons',       path: appRoutes.lessons,       label: 'Temas y lecciones',   icon: 'catalog'    },
  { key: 'progress',      path: appRoutes.progress,      label: 'Estudiantes',         icon: 'progress'   },
  { key: 'certificates',  path: appRoutes.certificates,  label: 'Certificaciones',     icon: 'certificates' },
  { key: 'profile',       path: appRoutes.identity,      label: 'Perfil e impartición', icon: 'profile'    },
  { key: 'inscriptions',  path: appRoutes.inscriptions,  label: 'Inscripciones',       icon: 'inscriptions' },
  { key: 'califications', path: appRoutes.califications, label: 'Calificaciones',      icon: 'califications' },
  { key: 'reports',       path: appRoutes.audit,         label: 'Auditoría',           icon: 'audit'      },
  { key: 'users',         path: appRoutes.users,         label: 'Usuarios',            icon: 'users'      },
  { key: 'rbac',          path: appRoutes.rbac,          label: 'RBAC',                icon: 'rbac'       },
];

const learningGroup = new Set(['dashboard', 'courses', 'liveClasses', 'lessons', 'progress']);
const identityGroup = new Set(['profile']);
const certificationGroup = new Set(['certificates']);
const extraGroup = new Set(['inscriptions', 'califications', 'reports', 'users', 'rbac']);
/* El perfil es visible para cualquier usuario autenticado — no está atado a un privilegio RBAC */
const ALWAYS_VISIBLE_KEYS = ['profile'];

/* ── Section label ── */
function SectionLabel({ children, collapsed }: Readonly<{ children: React.ReactNode; collapsed: boolean }>) {
  if (collapsed) return <div className="h-px bg-white/10 mx-2 my-3" />;
  return (
    <p className="px-3 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9CA9A0] select-none">
      {children}
    </p>
  );
}

/* ── Nav item ── */
function NavItem({ item, collapsed, isActive }: Readonly<{ item: MenuItem; collapsed: boolean; isActive: boolean }>) {
  return (
    <Link
      href={item.path}
      title={collapsed ? item.label : undefined}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium',
        'transition-all duration-150 group select-none',
        isActive
          ? 'bg-[#E4F4E9] text-[var(--green-700)] shadow-[0_10px_22px_rgba(31,154,75,0.08)]'
          : 'text-[#5E6C84] hover:text-[var(--ink)] hover:bg-[#F4F7EF]',
        collapsed && 'justify-center px-2',
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[var(--green-500)] rounded-r-full" />
      )}

      {/* Icon */}
      <span className={cn('flex-shrink-0 transition-transform duration-150', isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100')}>
        {icons[item.icon]}
      </span>

      {/* Label (hidden when collapsed) */}
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

/* ── Main component ── */
export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  /* Valores por defecto — deben calzar EXACTO entre servidor y el primer render
     del cliente (antes de que corra el useEffect) para evitar un hydration
     mismatch. sessionStorage no existe en el servidor, así que su lectura
     vive solo en el useEffect de abajo, nunca en el inicializador de useState. */
  const [visibleKeys,   setVisibleKeys]   = useState<string[]>(() => menuCatalog.map((m) => m.key));
  const [userInitials,  setUserInitials]  = useState('US');
  const [userLabel,     setUserLabel]     = useState('Usuario');
  const [roleLabel,     setRoleLabel]     = useState('');
  const [loggingOut,    setLoggingOut]    = useState(false);

  useEffect(() => {
    try {
      const cachedAccess = sessionStorage.getItem('pccl_access');
      if (cachedAccess) {
        const access = JSON.parse(cachedAccess) as { menu?: { module: string; visible: boolean }[]; roles?: string[] };
        const keys = access.menu?.filter((m) => m.visible).map((m) => m.module).filter((key): key is string => Boolean(key));
        const resolved = keys?.length ? keys : menuCatalog.map((m) => m.key);
        const missingAlwaysVisible = ALWAYS_VISIBLE_KEYS.filter((key) => !resolved.includes(key));
        setVisibleKeys([...resolved, ...missingAlwaysVisible]);
        setRoleLabel(access.roles?.[0] ?? '');
      }
    } catch {
      // conserva los valores por defecto
    }

    try {
      const cachedUser = sessionStorage.getItem('pccl_user');
      if (cachedUser) {
        const user = JSON.parse(cachedUser) as { fullName?: string; email?: string };
        setUserInitials(getInitials(user.fullName ?? user.email ?? 'US'));
        setUserLabel(user.fullName ?? user.email ?? 'Usuario');
      }
    } catch {
      // conserva los valores por defecto
    }
  }, []);

  const menu            = menuCatalog.filter((m) => visibleKeys.includes(m.key));
  const learningItems   = menu.filter((m) => learningGroup.has(m.key));
  const identityItems   = menu.filter((m) => identityGroup.has(m.key));
  const certificationItems = menu.filter((m) => certificationGroup.has(m.key));
  const extraItems      = menu.filter((m) => extraGroup.has(m.key));

  const handleLogout = async () => {
    setLoggingOut(true);
    await api.logout().catch(() => {});
    sessionStorage.removeItem('pccl_user');
    sessionStorage.removeItem('pccl_access');
    router.replace(appRoutes.login);
  };

  return (
    <aside
      className={cn(
        'bg-[var(--sidebar)] flex flex-col gap-0.5 py-4 sticky top-0 h-screen overflow-y-auto overflow-x-hidden',
        'transition-all duration-300 ease-in-out border-r border-[var(--sidebar-border)] shadow-[0_0_0_1px_rgba(255,255,255,0.65)_inset]',
        'px-3 w-[282px]',
      )}
    >
      {/* ── Logo ── */}
      <div className="flex items-center justify-between pb-5 px-1">
        <Logo href={appRoutes.dashboard} />
      </div>

      {/* ── Learning section ── */}
      {learningItems.length > 0 && (
        <>
          <SectionLabel collapsed={false}>Gestión</SectionLabel>
          {learningItems.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              collapsed={false}
              isActive={pathname.startsWith(item.path)}
            />
          ))}
        </>
      )}

      {/* ── Identity section ── */}
      {identityItems.length > 0 && (
        <>
          <SectionLabel collapsed={false}>Cuenta</SectionLabel>
          {identityItems.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              collapsed={false}
              isActive={pathname.startsWith(item.path)}
            />
          ))}
        </>
      )}

      {/* ── Certification section ── */}
      {certificationItems.length > 0 && (
        <>
          <SectionLabel collapsed={false}>Certificar</SectionLabel>
          {certificationItems.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              collapsed={false}
              isActive={pathname.startsWith(item.path)}
            />
          ))}
        </>
      )}

      {extraItems.length > 0 && (
        <>
          <SectionLabel collapsed={false}>Más</SectionLabel>
          {extraItems.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              collapsed={false}
              isActive={pathname.startsWith(item.path)}
            />
          ))}
        </>
      )}

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── User card ── */}
      <div className="mx-1 mb-3 flex items-center gap-3 px-3 py-3 rounded-2xl bg-[#F7FAF3] border border-[#E3EAD9]">
        <Avatar initials={userInitials} size="sm" variant="blue" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--ink)] truncate leading-tight">{userLabel}</p>
          {roleLabel && (
            <p className="text-[11px] text-[var(--ink-muted)] truncate mt-0.5">{roleLabel}</p>
          )}
        </div>
      </div>

      {/* ── Logout ── */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium',
          'text-[#5E6C84] hover:text-[var(--ink)] hover:bg-[#F4F7EF] transition-colors duration-150',
          'cursor-pointer border-0 bg-transparent w-full disabled:opacity-50',
        )}
      >
        <span className="flex-shrink-0 opacity-70">{icons.logout}</span>
        <span>{loggingOut ? 'Saliendo…' : 'Cerrar sesión'}</span>
      </button>
    </aside>
  );
}

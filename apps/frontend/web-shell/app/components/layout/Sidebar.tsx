'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { Logo } from './Logo';
import { StudentAvatar } from '@/app/components/shared/StudentAvatar';
import { api } from '@/lib/api';
import { appRoutes } from '@/lib/routes';
import { cn } from '@/lib/cn';
import { clearUserName } from '@/lib/sessionUser';

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
  earnings:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M3 3v18h18M7 15l3-3 3 2 5-7M17 7h3v3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  califications: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  audit:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  rbac:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  logout:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronLeft:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevronRight:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  menu:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round"/></svg>,
  close:         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round"/></svg>,
  aiRumbo:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path d="M12 3a4 4 0 0 0-4 4v1a5 5 0 0 0-3 4.58V17a2 2 0 0 0 2 2h1l2 3 2-3h4l2 3 2-3h1a2 2 0 0 0 2-2v-4.42A5 5 0 0 0 16 8V7a4 4 0 0 0-4-4Z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9.5" cy="12.5" r="0.75" fill="currentColor" stroke="none"/><circle cx="14.5" cy="12.5" r="0.75" fill="currentColor" stroke="none"/></svg>,
};

type MenuItem = { key: string; path: string; label: string; icon: string };

const menuCatalog: MenuItem[] = [
  { key: 'dashboard',     path: appRoutes.dashboard,     label: 'Resumen',             icon: 'home'       },
  { key: 'aiRumbo',       path: appRoutes.aiRumbo,       label: 'AIRumbo',             icon: 'aiRumbo'    },
  { key: 'courses',       path: appRoutes.courses,       label: 'Mis cursos',          icon: 'courses'    },
  { key: 'catalog',       path: appRoutes.catalog,       label: 'Catálogo',            icon: 'catalog'    },
  { key: 'liveClasses',   path: appRoutes.liveClasses,   label: 'Clases en vivo',      icon: 'live'       },
  { key: 'earnings',      path: appRoutes.earnings,      label: 'Ganancias',           icon: 'earnings'   },
  { key: 'lessons',       path: appRoutes.lessons,       label: 'Temas y lecciones',   icon: 'catalog'    },
  { key: 'progress',      path: appRoutes.progress,      label: 'Estudiantes',         icon: 'progress'   },
  { key: 'certificates',  path: appRoutes.certificates,  label: 'Certificaciones',     icon: 'certificates' },
  { key: 'inscriptions',  path: appRoutes.inscriptions,  label: 'Inscripciones',       icon: 'inscriptions' },
  /* 'califications' se retiró del menú: la vista no aporta nada al usuario.
     La ruta y el módulo RBAC siguen existiendo, solo dejó de navegarse. */
  { key: 'reports',       path: appRoutes.audit,         label: 'Auditoría',           icon: 'audit'      },
  { key: 'users',         path: appRoutes.users,         label: 'Usuarios',            icon: 'users'      },
  { key: 'rbac',          path: appRoutes.rbac,          label: 'RBAC',                icon: 'rbac'       },
];

const learningGroup = new Set(['dashboard', 'aiRumbo', 'courses', 'catalog', 'liveClasses', 'earnings', 'lessons', 'progress']);
const certificationGroup = new Set(['certificates']);
const extraGroup = new Set(['inscriptions', 'reports', 'users', 'rbac']);

/* Red de seguridad: una entrada de `menuCatalog` que no esté en ningún grupo no
   se renderiza en ninguna parte y desaparece del menú sin dar ningún error —
   justo lo que pasó con "Perfil e impartición". Las claves sin grupo caen en
   "Más" en lugar de volverse invisibles. */
const GROUPED_KEYS = new Set<string>([
  ...learningGroup, ...certificationGroup, ...extraGroup,
]);
/* Visibles para cualquier usuario autenticado — no están atados a un privilegio
   RBAC. El catálogo entra aquí porque inscribirse no requiere permisos de
   gestión: es la vía por la que un alumno consigue sus cursos. */
/* 'aiRumbo' entra aquí también: es una vista nueva de puro frontend que el
   backend de RBAC no conoce, así que nunca vendría en su menú — sin esto
   quedaría oculta para todos aunque el módulo exista. */
const ALWAYS_VISIBLE_KEYS = ['catalog', 'earnings', 'aiRumbo'];

/* Vistas de gestión docente: listan datos de OTROS alumnos, así que se
   restringen por rol y no por privilegio. Un alumno conserva
   'inscriptions:create' para poder inscribirse, pero no debe ver el padrón
   completo de inscripciones.

   'progress' ("Estudiantes") entra aquí por lo mismo: el backend ya acota los
   datos por rol (resolveScope devuelve {kind:'user'} a un alumno), así que a un
   alumno la vista solo le mostraba una ficha: él mismo. No era una fuga, pero sí
   una sección de seguimiento docente que para él no significa nada. */
const STAFF_ONLY_KEYS = new Set(['inscriptions', 'earnings', 'progress']);
const STAFF_ROLES = ['admin', 'instructor'];

/* ── Section label ── */
function SectionLabel({ children, collapsed }: Readonly<{ children: React.ReactNode; collapsed: boolean }>) {
  if (collapsed) return <div className="h-px bg-white/10 mx-2 my-3" />;
  return (
    <p className="px-3 pt-5 pb-1.5 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#9CA9A0] select-none">
      {children}
    </p>
  );
}

/* ── Section label, versión plegable (solo para "Más") ── */
function CollapsibleSectionLabel({
  children, collapsed, open, onToggle,
}: Readonly<{ children: React.ReactNode; collapsed: boolean; open: boolean; onToggle: () => void }>) {
  if (collapsed) return <div className="h-px bg-white/10 mx-2 my-3" />;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center justify-between px-3 pt-5 pb-1.5 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-[#9CA9A0] select-none"
    >
      {children}
      <span className={cn('transition-transform duration-150', open ? 'rotate-90' : '')} aria-hidden>
        {icons.chevronRight}
      </span>
    </button>
  );
}

/* ── Nav item ── */
function NavItem({ item, collapsed, isActive, onNavigate }: Readonly<{ item: MenuItem; collapsed: boolean; isActive: boolean; onNavigate: () => void }>) {
  return (
    <Link
      href={item.path}
      /* Cerrar el drawer se hace aquí, en el evento, y no en un efecto que
         observe la ruta: así no hay un render extra en cada navegación. */
      onClick={onNavigate}
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
  const [userLabel,     setUserLabel]     = useState('Usuario');
  const [avatarUrl,     setAvatarUrl]     = useState<string | null>(null);
  /* Identidad para elegir retrato de la galería cuando aún no hay avatar
     publicado. Se cae al email si no hay id: lo importante es que sea estable. */
  const [userId,        setUserId]        = useState('');
  const [roleLabel,     setRoleLabel]     = useState('');
  const [roles,         setRoles]         = useState<string[]>([]);
  const [loggingOut,    setLoggingOut]    = useState(false);
  const [collapsed,     setCollapsed]     = useState(false);
  /* Sección "Más": arranca abierta y calza con el servidor; la preferencia real
     se lee de localStorage en el mismo efecto que collapsed. */
  const [moreOpen,      setMoreOpen]      = useState(true);
  /* Drawer en móvil/tablet. Arranca cerrado y debe coincidir con el servidor. */
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  /* isMobile arranca en false para que el primer render del cliente calce con
     el del servidor; el valor real se resuelve en el efecto de abajo. */
  const [isMobile,      setIsMobile]      = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setCollapsed(localStorage.getItem('pccl_sidebar_collapsed') === '1');
        setMoreOpen(localStorage.getItem('pccl_sidebar_more_open') !== '0');
        const cachedAccess = sessionStorage.getItem('pccl_access');
        if (cachedAccess) {
          const access = JSON.parse(cachedAccess) as { menu?: { module: string; visible: boolean }[]; roles?: string[] };
          const keys = access.menu?.filter((m) => m.visible).map((m) => m.module).filter((key): key is string => Boolean(key));
          const resolved = keys?.length ? keys : menuCatalog.map((m) => m.key);
          const missingAlwaysVisible = ALWAYS_VISIBLE_KEYS.filter((key) => !resolved.includes(key));
          setVisibleKeys([...resolved, ...missingAlwaysVisible]);
          setRoleLabel(access.roles?.[0] ?? '');
          setRoles(access.roles ?? []);
        }
      } catch {
        // conserva los valores por defecto
      }
    });

    const syncUser = () => {
      try {
        const cachedUser = sessionStorage.getItem('pccl_user');
        if (cachedUser) {
          const user = JSON.parse(cachedUser) as {
            id?: string; fullName?: string; email?: string; avatarUrl?: string | null;
          };
          setUserLabel(user.fullName ?? user.email ?? 'Usuario');
          setAvatarUrl(user.avatarUrl ?? null);
          setUserId(user.id ?? user.email ?? '');
        }
      } catch {
        // conserva los valores por defecto
      }
    };

    const hydrateMissingUserName = async () => {
      try {
        const raw = sessionStorage.getItem('pccl_user');
        const cached = raw ? JSON.parse(raw) as {
          id?: string; fullName?: string; email?: string; avatarUrl?: string | null;
        } : null;

        if (cached?.fullName?.trim()) return;

        const me = await api.me();
        const nextUser = {
          id: cached?.id ?? me.id,
          email: cached?.email ?? me.email,
          fullName: me.fullName ?? cached?.email ?? me.email ?? 'Usuario',
          avatarUrl: cached?.avatarUrl ?? me.avatarUrl ?? null,
        };
        sessionStorage.setItem('pccl_user', JSON.stringify(nextUser));
        syncUser();
      } catch {
        // si /me falla, conserva el cache actual
      }
    };

    queueMicrotask(syncUser);
    queueMicrotask(() => { void hydrateMissingUserName(); });
    window.addEventListener('pccl_user_updated', syncUser);
    return () => window.removeEventListener('pccl_user_updated', syncUser);
  }, []);

  /* Debajo de lg el sidebar deja de ser una columna fija y pasa a ser un drawer:
     en 375px de ancho una barra de 282px se comía la pantalla entera. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Con el drawer abierto el fondo no debe hacer scroll detrás del overlay. */
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [mobileOpen]);

  /* Escape cierra el drawer, igual que en los modales. */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [userMenuOpen]);

  const closeDrawer = useCallback(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem('pccl_sidebar_collapsed', next ? '1' : '0');
      return next;
    });
  };

  const toggleMoreOpen = () => {
    setMoreOpen((current) => {
      const next = !current;
      localStorage.setItem('pccl_sidebar_more_open', next ? '1' : '0');
      return next;
    });
  };

  const isStaff = roles.some((r) => STAFF_ROLES.includes(r));
  const menu    = menuCatalog.filter(
    (m) => visibleKeys.includes(m.key) && (!STAFF_ONLY_KEYS.has(m.key) || isStaff),
  );
  const learningItems   = menu.filter((m) => learningGroup.has(m.key));
  const certificationItems = menu.filter((m) => certificationGroup.has(m.key));
  const extraItems      = menu.filter((m) => extraGroup.has(m.key) || !GROUPED_KEYS.has(m.key));

  const handleLogout = async () => {
    setLoggingOut(true);
    await api.logout().catch(() => {});
    sessionStorage.removeItem('pccl_user');
    sessionStorage.removeItem('pccl_access');
    /* Va aparte porque vive en localStorage: sin esto el siguiente login vería
       el nombre del usuario anterior hasta que terminara de hidratarse. */
    clearUserName();
    router.replace(appRoutes.login);
  };

  /* En móvil el drawer siempre se muestra expandido: colapsarlo a iconos ahí no
     aporta espacio (está superpuesto) y deja el menú sin etiquetas. */
  const rail = collapsed && !isMobile;

  return (
    <>
      {/* ── Botón hamburguesa (solo móvil/tablet) ── */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={mobileOpen}
        className={cn(
          /* z-[310], no z-40: DashboardTopbar es z-[300] y este botón "va fijo
             sobre esta barra" (ver el comentario en DashboardTopbar.tsx) — con
             z-40 el header lo tapaba por completo, igual que le pasaba al
             chevron de colapsar en desktop (ver el <aside> más abajo). */
          'fixed left-3 top-3 z-[310] flex h-10 w-10 items-center justify-center rounded-full lg:hidden',
          'border border-[var(--sidebar-border)] bg-white text-[var(--green-700)] shadow-[0_8px_18px_rgba(23,50,77,0.12)]',
          mobileOpen && 'pointer-events-none opacity-0',
        )}
      >
        {icons.menu}
      </button>

      {/* ── Backdrop del drawer ── */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
          /* Entre el header (z-[300]) y el <aside>/drawer (z-[310]): así el
             header queda cubierto y sin poder recibir clics con el drawer
             abierto, en vez de asomar por encima interactivo. */
          className="fixed inset-0 z-[305] bg-[rgba(17,41,26,0.45)] backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        data-app-sidebar
        className={cn(
          /* Sin overflow propio a propósito: con overflow-y:auto el navegador
             fuerza overflow-x a auto también (visible no es combinable), y eso
             recortaba el chevron y el badge que sobresalen del borde. El scroll
             vive ahora en el <nav> de adentro. */
          /* z-[310], no z-50: el botón de colapsar sobresale del borde derecho
             (right: -1.6rem, ver más abajo) hacia el hueco donde empieza
             DashboardTopbar (z-[300]). El zIndex:20 del botón NO alcanza para
             ganarle — está acotado al contexto de apilamiento de ESTE <aside>,
             nunca compite contra el header, que es una caja completamente
             aparte. Por eso el <aside> entero necesita superar al header, no
             solo el botón. Se deja hueco por debajo de Modal (z-[400]) para
             que un modal siga tapando el sidebar como corresponde. */
          'bg-[var(--sidebar)] flex flex-col py-4 z-[310]',
          'border-r border-[var(--sidebar-border)] shadow-[0_0_0_1px_rgba(255,255,255,0.65)_inset]',
          'transition-[width,transform] duration-300 ease-in-out',
          /* Móvil: drawer superpuesto. Desktop: columna que acompaña el scroll.

             Ojo con el orden: cn() usa twMerge, así que una utilidad compuesta
             como `lg:inset-y-*` colocada después de `lg:top-0` la elimina por
             conflicto y el sticky se queda sin umbral (deja de pegarse). Por eso
             aquí se usan top/bottom sueltos y nunca inset-y con el mismo prefijo. */
          'fixed top-0 bottom-0 left-0 w-[17.625rem]',
          'lg:sticky lg:bottom-auto lg:left-auto lg:translate-x-0 lg:h-screen lg:top-0',
          mobileOpen ? 'translate-x-0 shadow-[0_24px_60px_rgba(23,50,77,0.28)]' : '-translate-x-full',
          rail ? 'lg:w-[4.75rem] lg:px-2 px-3' : 'lg:w-[17.625rem] px-3',
        )}
      >
        {/* ── Logo ── */}
        <div className={cn('relative flex items-center pb-5 px-1', rail ? 'justify-center' : 'justify-between')}>
          {rail ? (
            <Link
              href={appRoutes.dashboard}
              title="Rumbo profesores"
              className="flex h-10 w-10 items-center justify-center rounded-[0.875rem] bg-gradient-to-br from-[var(--green-600)] to-[var(--green-500)] text-lg font-extrabold text-white shadow-[0_10px_24px_rgba(31,154,75,0.18)]"
            >
              R
            </Link>
          ) : (
            <Logo href={appRoutes.dashboard} />
          )}

          {/* Cerrar el drawer — solo móvil, donde no hay clic fuera cómodo. */}
          <IconButton
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
            size="small"
            sx={{
              display: { xs: 'inline-flex', lg: 'none' },
              width: 32, height: 32, color: 'var(--ink-muted)',
              '&:hover': { bgcolor: 'var(--green-50)', color: 'var(--ink)' },
            }}
          >
            {icons.close}
          </IconButton>

          {/* Colapsar a rail — solo desktop. Sobresale del borde, lo que ahora
              se ve completo porque el <aside> ya no recorta. */}
          <IconButton
            type="button"
            onClick={toggleCollapsed}
            aria-label={rail ? 'Mostrar sidebar' : 'Ocultar sidebar'}
            title={rail ? 'Mostrar sidebar' : 'Ocultar sidebar'}
            size="small"
            sx={{
              display: { xs: 'none', lg: 'inline-flex' },
              position: 'absolute',
              right: '-1.6rem',
              top: '0.75rem',
              width: 28,
              height: 28,
              borderRadius: '999px',
              border: '1px solid var(--sidebar-border)',
              bgcolor: 'var(--panel)',
              color: 'var(--green-700)',
              boxShadow: '0 10px 22px rgba(23,50,77,0.12)',
              zIndex: 20,
              '&:hover': { bgcolor: 'var(--green-50)' },
            }}
          >
            {rail ? icons.chevronRight : icons.chevronLeft}
          </IconButton>
        </div>

        {/* Único contenedor con scroll: mantiene el <aside> sin recorte para que
            el chevron pueda sobresalir del borde. */}
        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
          {/* ── Learning section ── */}
          {learningItems.length > 0 && (
            <>
              <SectionLabel collapsed={rail}>Gestión</SectionLabel>
              {learningItems.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  collapsed={rail}
                  isActive={pathname.startsWith(item.path)}
                  onNavigate={closeDrawer}
                />
              ))}
            </>
          )}

          {/* ── Certification section ── */}
          {certificationItems.length > 0 && (
            <>
              <SectionLabel collapsed={rail}>Certificar</SectionLabel>
              {certificationItems.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  collapsed={rail}
                  isActive={pathname.startsWith(item.path)}
                  onNavigate={closeDrawer}
                />
              ))}
            </>
          )}

          {extraItems.length > 0 && (
            <>
              <CollapsibleSectionLabel collapsed={rail} open={moreOpen} onToggle={toggleMoreOpen}>Más</CollapsibleSectionLabel>
              {(rail || moreOpen) && extraItems.map((item) => (
                <NavItem
                  key={item.key}
                  item={item}
                  collapsed={rail}
                  isActive={pathname.startsWith(item.path)}
                  onNavigate={closeDrawer}
                />
              ))}
            </>
          )}
        </nav>

        {/* ── Pie fijo: queda siempre visible, fuera del área que scrollea ── */}
        <div className="flex-shrink-0 pt-1">
          {/* ── User card ── */}
          <div ref={userMenuRef} className="relative">
            <div
              className={cn(
                'mb-2 flex w-full items-center gap-3 rounded-2xl border text-left transition-colors',
                pathname.startsWith(appRoutes.identity) || userMenuOpen
                  ? 'border-[var(--green-200)] bg-[var(--green-50)] shadow-none'
                  : 'border-[#E3EAD9] bg-[#F7FAF3] hover:border-[var(--green-200)] hover:bg-white',
                rail ? 'justify-center px-2 py-2' : 'px-3 py-3',
              )}
            >
              <button
                type="button"
                onClick={() => setUserMenuOpen((current) => !current)}
                className="account-menu-trigger absolute inset-0 z-10 cursor-pointer rounded-2xl border-0 bg-transparent p-0"
                title={rail ? 'Abrir menú de cuenta' : undefined}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                aria-label="Abrir menú de cuenta"
              />
              <StudentAvatar userId={userId} fullName={userLabel} avatarUrl={avatarUrl} size="sm" ring />
              {!rail && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--ink)] truncate leading-tight">{userLabel}</p>
                    {roleLabel && (
                      <p className="text-[0.6875rem] text-[var(--ink-muted)] truncate mt-0.5">{roleLabel}</p>
                    )}
                  </div>
                  <span className={cn('flex-shrink-0 text-[var(--ink-muted)] transition-transform', userMenuOpen && 'rotate-180')} aria-hidden>
                    {icons.chevronRight}
                  </span>
                </>
              )}
            </div>

            {userMenuOpen && (
              <div
                role="menu"
                aria-label="Menú de cuenta"
                className={cn(
                  'absolute bottom-[calc(100%+0.5rem)] left-0 z-50 min-w-[13rem] rounded-2xl border border-[#E3EAD9] bg-white p-2 shadow-[0_20px_40px_rgba(23,50,77,0.16)]',
                  rail && 'left-1/2 -translate-x-1/2',
                )}
              >
                <Link
                  href={appRoutes.identity}
                  onClick={() => setUserMenuOpen(false)}
                  role="menuitem"
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[var(--ink)] no-underline hover:bg-[#F4F7EF]"
                >
                  <span className="opacity-70">{icons.profile}</span>
                  <span>Ver perfil</span>
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#5E6C84] hover:bg-[#F4F7EF] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="opacity-70">{icons.logout}</span>
                  <span>{loggingOut ? 'Saliendo…' : 'Cerrar sesión'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

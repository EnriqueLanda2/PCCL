/* ───────────────────────────────────────────
   DashboardTopbar — barra superior del panel
   autenticado. Convive con el Sidebar (que sigue
   siendo la navegación completa/admin y donde vive
   el perfil, en su esquina inferior); esta barra solo
   muestra el título de la sección actual.
   ─────────────────────────────────────────── */

'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AiRumboIcon } from '@/app/components/shared/AiRumboIcon';

const ROUTE_META: Record<string, { title: string; eyebrow?: string; icon?: ReactNode }> = {
  dashboard: { title: 'Resumen general', eyebrow: 'Panel' },
  catalog: { title: 'Catálogo de cursos', eyebrow: 'Explorar' },
  courses: { title: 'Mis cursos', eyebrow: 'Aprendizaje' },
  live: { title: 'Clases en vivo', eyebrow: 'Aprendizaje' },
  lessons: { title: 'Temas y lecciones', eyebrow: 'Gestión académica' },
  progress: { title: 'Estudiantes', eyebrow: 'Seguimiento' },
  inscriptions: { title: 'Inscripciones', eyebrow: 'Gestión académica' },
  earnings: { title: 'Ganancias', eyebrow: 'Monetización' },
  certificates: { title: 'Certificaciones', eyebrow: 'Certificar' },
  audit: { title: 'Auditoría', eyebrow: 'Trazabilidad' },
  users: { title: 'Usuarios', eyebrow: 'Administración' },
  rbac: { title: 'Control de acceso', eyebrow: 'Administración' },
  avatar: { title: 'Avatar', eyebrow: 'Identidad' },
  identity: { title: 'Perfil e impartición', eyebrow: 'Cuenta' },
  /* AIRumbo tiene su propio título con ícono aquí — la página no repite un
     segundo encabezado abajo, así se gana esa altura para el panel de chat. */
  'ai-rumbo': { title: 'AIRumbo', icon: <AiRumboIcon size={20} /> },
};

export function DashboardTopbar() {
  const pathname = usePathname();

  const currentKey = pathname.split('/').filter(Boolean).at(-1) ?? 'dashboard';
  const routeMeta = ROUTE_META[currentKey] ?? {
    title: currentKey.replace(/-/g, ' '),
    eyebrow: 'Panel',
  };

  return (
    /* max-lg:pl-16 reserva el hueco del botón hamburguesa, que va fijo sobre
       esta barra debajo de lg; sin eso se encimaba con el primer elemento. */
    <header className="border-b border-[#E4EBDD] bg-[rgba(255,255,255,0.92)] px-4 py-3 backdrop-blur max-lg:pl-16 lg:px-7">
      <div className="min-w-0">
        {routeMeta.eyebrow && (
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-[var(--green-700)]">
            {routeMeta.eyebrow}
          </p>
        )}
        <h1 className="mt-1 flex items-center gap-2 truncate text-[1.125rem] font-semibold text-[var(--ink)] sm:text-[1.375rem]">
          {routeMeta.icon}
          {routeMeta.title}
        </h1>
      </div>
    </header>
  );
}

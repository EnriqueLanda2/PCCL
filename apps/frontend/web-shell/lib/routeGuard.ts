/**
 * routeGuard.ts — mapa ruta → módulo RBAC requerido.
 * Las claves de módulo deben calzar exactamente con la lista fija
 * de `buildMenu()` en identity-service/src/modules/rbac/rbac.service.ts:
 *   dashboard, courses, lessons, inscriptions, califications,
 *   certificates, progress, reports, users, rbac
 *
 * Rutas que NO aparecen aquí (p. ej. /identity el perfil, o las
 * páginas "overview" de cada dominio) quedan accesibles para
 * cualquier usuario autenticado — solo exigen sesión, no un
 * privilegio específico.
 */
import { appRoutes } from './routes';

export const ROUTE_MODULES: Record<string, string> = {
  [appRoutes.dashboard]:     'dashboard',
  [appRoutes.courses]:       'courses',
  [appRoutes.lessons]:       'lessons',
  [appRoutes.progress]:      'progress',
  [appRoutes.certificates]:  'certificates',
  [appRoutes.users]:         'users',
  [appRoutes.inscriptions]:  'inscriptions',
  [appRoutes.califications]: 'califications',
  [appRoutes.audit]:         'reports',
  [appRoutes.rbac]:          'rbac',
};

/** Rutas ordenadas de más a menos específica, para que un prefijo largo gane sobre uno corto */
const ORDERED_ROUTES = Object.keys(ROUTE_MODULES).sort((a, b) => b.length - a.length);

/** Devuelve el módulo RBAC requerido por una ruta, o null si es de acceso libre (solo requiere sesión) */
export function requiredModuleFor(pathname: string): string | null {
  const match = ORDERED_ROUTES.find((route) => pathname === route || pathname.startsWith(`${route}/`));
  return match ? ROUTE_MODULES[match] : null;
}

/**
 * Rutas de gestión docente. El privilegio por sí solo no basta: un alumno
 * conserva 'inscriptions:create' para poder inscribirse, pero el padrón de
 * inscripciones lista datos de otros alumnos y es una vista de profesor.
 */
const ROUTE_ROLES: Record<string, string[]> = {
  [appRoutes.inscriptions]: ['admin', 'instructor'],
  [appRoutes.earnings]: ['admin', 'instructor'],
  /* "Estudiantes": seguimiento del avance del alumnado. Debe ir en pareja con
     STAFF_ONLY_KEYS del Sidebar — si solo se ocultara el enlace, la ruta seguiría
     abierta escribiendo la URL. */
  [appRoutes.progress]: ['admin', 'instructor'],
};

const ORDERED_ROLE_ROUTES = Object.keys(ROUTE_ROLES).sort((a, b) => b.length - a.length);

/** Roles admitidos en una ruta, o null si no está restringida por rol. */
export function requiredRolesFor(pathname: string): string[] | null {
  const match = ORDERED_ROLE_ROUTES.find((route) => pathname === route || pathname.startsWith(`${route}/`));
  return match ? ROUTE_ROLES[match] : null;
}

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

export const appRoutes = {
  home:          '/',
  login:         '/identity/auth',
  register:      '/identity/register',
  forgotPassword: '/identity/forgot-password',
  dashboard:     '/learning/dashboard',
  courses:       '/learning/courses',
  /* Descubrimiento: cursos publicados en los que el usuario aún NO está
     inscrito. `courses` quedó acotado a "mis cursos", así que el catálogo
     necesita ruta propia. */
  catalog:       '/learning/catalog',
  liveClasses:   '/learning/live',
  earnings:      '/learning/earnings',
  lessons:       '/learning/lessons',
  inscriptions:  '/learning/inscriptions',
  aiRumbo:       '/learning/ai-rumbo',
  califications: '/learning/califications',
  certificates:  '/certification/certificates',
  progress:      '/learning/progress',
  /** Cola de aprobación/rechazo del revisor — también accesible para admin. */
  review:        '/learning/review',
  audit:         '/certification/audit',
  users:         '/identity/users',
  rbac:          '/identity/rbac',
  avatar:        '/identity/avatar',
  scan:          '/validate',
  /* Microfrontend overview pages */
  identity:      '/identity',
  learning:      '/learning',
  certification: '/certification',
} as const;

export type AppRouteKey = keyof typeof appRoutes;

/** Public routes that skip the auth shell */
export const PUBLIC_ROUTES: string[] = [appRoutes.login, appRoutes.register, appRoutes.forgotPassword];

/* ── Post-login/register landing route ──
   Mapa módulo backend → ruta frontend, usado por login y registro
   para decidir a dónde navegar tras autenticar según el menú del actor. */
const MODULE_ROUTE: Record<string, string> = {
  dashboard: appRoutes.dashboard, courses: appRoutes.courses,
  earnings: appRoutes.earnings,
  lessons: appRoutes.lessons, inscriptions: appRoutes.inscriptions,
  califications: appRoutes.califications, certificates: appRoutes.certificates,
  progress: appRoutes.progress, audit: appRoutes.audit,
  users: appRoutes.users, rbac: appRoutes.rbac,
  moderation: appRoutes.review,
};

export function firstRoute(menu: { module: string; visible: boolean }[]): string {
  const first = menu.find((m) => m.visible && MODULE_ROUTE[m.module]);
  return first ? MODULE_ROUTE[first.module] : appRoutes.dashboard;
}

/**
 * Destino tras autenticar. `proxy.ts` agrega `?next=<ruta>` cuando expulsa a
 * un visitante sin sesión de una ruta protegida; sin esto el usuario siempre
 * caía en el dashboard y perdía la página a la que iba.
 *
 * Solo se aceptan rutas internas: una sola `/` inicial descarta `//host` y
 * `/\host`, que el navegador trataría como destino externo (open redirect).
 */
export function postLoginRoute(
  next: string | string[] | undefined,
  menu: { module: string; visible: boolean }[],
): string {
  const candidate = Array.isArray(next) ? next[0] : next;
  const isInternal =
    typeof candidate === 'string' &&
    candidate.startsWith('/') &&
    !candidate.startsWith('//') &&
    !candidate.startsWith('/\\');

  /* Volver al login/registro tras autenticar sería un bucle. */
  const isAuthRoute = PUBLIC_ROUTES.some(
    (p) => candidate === p || candidate?.startsWith(`${p}/`),
  );

  return isInternal && !isAuthRoute ? candidate : firstRoute(menu);
}

/** Propaga `?next=` al saltar entre login y registro para no perder el destino. */
export function withNext(route: string, next: string | string[] | undefined): string {
  const candidate = Array.isArray(next) ? next[0] : next;
  return candidate ? `${route}?next=${encodeURIComponent(candidate)}` : route;
}

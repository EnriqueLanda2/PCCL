export const appRoutes = {
  home:          '/',
  login:         '/identity/auth',
  register:      '/identity/register',
  dashboard:     '/learning/dashboard',
  courses:       '/learning/courses',
  liveClasses:   '/learning/live',
  lessons:       '/learning/lessons',
  inscriptions:  '/learning/inscriptions',
  califications: '/learning/califications',
  certificates:  '/certification/certificates',
  progress:      '/learning/progress',
  audit:         '/certification/audit',
  users:         '/identity/users',
  rbac:          '/identity/rbac',
  scan:          '/validate',
  /* Microfrontend overview pages */
  identity:      '/identity',
  learning:      '/learning',
  certification: '/certification',
} as const;

export type AppRouteKey = keyof typeof appRoutes;

/** Public routes that skip the auth shell */
export const PUBLIC_ROUTES: string[] = [appRoutes.login, appRoutes.register];

/* ── Post-login/register landing route ──
   Mapa módulo backend → ruta frontend, usado por login y registro
   para decidir a dónde navegar tras autenticar según el menú del actor. */
const MODULE_ROUTE: Record<string, string> = {
  dashboard: appRoutes.dashboard, courses: appRoutes.courses,
  lessons: appRoutes.lessons, inscriptions: appRoutes.inscriptions,
  califications: appRoutes.califications, certificates: appRoutes.certificates,
  progress: appRoutes.progress, audit: appRoutes.audit,
  users: appRoutes.users, rbac: appRoutes.rbac,
};

export function firstRoute(menu: { module: string; visible: boolean }[]): string {
  const first = menu.find((m) => m.visible && MODULE_ROUTE[m.module]);
  return first ? MODULE_ROUTE[first.module] : appRoutes.dashboard;
}

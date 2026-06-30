export const appRoutes = {
  home:          '/',
  login:         '/identity/auth',
  register:      '/identity/register',
  dashboard:     '/learning/dashboard',
  courses:       '/learning/courses',
  lessons:       '/learning/lessons',
  inscriptions:  '/learning/inscriptions',
  califications: '/learning/califications',
  certificates:  '/certification/certificates',
  progress:      '/learning/progress',
  audit:         '/certification/audit',
  users:         '/identity/users',
  rbac:          '/identity/rbac',
  /* Microfrontend overview pages */
  identity:      '/identity',
  learning:      '/learning',
  certification: '/certification',
} as const;

export type AppRouteKey = keyof typeof appRoutes;

/** Public routes that skip the auth shell */
export const PUBLIC_ROUTES: string[] = [appRoutes.login, appRoutes.register];

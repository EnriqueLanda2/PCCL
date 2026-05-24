export const appRoutes = {
  home:          '/',
  login:         '/modules/auth',
  register:      '/modules/register',
  dashboard:     '/modules/dashboard',
  courses:       '/modules/courses',
  lessons:       '/modules/lessons',
  inscriptions:  '/modules/inscriptions',
  califications: '/modules/califications',
  certificates:  '/modules/certificates',
  progress:      '/modules/progress',
  audit:         '/modules/audit',
  users:         '/modules/users',
  rbac:          '/modules/rbac',
  /* Microfrontend overview pages */
  identity:      '/identity',
  learning:      '/learning',
  certification: '/certification',
} as const;

export type AppRouteKey = keyof typeof appRoutes;

/** Public routes that skip the auth shell */
export const PUBLIC_ROUTES: string[] = [appRoutes.login, appRoutes.register];

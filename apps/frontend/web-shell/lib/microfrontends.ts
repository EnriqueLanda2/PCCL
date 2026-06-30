import { appRoutes } from './routes';

export type MicrofrontendKey = 'identity' | 'learning' | 'certification';

export type MicrofrontendItem = {
  key: MicrofrontendKey;
  href: string;
  title: string;
  tag: string;
  description: string;
  purpose: string;
  services: string[];
  routes: string[];
};

export const microfrontends: MicrofrontendItem[] = [
  {
    key: 'identity',
    href: appRoutes.identity,
    title: 'Identity Microfrontend',
    tag: 'Usuarios, roles y acceso',
    description: 'Pantalla enfocada en autenticacion y administracion de usuarios.',
    purpose: 'Gestiona login, perfil, usuarios y permisos.',
    services: ['Identity Service'],
    routes: ['/identity/auth', '/identity/register', '/identity/users', '/identity/rbac'],
  },
  {
    key: 'learning',
    href: appRoutes.learning,
    title: 'Learning Microfrontend',
    tag: 'Cursos, lecciones y progreso',
    description: 'Zona del alumno y del docente para operar el aprendizaje.',
    purpose: 'Cubre cursos, inscripciones, progreso y calificaciones.',
    services: ['Learning Service'],
    routes: ['/learning/dashboard', '/learning/courses', '/learning/lessons', '/learning/inscriptions', '/learning/progress', '/learning/califications'],
  },
  {
    key: 'certification',
    href: appRoutes.certification,
    title: 'Certification Microfrontend',
    tag: 'Certificados y auditoria',
    description: 'Vista para certificados, seguimiento y trazabilidad.',
    purpose: 'Agrupa certificados y reportes de auditoria.',
    services: ['Certification & Audit Service'],
    routes: ['/certification/certificates', '/certification/audit'],
  },
];

export function getMicrofrontend(key: MicrofrontendKey) {
  return microfrontends.find((item) => item.key === key);
}
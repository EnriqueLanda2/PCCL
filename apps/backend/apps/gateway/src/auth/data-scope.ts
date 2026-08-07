import { DataScope, DENY_ALL_SCOPE } from '@app/contracts';
import { RequestUser } from './interfaces/request-user.interface';

/**
 * Traduce la sesión a un alcance de datos. El gateway es el único punto donde
 * se decide qué puede ver cada quien; los microservicios solo aplican el
 * filtro que reciben y nunca confían en un userId enviado por el cliente.
 *
 * El fallback por permisos existe para tokens emitidos antes de que `roles`
 * se incluyera en el JWT: 'rbac:manage' y 'courses:create' solo los tiene
 * admin e instructor respectivamente (ver ROLE_PRIVILEGES en el seed).
 */
export function resolveScope(user: RequestUser | null): DataScope {
  if (!user?.sub) return DENY_ALL_SCOPE;

  const roles = user.roles;
  const isAdmin = roles
    ? roles.includes('admin')
    : user.permissions.includes('rbac:manage');
  if (isAdmin) return { kind: 'all' };

  const isInstructor = roles
    ? roles.includes('instructor') || roles.includes('profesor')
    : user.permissions.includes('courses:create');
  if (isInstructor) return { kind: 'instructor', instructorEmail: user.email };

  return { kind: 'user', userId: user.sub };
}

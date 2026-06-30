/* ───────────────────────────────────────────
   Services · Auth
   Inicio de sesión, cierre de sesión,
   perfil de acceso RBAC.
   ─────────────────────────────────────────── */

import { request } from './api';
import type { SessionUser, AccessProfile, LoginPayload, LoginResponse } from '@/types/user';

export const authService = {
  /** Inicia sesión con email y contraseña */
  login: (payload: LoginPayload) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Cierra la sesión actual */
  logout: () =>
    request<{ message: string }>('/auth/logout', { method: 'POST' }),

  /** Devuelve el usuario de la sesión activa */
  me: () => request<SessionUser>('/auth/me'),

  /** Devuelve el perfil de acceso RBAC del usuario */
  access: () => request<AccessProfile>('/rbac/me'),
};

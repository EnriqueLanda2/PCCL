/* ───────────────────────────────────────────
   Types · User & Auth
   ─────────────────────────────────────────── */

export type UserRole = 'admin' | 'instructor' | 'alumno';

export interface User {
  id: string;
  fullName: string;
  email: string;
  active: boolean;
  role?: UserRole;
  avatarInitials?: string;
  avatarUrl?: string | null;
}

export interface SessionUser {
  id: string;
  fullName?: string | null;
  email: string;
  avatarUrl?: string | null;
  roleIds: string[];
  roles?: string[];
  permissions: string[];
  scope: string;
}

export interface AccessProfile {
  roles: string[];
  permissions: string[];
  menu: { module: string; visible: boolean }[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Pick<User, 'id' | 'fullName' | 'email' | 'avatarUrl'>;
  access: AccessProfile;
}

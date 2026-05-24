/* ───────────────────────────────────────────
   Types · User & Auth
   ─────────────────────────────────────────── */

export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  fullName: string;
  email: string;
  active: boolean;
  role?: UserRole;
  avatarInitials?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  roleIds: string[];
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
  user: Pick<User, 'id' | 'fullName' | 'email'>;
  access: AccessProfile;
}

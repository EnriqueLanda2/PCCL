/**
 * api.ts — Application API layer
 * All HTTP calls go through apiClient (axios + interceptors).
 * Import { api } from '@/lib/api' throughout the app.
 */

import { get, post, patch, del, uploadFile } from './apiClient';
import type {
  AccessProfile,
  AuditLog,
  Calification,
  Certificate,
  Course,
  Inscription,
  Lesson,
  LiveSession,
  Progress,
  RbacCatalogs,
  SessionUser,
  User,
} from './types';

export interface LoginResponse {
  user:   { id: string; fullName: string; email: string };
  access: AccessProfile;
}

export const api = {
  /* ── Auth ─────────────────────────────────────────────── */
  login:    (email: string, password: string) =>
    post<LoginResponse>('/auth/login', { email, password }),

  register: (fullName: string, email: string, password: string) =>
    post<LoginResponse>('/auth/register', { fullName, email, password }),

  logout:   () => post<{ message: string }>('/auth/logout'),

  me:       () => get<SessionUser>('/auth/me'),

  /* ── RBAC ─────────────────────────────────────────────── */
  access:       () => get<AccessProfile>('/rbac/me'),
  rbacCatalogs: () => get<RbacCatalogs>('/rbac/catalogs'),

  /* ── Learning ─────────────────────────────────────────── */
  courses:       () => get<Course[]>('/courses'),
  createCourse:  (dto: Partial<Course>) => post<Course>('/courses', dto),

  /* ── Uploads (Cloudinary) ─────────────────────────────── */
  uploadImage:    (file: File) => uploadFile<{ url: string }>('/uploads/image', file),
  uploadDocument: (file: File) => uploadFile<{ url: string }>('/uploads/document', file),
  uploadVideo:    (file: File) => uploadFile<{ url: string }>('/uploads/video', file),

  lessons:       () => get<Lesson[]>('/lessons'),
  createLesson:  (dto: Partial<Lesson> & { courseId: string }) => post<Lesson>('/lessons', dto),
  updateLesson:  (id: string, dto: Partial<Lesson>) => patch<Lesson>(`/lessons/${id}`, dto),

  liveSessions:      () => get<LiveSession[]>('/live-sessions'),
  nextLiveSession:   () => get<LiveSession | null>('/live-sessions/public'),
  createLiveSession: (dto: Partial<LiveSession>) => post<LiveSession>('/live-sessions', dto),
  updateLiveSession: (id: string, dto: Partial<LiveSession>) => patch<LiveSession>(`/live-sessions/${id}`, dto),
  deleteLiveSession: (id: string) => del(`/live-sessions/${id}`),

  inscriptions:  () => get<Inscription[]>('/inscriptions'),

  califications: () => get<Calification[]>('/califications'),

  progress:      () => get<Progress[]>('/progress'),

  /* ── Certification & Audit ────────────────────────────── */
  certificates:  () => get<Certificate[]>('/certificates'),
  audit:         (limit = 100) => get<AuditLog[]>(`/audit?limit=${limit}`),

  /* ── Users ────────────────────────────────────────────── */
  users:      () => get<User[]>('/users'),
  createUser: (dto: { fullName: string; email: string; password: string; roleIds: string[] }) =>
    post<User>('/users', dto),
  deleteUser: (id: string) => del(`/users/${id}`),
};

/* Re-export error utilities so callers don't need two imports */
export {
  ApiError,
  NetworkError,
  TimeoutError,
  isApiError,
  isNetworkError,
  isAuthError,
  isForbiddenError,
  getErrorMessage,
} from './apiClient';

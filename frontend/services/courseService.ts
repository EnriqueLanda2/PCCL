/* ───────────────────────────────────────────
   Services · Courses, Lessons & Inscriptions
   ─────────────────────────────────────────── */

import { request } from './api';
import type { Course, Lesson, Inscription } from '@/types/course';

export const courseService = {
  /** Lista todos los cursos */
  list: () => request<Course[]>('/courses'),

  /** Obtiene un curso por ID */
  get: (id: string) => request<Course>(`/courses/${id}`),

  /** Crea un nuevo curso (requiere permiso courses:create) */
  create: (data: Partial<Course>) =>
    request<Course>('/courses', { method: 'POST', body: JSON.stringify(data) }),

  /** Lista todas las lecciones */
  lessons: () => request<Lesson[]>('/lessons'),

  /** Obtiene una lección por ID */
  lesson: (id: string) => request<Lesson>(`/lessons/${id}`),

  /** Lista todas las inscripciones */
  inscriptions: () => request<Inscription[]>('/inscriptions'),
};

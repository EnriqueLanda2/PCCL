/* ───────────────────────────────────────────
   Services · Learning
   Progreso, calificaciones y certificados.
   ─────────────────────────────────────────── */

import { request } from './api';
import type { Progress, Certificate } from '@/types/certificate';
import type { Calification } from '@/types/quiz';

export const learningService = {
  /** Lista todos los registros de progreso */
  progress: () => request<Progress[]>('/progress'),

  /** Lista todas las calificaciones/evaluaciones */
  califications: () => request<Calification[]>('/califications'),

  /** Lista todos los certificados */
  certificates: () => request<Certificate[]>('/certificates'),

  /** Dashboard de métricas generales */
  dashboard: () => request<Record<string, number>>('/dashboard'),
};

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
  ChatConversationSummary,
  ChatMessage,
  Certificate,
  CertificateEligibility,
  CertificateRequest,
  CertificateVerification,
  Course,
  CourseEarnings,
  CourseComment,
  CourseReview,
  Evaluation,
  EvaluationAttempt,
  Inscription,
  Lesson,
  LiveSession,
  Note,
  NotificationItem,
  OrderCreateResponse,
  OrderRecord,
  OrderSource,
  PendingTasksResult,
  Phase,
  Progress,
  PublicCourse,
  PublicCourseDetail,
  RbacCatalogs,
  SessionUser,
  User,
} from './types';

export interface LoginResponse {
  user:   { id: string; fullName: string; email: string; avatarUrl?: string | null };
  access: AccessProfile;
}

export interface PublicStats {
  activeStudents:   number;
  publishedCourses: number;
  completionRate:   number;
}

export const api = {
  /* ── Auth ─────────────────────────────────────────────── */
  login:    (email: string, password: string) =>
    post<LoginResponse>('/auth/login', { email, password }),

  register: (fullName: string, email: string, password: string) =>
    post<LoginResponse>('/auth/register', { fullName, email, password }),

  forgotPassword: (email: string) =>
    post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    post<{ message: string }>('/auth/reset-password', { email, code, newPassword }),

  logout:   () => post<{ message: string }>('/auth/logout'),

  me:       () => get<SessionUser>('/auth/me'),

  /* ── RBAC ─────────────────────────────────────────────── */
  access:       () => get<AccessProfile>('/rbac/me'),
  rbacCatalogs: () => get<RbacCatalogs>('/rbac/catalogs'),

  /* ── Learning ─────────────────────────────────────────── */
  courses:       () => get<Course[]>('/courses'),
  course:        (id: string) => get<Course>(`/courses/${id}`),

  /** Catálogo de cursos publicados, sin acotar al usuario — para inscribirse. */
  publicCourses: () => get<PublicCourse[]>('/courses/public'),

  /** Detalle con temario de un curso publicado — vista previa antes de inscribirse. */
  publicCourse: (id: string) => get<PublicCourseDetail>(`/courses/public/${id}`),

  createCourse:  (dto: Partial<Course>) => post<Course>('/courses', dto),
  publishCourse: (id: string) => patch<Course>(`/courses/${id}/publish`, {}),
  courseCertificateEligibility: (courseId: string) =>
    get<CertificateEligibility>(`/courses/${courseId}/certificate-eligibility`),

  /** IDs de los cursos que el usuario tiene guardados — para pintar el botón
      "Guardar" de cada ficha sin pedir curso por curso. */
  myFavoriteCourseIds: () => get<string[]>('/courses/favorites'),
  setCourseFavorite: (courseId: string, saved: boolean) =>
    post<{ courseId: string; saved: boolean }>(`/courses/${courseId}/favorite`, { saved }),

  /* ── Uploads (Cloudinary) ─────────────────────────────── */
  uploadImage:    (file: File) => uploadFile<{ url: string }>('/uploads/image', file),
  uploadDocument: (file: File) => uploadFile<{ url: string }>('/uploads/document', file),
  uploadVideo:    (file: File) => uploadFile<{ url: string }>('/uploads/video', file),

  lessons:       () => get<Lesson[]>('/lessons'),
  createLesson:  (dto: Partial<Lesson> & { courseId: string }) => post<Lesson>('/lessons', dto),
  updateLesson:  (id: string, dto: Partial<Lesson>) => patch<Lesson>(`/lessons/${id}`, dto),

  /** Fases/módulos del curso — el camino secuencial al que se atan lecciones
      y clases en vivo. */
  coursePhases: (courseId: string) => get<Phase[]>(`/courses/${courseId}/phases`),
  createPhase:  (courseId: string, title: string) => post<Phase>(`/courses/${courseId}/phases`, { title }),
  deletePhase:  (id: string) => del(`/phases/${id}`),

  liveSessions:      () => get<LiveSession[]>('/live-sessions'),
  nextLiveSession:   () => get<LiveSession | null>('/live-sessions/public'),
  createLiveSession: (dto: Partial<LiveSession>) => post<LiveSession>('/live-sessions', dto),
  updateLiveSession: (id: string, dto: Partial<LiveSession>) => patch<LiveSession>(`/live-sessions/${id}`, dto),
  deleteLiveSession: (id: string) => del(`/live-sessions/${id}`),
  /** El backend decide quién es moderador (quien creó la clase) y lo firma
      en el JWT — el cliente nunca elige. */
  liveSessionJitsiToken: (id: string) =>
    get<{ token: string | null; domain: string; room: string; isModerator: boolean }>(`/live-sessions/${id}/jitsi-token`),
  /** Recién acá la clase pasa a "en vivo" de verdad — llamarlo solo cuando
      el anfitrión efectivamente se conecta a la sala. */
  startLiveSession: (id: string) => post<LiveSession>(`/live-sessions/${id}/start`, {}),
  registerPushToken: (token: string) => post<{ ok: boolean }>('/push-tokens', { token }),

  notifications: () => get<NotificationItem[]>('/notifications'),
  unreadNotificationCount: () => get<number>('/notifications/unread-count'),
  markNotificationRead: (id: string) => post<{ ok: boolean }>(`/notifications/${id}/read`, {}),
  markAllNotificationsRead: () => post<{ ok: boolean }>('/notifications/read-all', {}),

  inscriptions:  () => get<Inscription[]>('/inscriptions'),
  createInscription: (userId: string, courseId: string) =>
    post<Inscription>('/inscriptions', { userId, courseId }),

  /* ── Payments ─────────────────────────────────────────── */
  createOrder: (courseId: string, accessType: 'monthly' | 'permanent' = 'permanent', source?: OrderSource) =>
    post<OrderCreateResponse>('/payments/orders', { courseId, accessType, source }),
  getOrder:    (orderId: string) => get<OrderRecord>(`/payments/orders/${orderId}`),
  courseEarnings: () => get<CourseEarnings[]>('/payments/earnings/courses'),

  califications: () => get<Calification[]>('/califications'),
  evaluations: (courseId: string) => get<Evaluation[]>(`/evaluations?courseId=${encodeURIComponent(courseId)}`),
  createEvaluation: (dto: Partial<Evaluation> & { courseId: string }) => post<Evaluation>('/evaluations', dto),
  submitEvaluationAttempt: (evaluationId: string, answers: unknown[]) =>
    post(`/evaluations/${evaluationId}/attempts`, { answers }),
  /** Para el repaso de solo lectura: la última vez que el usuario respondió
      este examen, o null si nunca lo hizo. */
  myEvaluationAttempt: (evaluationId: string) =>
    get<EvaluationAttempt | null>(`/evaluations/${evaluationId}/my-attempt`),

  notes:       (lessonId: string) => get<Note[]>(`/lessons/${lessonId}/notes`),
  createNote:  (lessonId: string, content: string) => post<Note>(`/lessons/${lessonId}/notes`, { content }),
  updateNote:  (id: string, content: string) => patch<Note>(`/notes/${id}`, { content }),
  deleteNote:  (id: string) => del(`/notes/${id}`),

  /* ── AIRumbo (chatbot IA) ─────────────────────────────────── */
  chatHistory: (conversationId: string) =>
    get<ChatMessage[]>(`/chat/history?conversationId=${encodeURIComponent(conversationId)}`),
  /* Timeout largo: un LLM local puede tardar más de los 15s por default,
     sobre todo si Ollama descargó el modelo de memoria por inactividad.
     Sin conversationId = crea una conversación nueva; el backend regresa
     la que generó. */
  sendChatMessage: (message: string, conversationId?: string, lessonId?: string) =>
    post<{ reply: string; conversationId: string }>(
      '/chat',
      { message, conversationId, lessonId },
      { timeout: 120_000 },
    ),
  /* Borra la conversación completa (todos sus mensajes) — al no quedar
     mensajes, deja de aparecer en chatConversations(). */
  clearChatHistory: (conversationId: string) =>
    del(`/chat/history?conversationId=${encodeURIComponent(conversationId)}`),
  chatConversations: () => get<ChatConversationSummary[]>('/chat/conversations'),
  /* Borra ese mensaje y todo lo posterior del hilo — usado al editar un
     mensaje ya enviado, para que la respuesta se regenere de verdad en vez
     de apilarse como un mensaje nuevo. */
  deleteChatMessagesFrom: (messageId: string) => del(`/chat/messages/${messageId}`),

  progress:      () => get<Progress[]>('/progress'),

  /* ── Comentarios de curso ──────────────────────────────── */
  courseComments: (courseId: string) => get<CourseComment[]>(`/courses/${courseId}/comments`),
  createCourseComment: (courseId: string, content: string) =>
    post<CourseComment[]>(`/courses/${courseId}/comments`, { content }),
  toggleCommentLike: (id: string) =>
    post<{ id: string; likes: number; likedByMe: boolean }>(`/comments/${id}/like`),
  deleteComment: (id: string) => del(`/comments/${id}`),

  courseReviews: (courseId: string) => get<CourseReview[]>(`/courses/${courseId}/reviews`),
  upsertCourseReview: (courseId: string, rating: number, comment?: string | null) =>
    post<CourseReview[]>(`/courses/${courseId}/reviews`, { rating, comment }),

  /* ── Tareas pendientes del alumno ──────────────────────── */
  pendingTasks: (courseId?: string) => {
    const query = courseId ? '?courseId=' + encodeURIComponent(courseId) : '';
    return get<PendingTasksResult>(`/tasks/pending${query}`);
  },

  setLessonCompleted: (lessonId: string, done: boolean) =>
    post<{ lessonId: string; done: boolean }>(`/lessons/${lessonId}/completion`, { done }),

  /* ── Estadísticas públicas de la plataforma ───────────── */
  stats: () => get<PublicStats>('/stats/public'),

  /* ── Certification & Audit ────────────────────────────── */
  certificates:  () => get<Certificate[]>('/certificates'),
  certificateEligibility: (inscriptionId: string) =>
    get<CertificateEligibility>(`/certificates/eligibility/${inscriptionId}`),
  /** El alumno ya no emite directo — pide, y un admin/instructor lo aprueba. */
  requestCertificate: (inscriptionId: string) =>
    post<CertificateRequest>(`/certificates/requests/${inscriptionId}`, {}),
  myCertificateRequest: (inscriptionId: string) =>
    get<CertificateRequest | null>(`/certificates/requests/mine/${inscriptionId}`),
  pendingCertificateRequests: () => get<CertificateRequest[]>('/certificates/requests/pending'),
  /** Devuelve la URL del PDF en Cloudinary, no el archivo — quien llama lo
      baja aparte (ver `lib/downloadFile.ts`) para forzar la descarga real en
      vez de que el navegador lo abra inline. */
  downloadCertificate: (certificateId: string) => get<{ url: string }>(`/certificates/${certificateId}/download`),
  approveCertificateRequest: (id: string) => post<Certificate>(`/certificates/requests/${id}/approve`, {}),
  rejectCertificateRequest: (id: string) => post<CertificateRequest>(`/certificates/requests/${id}/reject`, {}),

  /** Verificación pública por folio — no requiere sesión (destino del QR). */
  verifyCertificate: (folio: string) =>
    get<CertificateVerification>(`/certificates/verify/${encodeURIComponent(folio)}`),

  audit:         (limit = 100) => get<AuditLog[]>(`/audit?limit=${limit}`),

  /* ── Users ────────────────────────────────────────────── */
  users:      () => get<User[]>('/users'),
  user:       (id: string) => get<User>(`/users/${id}`),
  createUser: (dto: { fullName: string; email: string; password: string; roleIds: string[] }) =>
    post<User>('/users', dto),
  updateUser: (id: string, dto: { fullName?: string; email?: string; active?: boolean; roleIds?: string[] }) =>
    patch<User>(`/users/${id}`, dto),
  deleteUser: (id: string) => del(`/users/${id}`),
  updateMyAvatar: (avatarUrl: string) => patch<{ id: string; avatarUrl: string }>('/users/me/avatar', { avatarUrl }),
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

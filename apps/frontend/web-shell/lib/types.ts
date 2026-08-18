export interface SessionUser {
  id: string;
  fullName?: string | null;
  email: string;
  avatarUrl?: string | null;
  roleIds: string[];
  roles: string[];
  permissions: string[];
  scope: string;
}

export interface AccessProfile {
  roles: string[];
  permissions: string[];
  menu: { module: string; visible: boolean }[];
}

/**
 * Proyección pública de un curso — la devuelve GET /courses/public, la única
 * lista de cursos que no se acota al usuario. Alimenta el catálogo de
 * inscripción, donde por definición hay que ver cursos aún no propios.
 */
export interface PublicCourse {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  level: string;
  coverImageUrl?: string | null;
  durationMinutes?: number | null;
  price?: number;
  currency?: string;
  isFree?: boolean;
}

/**
 * Lección tal y como la ve alguien que aún no está inscrito: solo el encabezado
 * del temario. Sin `content` ni `fileUrl` — el material solo lo sirve
 * GET /lessons, que sí exige estar inscrito.
 */
export interface PublicLesson {
  id: string;
  title: string;
  contentType: string;
  durationMinutes?: number | null;
}

/** Curso publicado con su temario — GET /courses/public/:id. */
export interface PublicCourseDetail extends PublicCourse {
  lessons: PublicLesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published';
  level: string;
  /** URL de Cloudinary de la portada, si el instructor subió una */
  coverImageUrl?: string | null;
  createdBy?: string | null;
  /* optional display fields */
  category?: string;
  instructorName?: string;
  totalLessons?: number;
  durationMinutes?: number;
  rating?: number;
  reviewCount?: number;
  studentsCount?: number;
  certificateIncluded?: boolean;
  coverVariant?: number;
  coverIcon?: string;
  /** Precio del curso — 0 o isFree=true significa acceso gratuito */
  price?: number;
  currency?: string;
  isFree?: boolean;
  /** Lecciones anidadas — el endpoint GET /courses las incluye */
  lessons?: Lesson[];
  /** Fases/módulos del curso, ordenadas — el endpoint GET /courses las incluye */
  phases?: Phase[];
}

/** Fase/módulo del curso — agrupa lecciones y clases en vivo en un paso
 *  secuencial del camino (ej. "Fase 1: Fundamentos"). `order` determina la
 *  secuencia entre fases de un mismo curso. */
export interface Phase {
  id: string;
  courseId: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  contentType: 'text' | 'video' | 'link' | 'file' | 'quiz' | 'practice' | 'reading' | 'live';
  /** URL de Cloudinary del adjunto (video o documento) cuando contentType es 'video' o 'file' */
  fileUrl?: string | null;
  /* optional display fields */
  courseId?: string;
  courseName?: string;
  completed?: boolean;
  locked?: boolean;
  durationMinutes?: number;
  order?: number;
  createdAt?: string;
  /** Fase del curso a la que pertenece, si se asignó una */
  phaseId?: string | null;
  phase?: Phase | null;
}

/** Tarea pendiente del alumno: lección por ver o evaluación por responder. */
export interface PendingTask {
  id: string;
  kind: 'lesson' | 'evaluation';
  title: string;
  courseId: string;
  courseTitle: string;
  durationMinutes?: number | null;
  contentType?: string;
  done: boolean;
}

export interface PendingTasksResult {
  tasks: PendingTask[];
  total: number;
  done: number;
}

/** Notificación de la campanita — clase que arrancó, se canceló, etc. */
export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

/** Comentario de un alumno en un curso. */
export interface CourseComment {
  id: string;
  courseId: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorId: string;
  likes: number;
  likedByMe: boolean;
  mine: boolean;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  mine: boolean;
}

export interface CertificateEligibility {
  inscriptionId: string;
  courseId: string;
  userId: string;
  eligible: boolean;
  lessonsCompleted: number;
  lessonsTotal: number;
  evaluationsPassed: number;
  evaluationsTotal: number;
  missingEvaluations: string[];
  reason: string | null;
}

export interface CertificateRequest {
  id: string;
  inscriptionId: string;
  userId: string;
  courseId: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  certificateId?: string | null;
  createdAt: string;
}

export interface EvaluationAttempt {
  id: string;
  evaluationId: string;
  studentId: string;
  /** Índice elegido por pregunta, en el mismo orden que Evaluation.questions. */
  answers: number[];
  score: number | null;
  createdAt: string;
}

export interface Note {
  id: string;
  lessonId: string;
  /** HTML serializado del editor TipTap (soporta LaTeX vía KaTeX) */
  content: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateResponse {
  orderId: string;
  clientSecret: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  accessType?: 'monthly' | 'permanent';
  accessEndsAt?: string | null;
}

export interface OrderRecord {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  accessType?: 'monthly' | 'permanent';
  accessEndsAt?: string | null;
}

export type OrderSource = 'organic' | 'instructor_referral' | 'site_promo';

export interface CourseEarnings {
  courseId: string;
  courseTitle: string;
  instructorEmail: string | null;
  salesCount: number;
  grossRevenue: number;
  /** Comisión de la plataforma (25% ventas orgánicas, 50% por referido o promo). */
  platformRevenue: number;
  instructorRevenue: number;
  currency: string;
}

export interface Inscription {
  id: string;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  progressPercentage: number | null;
  completedAt: string | null;
  /** Alta de la inscripción. Es la fecha de compra desde la que se cuentan los
   *  días para el riesgo de abandono. */
  createdAt?: string;
  /** Inicio del periodo de acceso. Se reescribe al renovar una mensualidad. */
  startDate?: string | null;
  /** Fin del acceso. Solo se rellena en compras mensuales; en las de acceso
   *  permanente queda null, y por eso sirve para distinguir unas de otras. */
  endDate?: string | null;
  user?: User;
  course?: Course;
}

export interface Calification {
  id: string;
  title: string;
  type: 'quiz' | 'task' | 'exam';
  totalPoints: number;
  maxAttempts: number;
  lesson?: Lesson;
}

export interface Evaluation {
  id: string;
  title: string;
  description?: string | null;
  topic?: string | null;
  kind: 'kahoot';
  passingScore: number;
  questions?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    timeLimitSeconds?: number;
  }[] | null;
  courseId: string;
  createdAt?: string;
  /** Fase del curso a la que pertenece este examen, si se asignó una */
  phaseId?: string | null;
  phase?: Phase | null;
  /** Dónde cae dentro de la fase: antes de sus lecciones o al final, como examen de cierre */
  phasePosition?: 'start' | 'end';
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  status: 'valid' | 'expired' | 'revoked';
  issuedAt: string;
  expiresAt: string | null;
  inscription?: Inscription;
}

/** Proyección pública de un certificado — solo lo impreso en la tarjeta. */
export interface PublicCertificate {
  certificateNumber: string;
  status: 'valid' | 'expired' | 'revoked';
  issuedAt: string;
  expiresAt: string | null;
  studentName: string | null;
  courseTitle: string | null;
}

/** Respuesta de GET /certificates/verify/:folio (no requiere sesión). */
export interface CertificateVerification {
  found: boolean;
  certificate?: PublicCertificate;
}

export interface Progress {
  id: string;
  progressPercentage: number;
  lessonsCompleted: number;
  evaluationsCompleted: number;
  averageScore: number;
  lastAccessAt: string | null;
  inscription?: Inscription;
}

export interface LiveSession {
  id: string;
  title: string;
  hostName: string;
  createdBy?: string | null;
  scheduledAt: string;
  durationMinutes: number;
  status: 'scheduled' | 'live' | 'ended' | 'canceled';
  /** URL de la videollamada, si la sesión ya tiene una asignada */
  joinUrl?: string | null;
  /** Curso asociado, si aplica */
  courseId?: string | null;
  course?: { title: string } | null;
  /** Fase del curso a la que pertenece esta clase — obligatoria cuando hay curso */
  phaseId?: string | null;
  phase?: Phase | null;
}

export interface AuditLog {
  id: string;
  method: string;
  endpoint: string;
  actorScope: string;
  actorIdentifier: string | null;
  statusCode: number | null;
  description: string;
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  active: boolean;
  userRoles?: { role?: { id?: string; name?: string | null } | null }[];
}

export interface RbacRole {
  id: string;
  name: string;
  active: boolean;
}

export interface RbacModule {
  id: string;
  key: string;
  name: string;
}

export interface RbacPrivilege {
  id: string;
  code: string;
  action: string;
  module: RbacModule;
}

export interface RbacCatalogs {
  roles: RbacRole[];
  modules: RbacModule[];
  privileges: RbacPrivilege[];
}

export interface ChatMessage {
  id: string;
  lessonId: string | null;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

/** Una fila en la lista de conversaciones con AIRumbo (estilo WhatsApp):
 *  el hilo general, o uno por cada lección sobre la que se ha preguntado. */
export interface ChatConversationSummary {
  /** conversationId real — identifica la conversación, no la lección. */
  id: string;
  lessonId: string | null;
  title: string;
  courseTitle: string | null;
  lastMessage: string;
  lastMessageAt: string;
}

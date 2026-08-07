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
  studentsCount?: number;
  coverVariant?: number;
  coverIcon?: string;
  /** Precio del curso — 0 o isFree=true significa acceso gratuito */
  price?: number;
  currency?: string;
  isFree?: boolean;
  /** Lecciones anidadas — el endpoint GET /courses las incluye */
  lessons?: Lesson[];
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

export interface CourseEarnings {
  courseId: string;
  courseTitle: string;
  instructorEmail: string | null;
  salesCount: number;
  grossRevenue: number;
  currency: string;
}

export interface Inscription {
  id: string;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  progressPercentage: number | null;
  completedAt: string | null;
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
  scheduledAt: string;
  durationMinutes: number;
  status: 'scheduled' | 'live' | 'ended' | 'canceled';
  /** URL de la videollamada, si la sesión ya tiene una asignada */
  joinUrl?: string | null;
  /** Curso asociado, si aplica */
  courseId?: string | null;
  course?: { title: string } | null;
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
  userRoles?: { role?: { name?: string | null } | null }[];
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

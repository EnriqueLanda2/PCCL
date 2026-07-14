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
  active: boolean;
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

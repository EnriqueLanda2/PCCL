/* ───────────────────────────────────────────
   Types · Course, Lesson & Inscription
   ─────────────────────────────────────────── */

export type CourseStatus = 'draft' | 'published';
export type CourseLevel  = 'basic' | 'intermediate' | 'advanced';
export interface Course {
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  level: string;
  /** URL de Cloudinary de la portada, si el instructor subió una */
  coverImageUrl?: string | null;
  createdBy?: string | null;
  instructorName?: string;
  totalLessons?: number;
  durationMinutes?: number;
  coverVariant?: number;
  coverIcon?: string;
  category?: string;
  rating?: number;
  studentsCount?: number;
  /** Lecciones anidadas — el endpoint GET /courses las incluye */
  lessons?: Lesson[];
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
  status?: 'completed' | 'in_progress' | 'locked';
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  contentType: 'text' | 'video' | 'link' | 'file' | 'quiz' | 'practice' | 'reading' | 'live';
  durationMinutes?: number;
  moduleId?: string;
  order?: number;
  status?: 'done' | 'current' | 'locked' | null;
}

export interface Inscription {
  id: string;
  status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
  progressPercentage: number | null;
  completedAt: string | null;
  userId?: string;
  courseId?: string;
  user?: import('./user').User;
  course?: Course;
}

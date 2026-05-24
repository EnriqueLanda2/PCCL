/* ═══════════════════════════════════════════════════════════
   Status Maps — Mapas globales de estado y tipo
   Úsalos en cualquier página/componente con un import:
     import { inscriptionStatus, lessonType, ... } from '@/types/status'
   ═══════════════════════════════════════════════════════════ */

/** Variantes aceptadas por el componente <Badge> */
export type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'dark';

/** Colores aceptados por <ProgressBar> */
export type ProgressColor = 'blue' | 'green' | 'yellow';

/* ─────────────────────────────────────────────────────────
   Mapa de estado genérico — interfaz compartida
   ───────────────────────────────────────────────────────── */
export interface StatusMap<K extends string = string> {
  /** CSS variant → clase de badge */
  variant:  Record<K, BadgeVariant>;
  /** Etiqueta en español para mostrar en UI */
  label:    Record<K, string>;
  /** Chips para el filtro (primero siempre "Todos") */
  chips:    string[];
  /** Mapea el chip en español de vuelta a la key real */
  chipKey?: Record<string, K>;
}

/* ═══════════════════════════════════════════════════════════
   INSCRIPCIONES
   enrolled · in-progress · completed · dropped
   ═══════════════════════════════════════════════════════════ */
export type InscriptionStatus = 'enrolled' | 'in-progress' | 'completed' | 'dropped';

export const inscriptionStatus: StatusMap<InscriptionStatus> = {
  variant: {
    enrolled:      'blue',
    'in-progress': 'yellow',
    completed:     'green',
    dropped:       'red',
  },
  label: {
    enrolled:      'Inscrito',
    'in-progress': 'En progreso',
    completed:     'Completado',
    dropped:       'Abandonado',
  },
  chips: ['Todos', 'Inscrito', 'En progreso', 'Completado', 'Abandonado'],
  chipKey: {
    Inscrito:      'enrolled',
    'En progreso': 'in-progress',
    Completado:    'completed',
    Abandonado:    'dropped',
  },
};

/* ═══════════════════════════════════════════════════════════
   CERTIFICADOS
   valid · expired · revoked
   ═══════════════════════════════════════════════════════════ */
export type CertificateStatus = 'valid' | 'expired' | 'revoked';

export const certificateStatus: StatusMap<CertificateStatus> = {
  variant: {
    valid:   'green',
    expired: 'yellow',
    revoked: 'red',
  },
  label: {
    valid:   'Vigente',
    expired: 'Expirado',
    revoked: 'Revocado',
  },
  chips: ['Todos', 'Vigentes', 'Expirados', 'Revocados'],
  chipKey: {
    Vigentes:  'valid',
    Expirados: 'expired',
    Revocados: 'revoked',
  },
};

/* ═══════════════════════════════════════════════════════════
   CURSOS — nivel
   Básico · Intermedio · Avanzado (también en inglés)
   ═══════════════════════════════════════════════════════════ */
export type CourseLevel =
  | 'Básico' | 'Intermedio' | 'Avanzado'
  | 'basic'  | 'intermediate' | 'advanced';

export const courseLevel: Pick<StatusMap, 'variant' | 'label' | 'chips'> = {
  variant: {
    'Básico':       'green',
    'Intermedio':   'blue',
    'Avanzado':     'yellow',
    basic:          'green',
    intermediate:   'blue',
    advanced:       'yellow',
  },
  label: {
    'Básico':       'Básico',
    'Intermedio':   'Intermedio',
    'Avanzado':     'Avanzado',
    basic:          'Básico',
    intermediate:   'Intermedio',
    advanced:       'Avanzado',
  },
  chips: ['Todos', 'Básico', 'Intermedio', 'Avanzado'],
};

/* ═══════════════════════════════════════════════════════════
   CURSOS — estado publicación
   draft · published
   ═══════════════════════════════════════════════════════════ */
export type CoursePublishStatus = 'draft' | 'published';

export const coursePublishStatus: StatusMap<CoursePublishStatus> = {
  variant: {
    draft:     'yellow',
    published: 'green',
  },
  label: {
    draft:     'Borrador',
    published: 'Publicado',
  },
  chips: ['Todos', 'Publicado', 'Borrador'],
  chipKey: {
    Publicado: 'published',
    Borrador:  'draft',
  },
};

/* ═══════════════════════════════════════════════════════════
   LECCIONES — tipo de contenido
   video · quiz · practice · reading · live
   ═══════════════════════════════════════════════════════════ */
export type LessonContentType = 'video' | 'quiz' | 'practice' | 'reading' | 'live';

export interface ContentTypeMap {
  icon:    Record<LessonContentType, string>;
  label:   Record<LessonContentType, string>;
  variant: Record<LessonContentType, BadgeVariant>;
  chips:   string[];
}

export const lessonType: ContentTypeMap = {
  icon: {
    video:    '▶',
    quiz:     '📝',
    practice: '✏️',
    reading:  '📖',
    live:     '📡',
  },
  label: {
    video:    'Video',
    quiz:     'Evaluación',
    practice: 'Práctica',
    reading:  'Lectura',
    live:     'Sesión en vivo',
  },
  variant: {
    video:    'blue',
    quiz:     'yellow',
    practice: 'green',
    reading:  'dark',
    live:     'red',
  },
  chips: ['Todos', 'Video', 'Quiz', 'Practice', 'Reading', 'Live'],
};

/* ═══════════════════════════════════════════════════════════
   CALIFICACIONES — tipo de evaluación
   quiz · task · exam
   ═══════════════════════════════════════════════════════════ */
export type CalificationType = 'quiz' | 'task' | 'exam';

export interface CalificationTypeMap {
  icon:    Record<CalificationType, string>;
  label:   Record<CalificationType, string>;
  variant: Record<CalificationType, BadgeVariant>;
  chips:   string[];
  /** Mapea chip en español → key interna */
  chipKey: Record<string, CalificationType>;
}

export const calificationType: CalificationTypeMap = {
  icon: {
    quiz: '📝',
    task: '✏️',
    exam: '🎓',
  },
  label: {
    quiz: 'Quiz',
    task: 'Tarea',
    exam: 'Examen',
  },
  variant: {
    quiz: 'blue',
    task: 'green',
    exam: 'yellow',
  },
  chips: ['Todos', 'Quiz', 'Tarea', 'Examen'],
  chipKey: {
    Quiz:   'quiz',
    Tarea:  'task',
    Examen: 'exam',
  },
};

/* ═══════════════════════════════════════════════════════════
   AUDITORÍA — método HTTP
   GET · POST · PUT · PATCH · DELETE
   ═══════════════════════════════════════════════════════════ */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const httpMethod: {
  variant: Record<HttpMethod, BadgeVariant>;
  chips:   HttpMethod[];
} = {
  variant: {
    GET:    'blue',
    POST:   'green',
    PUT:    'yellow',
    PATCH:  'yellow',
    DELETE: 'red',
  },
  chips: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

/* ═══════════════════════════════════════════════════════════
   USUARIOS — estado de cuenta
   active · inactive
   ═══════════════════════════════════════════════════════════ */
export const userStatus: Pick<StatusMap, 'variant' | 'label' | 'chips'> = {
  variant: {
    active:   'green',
    inactive: 'yellow',
  },
  label: {
    active:   'Activo',
    inactive: 'Inactivo',
  },
  chips: ['Todos', 'Activos', 'Inactivos'],
};

/* ═══════════════════════════════════════════════════════════
   HELPERS — funciones utilitarias
   ═══════════════════════════════════════════════════════════ */

/**
 * Devuelve el BadgeVariant de un mapa dado un key,
 * con fallback seguro si el key no existe.
 */
export function getVariant(
  map: { variant: Record<string, BadgeVariant> },
  key: string,
  fallback: BadgeVariant = 'blue',
): BadgeVariant {
  return map.variant[key] ?? fallback;
}

/**
 * Devuelve la etiqueta de un mapa dado un key,
 * con fallback al key original.
 */
export function getLabel(
  map: { label: Record<string, string> },
  key: string,
): string {
  return map.label[key] ?? key;
}

/**
 * Devuelve el ícono de un ContentTypeMap dado un key.
 */
export function getIcon(
  map: { icon: Record<string, string> },
  key: string,
  fallback = '▪',
): string {
  return map.icon[key] ?? fallback;
}

/**
 * Devuelve el color de ProgressBar según el porcentaje.
 */
export function progressColor(pct: number): ProgressColor {
  if (pct >= 80) return 'green';
  if (pct >= 40) return 'blue';
  return 'yellow';
}

export type LessonContentType = 'text' | 'video' | 'link' | 'file' | 'quiz' | 'practice' | 'reading' | 'live' | 'exam' | 'assignment';

export const CONTENT_TYPE_META: Record<LessonContentType, { label: string; icon: string }> = {
  video:    { label: 'Clases en video',     icon: 'solar:play-circle-bold-duotone' },
  file:     { label: 'Clases por PDF',      icon: 'solar:file-text-bold-duotone' },
  reading:  { label: 'Material de lectura', icon: 'solar:book-bookmark-bold-duotone' },
  /** El alumno sube un archivo como entrega y el instructor la califica a mano. */
  assignment: { label: 'Tarea (entrega de archivo)', icon: 'solar:clipboard-check-bold-duotone' },
  text:     { label: 'Material',            icon: 'solar:document-text-bold-duotone' },
  link:     { label: 'Enlaces',             icon: 'solar:link-bold-duotone' },
  practice: { label: 'Prácticas',           icon: 'solar:pen-new-square-bold-duotone' },
  quiz:     { label: 'Evaluaciones',        icon: 'solar:check-circle-bold-duotone' },
  live:     { label: 'Clases en vivo',      icon: 'solar:videocamera-record-bold-duotone' },
  /** No es un tipo de Lesson real — igual que 'live', crea otra entidad
      (Evaluation) en vez de una lección. */
  exam:     { label: 'Asignar examen',      icon: 'solar:document-add-bold-duotone' },
};

export function contentTypeMeta(type: string) {
  return CONTENT_TYPE_META[type as LessonContentType] ?? { label: type, icon: 'solar:question-circle-bold' };
}

export function formatDuration(minutes?: number | null) {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

/**
 * Deriva la miniatura de una lección de video a partir de su URL de Cloudinary
 * (frame en el segundo 0, recortado a 16:9) — no hay campo de thumbnail propio,
 * así que reutilizamos la transformación de video→imagen de Cloudinary en vez
 * de guardar una imagen aparte. Devuelve null si la URL no es de Cloudinary.
 */
export function cloudinaryVideoThumbnail(url?: string | null): string | null {
  if (!url?.includes('/video/upload/')) return null;
  const withFrame = url.replace('/video/upload/', '/video/upload/so_0,w_480,h_270,c_fill,q_auto/');
  return withFrame.replace(/\.[a-z0-9]{2,5}(\?.*)?$/i, '.jpg$1');
}

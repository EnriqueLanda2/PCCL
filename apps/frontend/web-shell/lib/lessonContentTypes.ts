export type LessonContentType = 'text' | 'video' | 'link' | 'file' | 'quiz' | 'practice' | 'reading' | 'live';

export const CONTENT_TYPE_META: Record<LessonContentType, { label: string; icon: string }> = {
  video:    { label: 'Clases en video',     icon: 'solar:play-circle-bold-duotone' },
  file:     { label: 'Clases por PDF',      icon: 'solar:file-text-bold-duotone' },
  reading:  { label: 'Material de lectura', icon: 'solar:book-bookmark-bold-duotone' },
  text:     { label: 'Material',            icon: 'solar:document-text-bold-duotone' },
  link:     { label: 'Enlaces',             icon: 'solar:link-bold-duotone' },
  practice: { label: 'Prácticas',           icon: 'solar:pen-new-square-bold-duotone' },
  quiz:     { label: 'Evaluaciones',        icon: 'solar:check-circle-bold-duotone' },
  live:     { label: 'Clases en vivo',      icon: 'solar:videocamera-record-bold-duotone' },
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

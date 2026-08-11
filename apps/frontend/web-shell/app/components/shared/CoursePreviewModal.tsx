/* ───────────────────────────────────────────
   CoursePreviewModal — vista previa de un curso
   del catálogo ANTES de inscribirse. Existe porque
   "Ver detalles" no tenía a dónde llevar: no hay
   ruta de detalle para cursos en los que aún no
   estás inscrito, así que el botón acababa
   disparando la inscripción sin avisar.

   El temario llega de GET /courses/public/:id, que
   devuelve solo los encabezados de cada lección
   (título, tipo y duración). El material en sí no
   viaja por esa ruta: es lo que se obtiene al
   inscribirse.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Modal } from '@/app/components/ui/Modal';
import { Badge } from '@/app/components/ui/Badge';
import { courseCategory, fallbackCover, levelLabel } from '@/app/components/shared/CourseCard';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { api } from '@/lib/api';
import { contentTypeMeta, formatDuration } from '@/lib/lessonContentTypes';
import { priceLabel, requiresPayment } from '@/lib/enrollableCourses';
import type { PublicCourse, PublicLesson } from '@/lib/types';

interface CoursePreviewModalProps {
  open: boolean;
  course: PublicCourse;
  /** Inscripción en curso — bloquea el botón para no crear dos inscripciones */
  busy?: boolean;
  onClose: () => void;
  /** Inscribe (gratuito) o abre el checkout (con costo) */
  onEnroll: (course: PublicCourse) => void;
}

export function CoursePreviewModal({
  open,
  course,
  busy = false,
  onClose,
  onEnroll,
}: Readonly<CoursePreviewModalProps>) {
  const paid = requiresPayment(course);
  const duration = formatDuration(course.durationMinutes);
  const [lessons, setLessons] = useState<PublicLesson[] | null>(null);
  /* El temario es accesorio: si la petición falla, el modal sigue sirviendo
     para inscribirse y solo se omite la sección. */
  const [lessonsFailed, setLessonsFailed] = useState(false);

  /* El estado se reinicia dentro del timeout, no en el cuerpo del efecto:
     igual que en CheckoutModal, así no se dispara un setState síncrono
     durante el commit. */
  useEffect(() => {
    if (!open) return;
    let alive = true;
    const timer = window.setTimeout(() => {
      if (!alive) return;
      setLessons(null);
      setLessonsFailed(false);
      api.publicCourse(course.id)
        .then((detail) => { if (alive) setLessons(detail.lessons); })
        .catch(() => { if (alive) setLessonsFailed(true); });
    }, 0);
    return () => { alive = false; window.clearTimeout(timer); };
  }, [open, course.id]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={course.title}
      description={courseCategory(course)}
    >
      <div className="flex flex-col gap-5">
        <div className="relative h-[10.5rem] overflow-hidden rounded-[1.25rem]">
          {course.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={course.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: fallbackCover(course) }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="blue">{levelLabel(course.level)}</Badge>
          <Badge variant={paid ? 'dark' : 'green'}>{priceLabel(course)}</Badge>
          {duration && <Badge variant="teal">{duration}</Badge>}
        </div>

        <div>
          <h3 className="mb-1.5 text-[0.8125rem] font-bold text-[var(--ink)]">Sobre este curso</h3>
          <p className="text-[0.9063rem] leading-relaxed text-[var(--ink-soft)]">
            {course.description || 'Este curso todavía no tiene una descripción.'}
          </p>
        </div>

        {!lessonsFailed && (
          <div>
            <h3 className="mb-2 text-[0.8125rem] font-bold text-[var(--ink)]">
              Temario{lessons ? ` · ${lessons.length} ${lessons.length === 1 ? 'lección' : 'lecciones'}` : ''}
            </h3>

            {lessons === null ? (
              <div className="flex justify-center py-4"><WaveSpinner size="sm" /></div>
            ) : lessons.length === 0 ? (
              <p className="text-[0.8125rem] text-[var(--ink-muted)]">
                El instructor todavía no ha publicado lecciones.
              </p>
            ) : (
              <ol className="flex flex-col gap-1.5">
                {lessons.map((lesson, i) => {
                  const meta = contentTypeMeta(lesson.contentType);
                  const lessonDuration = formatDuration(lesson.durationMinutes);
                  return (
                    <li
                      key={lesson.id}
                      className="flex items-center gap-3 rounded-xl bg-[var(--neutral-50,#F7F9F6)] px-3 py-2"
                    >
                      <span className="w-5 flex-shrink-0 text-right text-[0.75rem] font-bold text-[var(--neutral-300)]">
                        {i + 1}
                      </span>
                      <Icon icon={meta.icon} width={18} height={18} className="flex-shrink-0 text-[var(--blue-600)]" />
                      <span className="min-w-0 flex-1 truncate text-[0.875rem] font-semibold text-[var(--ink)]">
                        {lesson.title}
                      </span>
                      {lessonDuration && (
                        <span className="flex-shrink-0 text-[0.75rem] text-[var(--ink-muted)]">{lessonDuration}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="text"
            onClick={onClose}
            sx={{
              borderRadius: '1rem',
              px: 2.5,
              py: 1.15,
              color: 'var(--ink-muted)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--neutral-100)', color: 'var(--ink)' },
            }}
          >
            Cerrar
          </Button>
          <Button
            type="button"
            variant="contained"
            disabled={busy}
            onClick={() => onEnroll(course)}
            startIcon={busy ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{
              borderRadius: '1rem',
              bgcolor: 'var(--green-600)',
              px: 3,
              py: 1.15,
              fontFamily: 'var(--font-sans)',
              fontWeight: 900,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'var(--green-700)', boxShadow: 'none' },
            }}
          >
            {busy ? 'Inscribiendo…' : paid ? `Comprar · ${priceLabel(course)}` : 'Inscribirme'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

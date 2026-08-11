'use client';

import React from 'react';
import Button from '@mui/material/Button';
import type { Course } from '@/lib/types';
import { ProgressBar } from '@/app/components/ui/ProgressBar';
import { contentTypeMeta, formatDuration } from '@/lib/lessonContentTypes';
import { cn } from '@/lib/cn';

interface CourseCardProps {
  course: Course;
  progress?: number;
  actionLabel?: string;
  detailsLabel?: string;
  onAction?: (course: Course) => void;
  onDetails?: (course: Course) => void;
  loading?: boolean;
  className?: string;
}

const LEVEL_LABEL: Record<string, string> = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

const CATEGORY_BY_LEVEL: Record<string, string> = {
  basic: 'Diseño',
  intermediate: 'Programación',
  advanced: 'Estrategia',
};

const FALLBACK_COVERS = [
  'linear-gradient(135deg, #E7F4EF 0%, #F8F3DF 45%, #2D6CDF 46%, #F9C74F 64%, #EAF3FE 65%)',
  'linear-gradient(135deg, #07111F 0%, #112E46 55%, #22D3EE 56%, #0E1A26 100%)',
  'linear-gradient(135deg, #101B2A 0%, #172A3F 45%, #2FA866 46%, #F97316 70%, #D946EF 100%)',
  'linear-gradient(135deg, #F3FAF0 0%, #DCE9FF 48%, #2EA761 49%, #15395D 100%)',
];

function levelLabel(level: string) {
  return LEVEL_LABEL[level] ?? level;
}

function fallbackCover(course: Course) {
  const index = Math.abs([...course.id].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % FALLBACK_COVERS.length;
  return FALLBACK_COVERS[index];
}

function lessonCount(course: Course) {
  return course.totalLessons ?? course.lessons?.length ?? 0;
}

export function CourseCardSkeleton() {
  return (
    <div className="h-[26.5rem] animate-pulse overflow-hidden rounded-[1.75rem] border border-[var(--neutral-100)] bg-white">
      <div className="h-[11.5rem] bg-[var(--neutral-100)]" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-2/3 rounded bg-[var(--neutral-100)]" />
        <div className="h-5 w-full rounded bg-[var(--neutral-100)]" />
        <div className="h-4 w-5/6 rounded bg-[var(--neutral-100)]" />
        <div className="mt-4 h-2 rounded bg-[var(--neutral-100)]" />
      </div>
    </div>
  );
}

export function CourseCard({
  course,
  progress = 0,
  actionLabel = 'Continuar',
  detailsLabel = 'Ver detalles',
  onAction,
  onDetails,
  loading = false,
  className,
}: Readonly<CourseCardProps>) {
  if (loading) return <CourseCardSkeleton />;

  const category = course.category ?? CATEGORY_BY_LEVEL[course.level] ?? 'Curso';
  const duration = formatDuration(course.durationMinutes);
  const lessons = lessonCount(course);
  const primaryContentType = course.lessons?.[0]?.contentType;
  const contentMeta = primaryContentType ? contentTypeMeta(primaryContentType) : null;
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const hasReviews = Boolean(course.rating && course.reviewCount);

  return (
    <article
      className={cn(
        'group flex h-full min-h-[26.5rem] flex-col overflow-hidden rounded-[1.75rem] border border-[var(--neutral-100)] bg-white shadow-[0_18px_36px_rgba(23,50,77,0.08)] transition-transform duration-200 hover:-translate-y-1',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onDetails?.(course)}
        className="relative h-[11.5rem] w-full overflow-hidden text-left"
        aria-label={`Ver detalles de ${course.title}`}
      >
        {course.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.coverImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0" style={{ background: fallbackCover(course) }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-[0.75rem] font-extrabold text-[var(--green-700)] shadow-[0_8px_18px_rgba(23,50,77,0.12)]">
          {levelLabel(course.level)}
        </span>
      </button>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[0.8125rem] font-semibold text-[var(--blue-600)]">
          <span>{category}</span>
          {(duration || lessons > 0 || contentMeta) && <span className="text-[var(--neutral-300)]">•</span>}
          {duration ? <span>{duration}</span> : lessons > 0 ? <span>{lessons} lecciones</span> : null}
          {hasReviews && (
            <>
              <span className="text-[var(--neutral-300)]">•</span>
              <span>★ {course.rating?.toFixed(1)}</span>
            </>
          )}
          {contentMeta && (
            <>
              <span className="text-[var(--neutral-300)]">•</span>
              <span>{contentMeta.label}</span>
            </>
          )}
          {course.certificateIncluded && (
            <>
              <span className="text-[var(--neutral-300)]">•</span>
              <span>Certificado</span>
            </>
          )}
        </div>

        <h3 className="line-clamp-2 text-[1.0625rem] font-extrabold leading-snug text-[var(--ink)]">
          {course.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-[0.9063rem] leading-relaxed text-[var(--ink-soft)]">
          {course.description || 'Explora el contenido del curso y continúa tu aprendizaje.'}
        </p>

        <div className="mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between text-[0.8125rem]">
            <span className="font-semibold text-[var(--blue-600)]">Progreso</span>
            <strong className="font-extrabold text-[var(--green-600)]">{clampedProgress}%</strong>
          </div>
          <ProgressBar value={clampedProgress} color="green" />
          <div className="mt-5 flex items-center gap-3">
            <Button
              type="button"
              variant="contained"
              onClick={() => onAction?.(course)}
              sx={{
                flex: '1 1 auto',
                borderRadius: '1rem',
                bgcolor: 'var(--green-600)',
                py: 1.25,
                fontFamily: 'var(--font-sans)',
                fontWeight: 900,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'var(--green-700)', boxShadow: 'none' },
              }}
            >
              {actionLabel}
            </Button>
            <Button
              type="button"
              variant="text"
              onClick={() => onDetails?.(course)}
              sx={{
                flex: '0 0 auto',
                minWidth: 0,
                px: 0,
                color: 'var(--blue-600)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 800,
                textDecoration: 'underline',
                textTransform: 'none',
                '&:hover': { bgcolor: 'transparent', color: 'var(--blue-700)', textDecoration: 'underline' },
              }}
            >
              {detailsLabel}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

import React from 'react';
import Link from 'next/link';
import { ProgressBar } from '@/app/components/ui/ProgressBar';
import { Badge } from '@/app/components/ui/Badge';
import type { Course } from '@/types/course';
import { courseLevel, getVariant } from '@/types/status';
import { contentTypeMeta, formatDuration } from '@/lib/lessonContentTypes';
import { cn } from '@/lib/cn';

interface CourseCardProps {
  course:       Course;
  href?:        string;
  /** Si se provee, la tarjeta se vuelve interactiva (botón) y NO navega — solo notifica la selección */
  onSelect?:    (course: Course) => void;
  progress?:    number;
  showRating?:  boolean;
  loading?:     boolean;
  size?:        'default' | 'compact';
}

/* Gradient covers — 6 variants matching globals.css cover-N classes */
const coverIcons = ['∿', '◐', '∑', '⏵', '✎', '☁'];

/* ── Skeleton ── */
export function CourseCardSkeleton({ size = 'default' }: { size?: 'default' | 'compact' }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className={cn('w-full bg-neutral-200', size === 'compact' ? 'h-28' : 'aspect-video')} />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="h-3 bg-neutral-100 rounded w-1/2" />
        <div className="h-2 bg-neutral-100 rounded w-full mt-1" />
      </div>
    </div>
  );
}

/* ── Card ── */
export function CourseCard({
  course,
  href,
  onSelect,
  progress,
  showRating = false,
  loading    = false,
  size       = 'default',
}: CourseCardProps) {
  if (loading) return <CourseCardSkeleton size={size} />;

  const coverNum = course.coverVariant ?? ((Number.parseInt(course.id, 16) % 6) || 1);
  const icon     = course.coverIcon ?? coverIcons[(coverNum - 1) % coverIcons.length];
  const duration = formatDuration(course.durationMinutes);

  /* Mezcla de tipos de contenido presentes en el curso (para el reverso) */
  const contentTypes = Array.from(new Set((course.lessons ?? []).map((l) => l.contentType)));

  const cardHeight = size === 'compact' ? 'h-[260px]' : 'h-[380px]';

  const front = (
    <div className="course-flip-face absolute inset-0 flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      {/* ── Cover ── */}
      <div
        className={cn(
          course.coverImageUrl ? 'bg-neutral-200' : `cover-${coverNum}`,
          'relative flex items-end p-4 text-white overflow-hidden flex-shrink-0',
          size === 'compact' ? 'h-28' : 'aspect-video',
        )}
      >
        {course.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.coverImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Category pill */}
        <span className="absolute top-3 left-3 z-10 bg-black/50 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm">
          {course.category ?? course.level}
        </span>

        {/* Duración */}
        {duration && (
          <span className="absolute top-3 right-3 z-10 bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
            ⏱ {duration}
          </span>
        )}

        {/* Icon decoration — solo si no hay portada real */}
        {!course.coverImageUrl && (
          <span
            className={cn(
              'font-serif leading-none opacity-80 select-none z-10',
              size === 'compact' ? 'text-5xl' : 'text-6xl',
            )}
          >
            {icon}
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col gap-2 flex-1 min-h-0">
        <h3
          className={cn(
            'font-serif text-neutral-900 leading-tight line-clamp-2',
            size === 'compact' ? 'text-base' : 'text-lg',
          )}
        >
          {course.title}
        </h3>

        {/* Meta row */}
        {size !== 'compact' && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 flex-wrap min-h-[1.25rem]">
            {course.instructorName && (
              <span className="font-medium text-neutral-700">{course.instructorName}</span>
            )}
            {course.instructorName && (course.totalLessons || course.lessons?.length) && (
              <span className="text-neutral-300">·</span>
            )}
            {(course.totalLessons ?? course.lessons?.length) ? (
              <span>{course.totalLessons ?? course.lessons?.length} lecciones</span>
            ) : null}
          </div>
        )}

        {/* Progress bar */}
        {progress !== undefined && (
          <ProgressBar value={progress} color="blue" showLabel className="mt-1" />
        )}

        {/* Rating + level row */}
        {showRating && (
          <div className="flex justify-between items-center mt-auto pt-2">
            <Badge variant={getVariant(courseLevel, course.level)}>
              {course.level}
            </Badge>
            {course.rating !== undefined && (
              <span className="text-xs font-semibold text-warning-500 flex items-center gap-1">
                <span>★</span>
                <span>{course.rating.toFixed(1)}</span>
                {course.studentsCount && (
                  <span className="text-neutral-400 font-normal">
                    · {course.studentsCount.toLocaleString()}
                  </span>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const back = (
    <div className="course-flip-face course-flip-face-back flex flex-col bg-white border border-neutral-300 rounded-xl overflow-hidden shadow-md p-5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-600 mb-2">
        {course.category ?? course.level}
      </span>
      <h3 className="font-serif text-neutral-900 text-lg leading-tight line-clamp-2 mb-2">
        {course.title}
      </h3>
      <p className={cn('text-sm text-neutral-600 leading-relaxed flex-1', size === 'compact' ? 'line-clamp-3' : 'line-clamp-6')}>
        {course.description}
      </p>

      <div className="flex items-center gap-1.5 text-xs text-neutral-500 flex-wrap mt-3 pt-3 border-t border-neutral-100">
        {duration && <span className="flex items-center gap-1">⏱ {duration}</span>}
        {(course.totalLessons ?? course.lessons?.length) ? (
          <>
            {duration && <span className="text-neutral-300">·</span>}
            <span>{course.totalLessons ?? course.lessons?.length} lecciones</span>
          </>
        ) : null}
      </div>

      {contentTypes.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mt-2">
          {contentTypes.map((ct) => {
            const meta = contentTypeMeta(ct);
            return (
              <span
                key={ct}
                className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-600 text-[10px] font-medium px-2 py-0.5 rounded-full"
              >
                <span>{meta.icon}</span>
                {meta.label}
              </span>
            );
          })}
        </div>
      )}

      <span className="text-xs font-semibold text-blue-600 mt-3">
        {onSelect ? 'Clic para ver el contenido →' : 'Pasa el mouse para volver'}
      </span>
    </div>
  );

  const sceneClassName = cn(
    'course-flip-scene block w-full', cardHeight,
    'transition-transform duration-300 hover:-translate-y-1.5',
  );

  const flipper = (
    <div className="course-flip-flipper">
      {front}
      {back}
    </div>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(course)}
        className={cn(sceneClassName, 'text-left')}
        aria-label={`Ver contenido de ${course.title}`}
      >
        {flipper}
      </button>
    );
  }

  return href
    ? <Link href={href} className={cn(sceneClassName, 'no-underline')}>{flipper}</Link>
    : <div className={sceneClassName}>{flipper}</div>;
}

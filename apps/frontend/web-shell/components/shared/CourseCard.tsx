import React from 'react';
import Link from 'next/link';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import type { Course } from '@/types/course';
import { courseLevel, getVariant } from '@/types/status';
import { cn } from '@/lib/cn';

interface CourseCardProps {
  course:       Course;
  href?:        string;
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
  progress,
  showRating = false,
  loading    = false,
  size       = 'default',
}: CourseCardProps) {
  if (loading) return <CourseCardSkeleton size={size} />;

  const coverNum = course.coverVariant ?? ((Number.parseInt(course.id, 16) % 6) || 1);
  const icon     = course.coverIcon ?? coverIcons[(coverNum - 1) % coverIcons.length];

  const inner = (
    <div
      className={cn(
        'flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden',
        'shadow-sm transition-all duration-200 group',
        href && 'hover:-translate-y-1 hover:shadow-md hover:border-neutral-300',
      )}
    >
      {/* ── Cover ── */}
      <div
        className={cn(
          `cover-${coverNum} relative flex items-end p-4 text-white overflow-hidden`,
          size === 'compact' ? 'h-28' : 'aspect-video',
        )}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Category pill */}
        <span className="absolute top-3 left-3 z-10 bg-black/50 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm">
          {course.category ?? course.level}
        </span>

        {/* Icon decoration */}
        <span
          className={cn(
            'font-serif leading-none opacity-80 select-none z-10 transition-transform duration-300',
            'group-hover:scale-110',
            size === 'compact' ? 'text-5xl' : 'text-6xl',
          )}
        >
          {icon}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col gap-2 flex-1">
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
            {course.instructorName && (course.totalLessons || course.durationMinutes) && (
              <span className="text-neutral-300">·</span>
            )}
            {course.totalLessons && <span>{course.totalLessons} lecciones</span>}
            {course.durationMinutes && (
              <>
                <span className="text-neutral-300">·</span>
                <span>
                  {Math.floor(course.durationMinutes / 60)}h{' '}
                  {course.durationMinutes % 60 > 0 ? `${course.durationMinutes % 60}m` : ''}
                </span>
              </>
            )}
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

  return href
    ? <Link href={href} className="no-underline block">{inner}</Link>
    : inner;
}

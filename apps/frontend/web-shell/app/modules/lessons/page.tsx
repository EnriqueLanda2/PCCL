/* ───────────────────────────────────────────
   Lessons Page — Mis cursos / lecciones
   Accordion por curso · tipo de contenido
   Badge de tipo · progreso por lección
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { Course, Lesson } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { AppButton, AppInput } from '@/app/components/ui/AppControls';
import { ProgressBar } from '@/app/components/ui/ProgressBar';
import { GoalCard } from '@/registry/new-york/ui/goal-card';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { CreateLessonModal } from '@/app/components/shared/CreateLessonModal';
import { CourseComments } from '@/app/components/shared/CourseComments';
import { useLessonFileViewer } from '@/app/components/shared/LessonFileViewer';
import { lessonType, getIcon, getLabel, getVariant } from '@/types/status';
import { APP_ICONS } from '@/lib/icons';

/* ── Group lessons by course ── */
function groupByCourse(lessons: Lesson[]): Map<string, Lesson[]> {
  const map = new Map<string, Lesson[]>();
  for (const l of lessons) {
    const key = l.courseId ?? 'Sin curso';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(l);
  }
  return map;
}

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '14px 0', borderBottom: '1px solid var(--neutral-100)' }}>
      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: 'var(--neutral-100)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <div style={{ height: '0.875rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: '60%' }} />
        <div style={{ height: '0.75rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: '35%' }} />
      </div>
      <div style={{ width: '4.375rem', height: '1.375rem', borderRadius: '999px', background: 'var(--neutral-100)' }} />
    </div>
  );
}

/* ── Single lesson row (accordion body) ── */
function LessonListItem({ lesson, isLast, canCreate, onEditLesson }: {
  lesson: Lesson;
  isLast: boolean;
  canCreate: boolean;
  onEditLesson: (lesson: Lesson) => void;
}) {
  const icon    = getIcon(lessonType,    lesson.contentType);
  const label   = getLabel(lessonType,   lesson.contentType);
  const variant = getVariant(lessonType, lesson.contentType);
  const bgColor = lesson.contentType === 'quiz'     ? 'var(--blue-100)'
                : lesson.contentType === 'practice' ? 'var(--bg-dark)'
                : 'var(--blue-50)';
  const fgColor = lesson.contentType === 'practice' ? 'var(--panel)' : 'var(--blue-700)';
  const { controls, content } = useLessonFileViewer(lesson);

  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid var(--neutral-100)' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          padding: '13px 0',
          opacity: lesson.locked ? 0.5 : 1,
        }}
      >
        {/* Icon */}
        <span style={{
          width: '2.375rem', height: '2.375rem', borderRadius: '0.625rem',
          background: bgColor, color: fgColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon icon={lesson.completed ? APP_ICONS.check : icon} width={16} height={16} />
        </span>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.875rem', fontWeight: 500, color: lesson.completed ? 'var(--ink-muted)' : 'var(--ink)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            textDecoration: lesson.completed ? 'line-through' : 'none',
          }}>
            {lesson.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: '2px', display: 'flex', gap: '0.375rem' }}>
            <span>{label}</span>
            {lesson.durationMinutes && <span>· {lesson.durationMinutes} min</span>}
            {lesson.locked && (
              <span style={{ color: 'var(--yellow-600)', display: 'inline-flex', alignItems: 'center', gap: '0.1875rem' }}>
                · <Icon icon={APP_ICONS.lock} width={11} height={11} /> Bloqueada
              </span>
            )}
          </div>
        </div>

        {/* Adjunto */}
        {controls}

        {/* Badge */}
        {lesson.completed ? (
          <Badge variant="green">Completada</Badge>
        ) : lesson.locked ? (
          <Badge variant="yellow">Bloqueada</Badge>
        ) : (
          <Badge variant={variant}>{label}</Badge>
        )}

        {/* Editar */}
        {canCreate && (
          <button
            type="button"
            onClick={() => onEditLesson(lesson)}
            aria-label={`Editar ${lesson.title}`}
            style={{
              flexShrink: 0, width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--neutral-100)', background: 'var(--panel)',
              color: 'var(--ink-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {content && <div style={{ marginBottom: '0.8125rem' }}>{content}</div>}
    </div>
  );
}

/* ── Accordion course group ── */
function CourseGroup({ courseId, course, lessons, open, onToggle, canCreate, onAddLesson, onEditLesson }: {
  courseId: string;
  course?: Course;
  lessons: Lesson[];
  open: boolean;
  onToggle: () => void;
  canCreate: boolean;
  onAddLesson: (courseId: string) => void;
  onEditLesson: (lesson: Lesson) => void;
}) {
  const done = lessons.filter((l) => l.completed).length;
  const pct  = Math.round((done / lessons.length) * 100);
  const courseName = course?.title ?? lessons[0]?.courseName ?? `Curso ${courseId.slice(0, 6)}`;

  return (
    <Card padding="default" style={{ marginBottom: '0.75rem' }}>
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          textAlign: 'left', fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{
          width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem', flexShrink: 0,
          background: 'var(--blue-900)', color: 'var(--panel)', display: 'flex', alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon icon={APP_ICONS.book} width={22} height={22} />
        </div>
        {/* El avance del curso se pinta con GoalCard: cada lección es un hito
            del roadmap, que es justo lo que el componente modela. */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <GoalCard
            id={courseId}
            title={courseName}
            progress={pct}
            roadmap={{
              title: courseName,
              nodes: lessons.map((l) => ({
                id: l.id,
                title: l.title,
                isComplete: Boolean(l.completed),
              })),
            }}
            className="border-none bg-transparent p-0 shadow-none dark:bg-transparent"
          />
        </div>
        <span style={{
          color: 'var(--ink-muted)', fontSize: '1.125rem', transition: 'transform 200ms',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0,
        }}>›</span>
      </button>

      {/* Lessons list */}
      {open && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--neutral-100)', paddingTop: '0.875rem' }}>
          {courseId !== 'Sin curso' && (
            <div style={{ marginBottom: '0.875rem' }}>
              <CourseComments courseId={courseId} className="rounded-3xl border border-[var(--neutral-100)] bg-white/85 p-4 shadow-[0_12px_28px_rgba(23,50,77,0.06)]" />
            </div>
          )}
          {canCreate && courseId !== 'Sin curso' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 0' }}>
              <Button type="button" variant="secondary" size="sm" onClick={() => onAddLesson(courseId)}>
                + Agregar lección
              </Button>
            </div>
          )}
          {lessons.map((lesson, i) => (
            <LessonListItem
              key={lesson.id}
              lesson={lesson}
              isLast={i === lessons.length - 1}
              canCreate={canCreate}
              onEditLesson={onEditLesson}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export default function LessonsPage() {
  const [lessons,     setLessons]     = useState<Lesson[]>([]);
  const [courses,     setCourses]     = useState<Course[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles,       setRoles]       = useState<string[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [openGroups,  setOpenGroups]  = useState<Set<string>>(new Set());
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState('Todos');
  const [modalOpen,      setModalOpen]      = useState(false);
  const [modalCourseId,  setModalCourseId]  = useState<string | null>(null);
  const [editingLesson,  setEditingLesson]  = useState<Lesson | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([api.lessons(), api.courses().catch(() => []), api.access()])
      .then(([lessonList, courseList, access]) => {
        if (!alive) return;
        setLessons(lessonList);
        setCourses(courseList);
        setPermissions(access.permissions);
        setRoles(access.roles);
        /* Open first group by default */
        const firstCourse = lessonList[0]?.courseId;
        if (firstCourse) setOpenGroups(new Set([firstCourse ?? 'Sin curso']));
      })
      .catch(() => { if (alive) { setLessons([]); setCourses([]); setPermissions([]); setRoles([]); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const canCreate = useMemo(() => permissions.includes('lessons:create'), [permissions]);

  /* Las lecciones llegan ya acotadas por el backend: las de los cursos que el
     alumno cursa, las de los cursos que el instructor creó, o todas si es admin. */
  const isAdmin      = roles.includes('admin');
  const isInstructor = roles.includes('instructor');

  /* ── Filter ── */
  const filtered = useMemo(() => {
    let list = [...lessons];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) => l.title.toLowerCase().includes(q));
    }
    if (typeFilter !== 'Todos') {
      list = list.filter((l) => l.contentType === typeFilter.toLowerCase());
    }
    return list;
  }, [lessons, search, typeFilter]);

  const grouped = useMemo(() => groupByCourse(filtered), [filtered]);
  const coursesById = useMemo(() => new Map(courses.map((course) => [course.id, course])), [courses]);

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const expandAll  = () => setOpenGroups(new Set(grouped.keys()));
  const collapseAll = () => setOpenGroups(new Set());

  const openAddLesson = (courseId: string) => { setModalCourseId(courseId); setEditingLesson(null); setModalOpen(true); };
  const openEditLesson = (lesson: Lesson) => { setModalCourseId(lesson.courseId ?? null); setEditingLesson(lesson); setModalOpen(true); };
  const handleLessonSaved = (saved: Lesson) => {
    setLessons((prev) => {
      const exists = prev.some((l) => l.id === saved.id);
      return exists ? prev.map((l) => (l.id === saved.id ? saved : l)) : [...prev, saved];
    });
  };

  /* ── Stats ── */
  const totalCompleted = lessons.filter((l) => l.completed).length;
  const totalPct = lessons.length ? Math.round((totalCompleted / lessons.length) * 100) : 0;

  const TYPE_CHIPS = lessonType.chips;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <PageHeader
        title={<>{isAdmin ? 'Temas y ' : 'Mis '}lecciones</>}
        subtitle={loading ? 'Cargando…' : `${totalCompleted} de ${lessons.length} completadas · ${totalPct}% progreso general`}
      />

      {/* ── Overall progress bar ── */}
      {!loading && lessons.length > 0 && (
        <Card padding="default" variant="dark">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--blue-300)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Progreso general
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: 'var(--panel)' }}>
              {totalPct}<small style={{ fontSize: '0.875rem', color: 'var(--blue-300)', marginLeft: '2px' }}>%</small>
            </span>
          </div>
          <ProgressBar value={totalPct} color={totalPct === 100 ? 'green' : 'blue'} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.7813rem', color: 'var(--blue-300)' }}>
            <span>{totalCompleted} completadas</span>
            <span>{lessons.length - totalCompleted} restantes</span>
          </div>
        </Card>
      )}

      {/* ── Search + type chips + expand/collapse ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', minWidth: '15rem', maxWidth: '23.75rem' }}>
          <AppInput
            type="search"
            placeholder="Buscar lección…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            withSearchIcon
          />
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {TYPE_CHIPS.map((chip) => (
            <AppButton
              key={chip}
              type="button"
              onClick={() => setTypeFilter(chip)}
              variant={typeFilter === chip ? 'contained' : 'outlined'}
              sx={{
                bgcolor: typeFilter === chip ? 'var(--green-50)' : 'var(--panel)',
                color: typeFilter === chip ? 'var(--green-700)' : 'var(--ink-muted)',
                borderColor: typeFilter === chip ? 'var(--green-500)' : 'var(--neutral-200)',
                px: 1.8,
              }}
            >
              {chip}
            </AppButton>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', marginLeft: 'auto' }}>
          <AppButton type="button" onClick={expandAll} variant="outlined">
            Expandir todo
          </AppButton>
          <AppButton type="button" onClick={collapseAll} variant="outlined">
            Colapsar todo
          </AppButton>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <Card padding="default">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </Card>
      ) : grouped.size === 0 ? (
        <EmptyState
          icon={APP_ICONS.reading}
          title="Sin lecciones"
          description={
            search || typeFilter !== 'Todos'
              ? 'Ninguna lección coincide con tu búsqueda o filtro.'
              : isAdmin || isInstructor
                ? 'Aún no hay lecciones. ¡Crea la primera!'
                : 'Aún no estás inscrito en ningún curso, así que no hay lecciones que mostrar.'
          }
          action={
            (search || typeFilter !== 'Todos')
              ? { label: 'Limpiar filtros', onClick: () => { setSearch(''); setTypeFilter('Todos'); } }
              : undefined
          }
        />
      ) : (
        <div>
          {Array.from(grouped.entries()).map(([courseId, courseLessons]) => (
            <CourseGroup
              key={courseId}
              courseId={courseId}
              course={coursesById.get(courseId)}
              lessons={courseLessons}
              open={openGroups.has(courseId)}
              onToggle={() => toggleGroup(courseId)}
              canCreate={canCreate}
              onAddLesson={openAddLesson}
              onEditLesson={openEditLesson}
            />
          ))}
        </div>
      )}

      {modalCourseId && (
        <CreateLessonModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          courseId={modalCourseId}
          lesson={editingLesson}
          onSaved={handleLessonSaved}
        />
      )}
    </div>
  );
}

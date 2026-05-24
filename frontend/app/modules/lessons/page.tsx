/* ───────────────────────────────────────────
   Lessons Page — Mis cursos / lecciones
   Accordion por curso · tipo de contenido
   Badge de tipo · progreso por lección
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Lesson } from '@/lib/types';
import { appRoutes } from '@/lib/routes';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { lessonType, getIcon, getLabel, getVariant } from '@/types/status';

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
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid var(--neutral-100)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--neutral-100)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ height: '14px', borderRadius: '6px', background: 'var(--neutral-100)', width: '60%' }} />
        <div style={{ height: '12px', borderRadius: '6px', background: 'var(--neutral-100)', width: '35%' }} />
      </div>
      <div style={{ width: '70px', height: '22px', borderRadius: '999px', background: 'var(--neutral-100)' }} />
    </div>
  );
}

/* ── Accordion course group ── */
function CourseGroup({ courseId, lessons, open, onToggle }: {
  courseId: string;
  lessons: Lesson[];
  open: boolean;
  onToggle: () => void;
}) {
  const done = lessons.filter((l) => l.completed).length;
  const pct  = Math.round((done / lessons.length) * 100);
  const courseName = lessons[0]?.courseName ?? `Curso ${courseId.slice(0, 6)}`;

  return (
    <Card padding="default" style={{ marginBottom: '12px' }}>
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          textAlign: 'left', fontFamily: 'var(--font-sans)',
        }}
      >
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
          background: 'var(--blue-900)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '20px',
        }}>
          📚
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--ink)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {courseName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ProgressBar value={pct} color={pct === 100 ? 'green' : 'blue'} style={{ flex: 1, maxWidth: '160px' }} />
            <span style={{ fontSize: '12px', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
              {done}/{lessons.length} lecciones · {pct}%
            </span>
          </div>
        </div>
        <span style={{
          color: 'var(--ink-muted)', fontSize: '18px', transition: 'transform 200ms',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0,
        }}>›</span>
      </button>

      {/* Lessons list */}
      {open && (
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--neutral-100)', paddingTop: '4px' }}>
          {lessons.map((lesson, i) => {
            const icon    = getIcon(lessonType,    lesson.contentType);
            const label   = getLabel(lessonType,   lesson.contentType);
            const variant = getVariant(lessonType, lesson.contentType);
            const isLast  = i === lessons.length - 1;
            const bgColor = lesson.contentType === 'quiz'     ? 'var(--blue-100)'
                          : lesson.contentType === 'practice' ? 'var(--bg-dark)'
                          : 'var(--blue-50)';
            const fgColor = lesson.contentType === 'practice' ? 'var(--panel)' : 'var(--blue-700)';

            return (
              <Link
                key={lesson.id}
                href={`${appRoutes.lessons}/${lesson.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '13px 0', textDecoration: 'none', color: 'inherit',
                  borderBottom: isLast ? 'none' : '1px solid var(--neutral-100)',
                  opacity: lesson.locked ? 0.5 : 1,
                  pointerEvents: lesson.locked ? 'none' : undefined,
                }}
              >
                {/* Icon */}
                <span style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: bgColor, color: fgColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '14px',
                }}>
                  {lesson.completed ? '✓' : icon}
                </span>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: 500, color: lesson.completed ? 'var(--ink-muted)' : 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textDecoration: lesson.completed ? 'line-through' : 'none',
                  }}>
                    {lesson.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px', display: 'flex', gap: '6px' }}>
                    <span>{label}</span>
                    {lesson.durationMinutes && <span>· {lesson.durationMinutes} min</span>}
                    {lesson.locked && <span style={{ color: 'var(--yellow-600)' }}>· 🔒 Bloqueada</span>}
                  </div>
                </div>

                {/* Badge */}
                {lesson.completed ? (
                  <Badge variant="green">Completada</Badge>
                ) : lesson.locked ? (
                  <Badge variant="yellow">Bloqueada</Badge>
                ) : (
                  <Badge variant={variant}>{label}</Badge>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default function LessonsPage() {
  const [lessons,     setLessons]     = useState<Lesson[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [openGroups,  setOpenGroups]  = useState<Set<string>>(new Set());
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState('Todos');

  useEffect(() => {
    let alive = true;
    Promise.all([api.lessons(), api.access()])
      .then(([lessonList, access]) => {
        if (!alive) return;
        setLessons(lessonList);
        setPermissions(access.permissions);
        /* Open first group by default */
        const firstCourse = lessonList[0]?.courseId;
        if (firstCourse) setOpenGroups(new Set([firstCourse ?? 'Sin curso']));
      })
      .catch(() => { if (alive) { setLessons([]); setPermissions([]); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const canCreate = useMemo(() => permissions.includes('lessons:create'), [permissions]);

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

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll  = () => setOpenGroups(new Set(grouped.keys()));
  const collapseAll = () => setOpenGroups(new Set());

  /* ── Stats ── */
  const totalCompleted = lessons.filter((l) => l.completed).length;
  const totalPct = lessons.length ? Math.round((totalCompleted / lessons.length) * 100) : 0;

  const TYPE_CHIPS = lessonType.chips;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
            Mis <em style={{ color: 'var(--green-500)', fontStyle: 'italic' }}>lecciones</em>
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
            {loading ? 'Cargando…' : `${totalCompleted} de ${lessons.length} completadas · ${totalPct}% progreso general`}
          </p>
        </div>
        {canCreate && (
          <Button variant="primary" size="md">+ Nueva lección</Button>
        )}
      </div>

      {/* ── Overall progress bar ── */}
      {!loading && lessons.length > 0 && (
        <Card padding="default" variant="dark">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--blue-300)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Progreso general
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--panel)' }}>
              {totalPct}<small style={{ fontSize: '14px', color: 'var(--blue-300)', marginLeft: '2px' }}>%</small>
            </span>
          </div>
          <ProgressBar value={totalPct} color={totalPct === 100 ? 'green' : 'blue'} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12.5px', color: 'var(--blue-300)' }}>
            <span>{totalCompleted} completadas</span>
            <span>{lessons.length - totalCompleted} restantes</span>
          </div>
        </Card>
      )}

      {/* ── Search + type chips + expand/collapse ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '320px' }}>
          <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none', color: 'var(--ink-muted)' }}>
            🔍
          </span>
          <input
            type="search"
            placeholder="Buscar lección…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', height: '40px', paddingLeft: '40px', paddingRight: '12px',
              borderRadius: 'var(--radius-md)', border: '1.5px solid var(--neutral-200)',
              background: 'var(--blue-50)', fontSize: '13.5px', color: 'var(--ink)',
              fontFamily: 'var(--font-sans)', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TYPE_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setTypeFilter(chip)}
              style={{
                border: typeFilter === chip ? '1.5px solid var(--green-500)' : '1.5px solid var(--neutral-200)',
                background: typeFilter === chip ? 'var(--green-50)' : 'var(--panel)',
                color: typeFilter === chip ? 'var(--green-700)' : 'var(--ink-muted)',
                borderRadius: 'var(--radius-full)', padding: '5px 14px',
                fontSize: '12.5px', fontWeight: typeFilter === chip ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
          <button type="button" onClick={expandAll}  style={{ fontSize: '12.5px', color: 'var(--blue-600)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Expandir todo
          </button>
          <span style={{ color: 'var(--neutral-300)' }}>|</span>
          <button type="button" onClick={collapseAll} style={{ fontSize: '12.5px', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Colapsar todo
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <Card padding="default">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
        </Card>
      ) : grouped.size === 0 ? (
        <EmptyState
          icon="📖"
          title="Sin lecciones"
          description={
            search || typeFilter !== 'Todos'
              ? 'Ninguna lección coincide con tu búsqueda o filtro.'
              : canCreate
              ? 'Aún no hay lecciones. ¡Crea la primera!'
              : 'No tienes lecciones asignadas por ahora.'
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
              lessons={courseLessons}
              open={openGroups.has(courseId)}
              onToggle={() => toggleGroup(courseId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

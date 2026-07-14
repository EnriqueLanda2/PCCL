/* ───────────────────────────────────────────
   CourseContentView — detalle de un curso embebido
   en el catálogo (sin navegar de página).
   Header con tabs por tipo de contenido
   (Material, Clases en video, Clases por PDF, etc.)
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { Course, Lesson } from '@/lib/types';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { courseLevel, getVariant } from '@/types/status';
import { contentTypeMeta, formatDuration } from '@/lib/lessonContentTypes';
import { CreateLessonModal } from '@/app/components/shared/CreateLessonModal';
import { useLessonFileViewer } from '@/app/components/shared/LessonFileViewer';
import { APP_ICONS } from '@/lib/icons';

interface CourseContentViewProps {
  course: Course;
  onBack: () => void;
}

export function CourseContentView({ course, onBack }: CourseContentViewProps) {
  const [lessons, setLessons] = useState<Lesson[]>(course.lessons ?? []);
  const [canManage, setCanManage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const duration = formatDuration(course.durationMinutes);

  useEffect(() => {
    let alive = true;
    api.access().then((access) => {
      if (alive) setCanManage(access.permissions.includes('lessons:create'));
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const openCreate = () => { setEditingLesson(null); setModalOpen(true); };
  const openEdit = (lesson: Lesson) => { setEditingLesson(lesson); setModalOpen(true); };

  const handleSaved = (saved: Lesson) => {
    setLessons((prev) => {
      const exists = prev.some((l) => l.id === saved.id);
      return exists ? prev.map((l) => (l.id === saved.id ? saved : l)) : [...prev, saved];
    });
  };

  const tabs = useMemo(() => {
    const present = Array.from(new Set(lessons.map((l) => l.contentType)));
    return present
      .map((type) => ({
        type,
        ...contentTypeMeta(type),
        count: lessons.filter((l) => l.contentType === type).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [lessons]);

  const [activeTab, setActiveTab] = useState<string>('all');
  const filteredLessons = activeTab === 'all' ? lessons : lessons.filter((l) => l.contentType === activeTab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Back ── */}
      <button
        type="button"
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--blue-600)', fontSize: '13.5px', fontWeight: 500,
          fontFamily: 'var(--font-sans)', padding: '4px 0',
        }}
      >
        ← Volver al catálogo
      </button>

      {/* ── Course header ── */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          minHeight: '180px',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '24px',
          color: '#fff',
          background: course.coverImageUrl
            ? `linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.15)), url(${course.coverImageUrl}) center/cover no-repeat`
            : 'linear-gradient(135deg, var(--blue-700), var(--blue-500))',
        }}
      >
        <span style={{
          alignSelf: 'flex-start', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
          fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em',
          padding: '4px 12px', borderRadius: '999px', marginBottom: '10px',
        }}>
          {course.category ?? course.level}
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3vw, 34px)', lineHeight: 1.15, marginBottom: '8px' }}>
          {course.title}
        </h1>
        <p style={{ fontSize: '14px', maxWidth: '640px', opacity: 0.92, lineHeight: 1.5 }}>
          {course.description}
        </p>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '14px', fontSize: '13px' }}>
          {duration && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon icon={APP_ICONS.clock} width={14} height={14} /> {duration}
            </span>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Icon icon={APP_ICONS.book} width={14} height={14} /> {lessons.length} lecciones
          </span>
          {course.instructorName && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon icon={APP_ICONS.user} width={14} height={14} /> {course.instructorName}
            </span>
          )}
        </div>
      </div>

      {/* ── Level + status ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Badge variant={getVariant(courseLevel, course.level)}>{course.level}</Badge>
        {course.status === 'draft' && <Badge variant="yellow">Borrador</Badge>}
      </div>

      {/* ── Header con tabs por tipo de contenido ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', borderBottom: '1.5px solid var(--neutral-200)', flexWrap: 'wrap', paddingBottom: '2px' }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <TabButton label={`Todo el contenido (${lessons.length})`} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          {tabs.map((t) => (
            <TabButton
              key={t.type}
              icon={t.icon}
              label={`${t.label} (${t.count})`}
              active={activeTab === t.type}
              onClick={() => setActiveTab(t.type)}
            />
          ))}
        </div>
        {canManage && (
          <Button type="button" variant="secondary" size="sm" onClick={openCreate} className="mb-1.5 flex-shrink-0">
            + Agregar lección
          </Button>
        )}
      </div>

      {/* ── Lesson list ── */}
      {filteredLessons.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)', fontSize: '14px', padding: '24px 0' }}>
          Este curso aún no tiene contenido de este tipo.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredLessons.map((lesson, i) => (
            <LessonRow key={lesson.id} lesson={lesson} index={i} canManage={canManage} onEdit={openEdit} />
          ))}
        </div>
      )}

      <CreateLessonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        courseId={course.id}
        lesson={editingLesson}
        onSaved={handleSaved}
      />
    </div>
  );
}

function LessonRow({ lesson, index, canManage, onEdit }: {
  lesson: Lesson;
  index: number;
  canManage: boolean;
  onEdit: (lesson: Lesson) => void;
}) {
  const meta = contentTypeMeta(lesson.contentType);
  const { controls, content } = useLessonFileViewer(lesson);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '14px 16px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--neutral-100)', background: 'var(--panel)',
        }}
      >
        <span style={{
          flexShrink: 0, width: '32px', height: '32px', borderRadius: '999px',
          background: 'var(--blue-50)', color: 'var(--blue-600)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600,
        }}>
          {index + 1}
        </span>
        <Icon icon={meta.icon} width={18} height={18} style={{ flexShrink: 0, color: 'var(--ink-muted)' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--ink)' }}>{lesson.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{meta.label}</div>
        </div>
        {controls}
        {lesson.durationMinutes ? (
          <span style={{ fontSize: '12.5px', color: 'var(--ink-muted)', flexShrink: 0 }}>
            {formatDuration(lesson.durationMinutes)}
          </span>
        ) : null}
        {canManage && (
          <button
            type="button"
            onClick={() => onEdit(lesson)}
            aria-label={`Editar ${lesson.title}`}
            style={{
              flexShrink: 0, width: '28px', height: '28px', borderRadius: '8px',
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
      {content}
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        fontSize: '13.5px',
        fontWeight: active ? 600 : 400,
        color: active ? 'var(--blue-600)' : 'var(--ink-muted)',
        padding: '10px 14px',
        borderBottom: active ? '2.5px solid var(--blue-600)' : '2.5px solid transparent',
        marginBottom: '-2px',
        whiteSpace: 'nowrap',
      }}
    >
      {icon && <Icon icon={icon} width={14} height={14} />}
      {label}
    </button>
  );
}

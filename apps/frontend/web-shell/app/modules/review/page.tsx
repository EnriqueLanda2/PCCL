/* ───────────────────────────────────────────
   Revisión de cursos — cola del revisor (y admin).

   Reusa GET /courses tal cual: con resolveScope()
   dando {kind:'all'} a 'revisor' (ver data-scope.ts),
   ya trae TODOS los cursos de TODOS los instructores
   con su temario completo incluido — no hace falta un
   endpoint dedicado a "pendientes".

   El temario aquí muestra contenido completo (no la
   versión pública recortada de CoursePreviewModal):
   quien revisa es staff autenticado evaluando calidad,
   no un visitante decidiendo si inscribirse.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api, getErrorMessage } from '@/lib/api';
import type { Course } from '@/lib/types';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { Modal } from '@/app/components/ui/Modal';
import { contentTypeMeta, formatDuration } from '@/lib/lessonContentTypes';
import { APP_ICONS } from '@/lib/icons';

const LEVEL_LABEL: Record<string, string> = { basic: 'Básico', intermediate: 'Intermedio', advanced: 'Avanzado' };

function PendingRow({ course, onOpen }: Readonly<{ course: Course; onOpen: () => void }>) {
  const lessonCount = course.lessons?.length ?? 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-4 rounded-2xl border border-[var(--neutral-100)] bg-white p-4 text-left transition-shadow hover:shadow-[0_10px_28px_rgba(23,50,77,0.08)]"
    >
      <div
        className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--neutral-100)] bg-cover bg-center"
        style={course.coverImageUrl ? { backgroundImage: `url(${course.coverImageUrl})` } : undefined}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.9375rem] font-bold text-[var(--ink)]">{course.title}</p>
        <p className="mt-0.5 truncate text-[0.8125rem] text-[var(--ink-muted)]">
          {course.createdBy ?? 'instructor desconocido'} · {lessonCount} {lessonCount === 1 ? 'lección' : 'lecciones'}
        </p>
      </div>
      <Badge variant="blue">{LEVEL_LABEL[course.level] ?? course.level}</Badge>
      <Icon icon={APP_ICONS.chevronDown} width={18} height={18} className="flex-shrink-0 -rotate-90 text-[var(--ink-muted)]" />
    </button>
  );
}

function ReviewModal({
  course, busy, onClose, onDecide,
}: Readonly<{
  course: Course;
  busy: boolean;
  onClose: () => void;
  onDecide: (decision: 'approved' | 'rejected', note: string) => void;
}>) {
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState<string | null>(null);
  const lessons = course.lessons ?? [];

  const confirmReject = () => {
    if (!note.trim()) {
      setNoteError('Escribe qué debe corregir el instructor — sin esto no puede saber por qué se rechazó.');
      return;
    }
    onDecide('rejected', note.trim());
  };

  return (
    <Modal open onClose={onClose} title={course.title} description={course.createdBy ?? undefined}>
      <div className="flex flex-col gap-5">
        {course.coverImageUrl && (
          <div className="h-40 w-full overflow-hidden rounded-2xl bg-[var(--neutral-100)] bg-cover bg-center" style={{ backgroundImage: `url(${course.coverImageUrl})` }} />
        )}

        <div className="flex flex-wrap gap-2">
          <Badge variant="blue">{LEVEL_LABEL[course.level] ?? course.level}</Badge>
          {course.durationMinutes ? <Badge variant="teal">{formatDuration(course.durationMinutes)}</Badge> : null}
        </div>

        <div>
          <h3 className="mb-1.5 text-[0.8125rem] font-bold text-[var(--ink)]">Descripción</h3>
          <p className="text-[0.9063rem] leading-relaxed text-[var(--ink-soft)]">
            {course.description || 'Sin descripción.'}
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-[0.8125rem] font-bold text-[var(--ink)]">
            Temario · {lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'}
          </h3>
          {lessons.length === 0 ? (
            <p className="text-[0.8125rem] text-[var(--ink-muted)]">Este curso todavía no tiene lecciones cargadas.</p>
          ) : (
            <ol className="flex max-h-60 flex-col gap-1.5 overflow-y-auto pr-1">
              {lessons.map((lesson, i) => {
                const meta = contentTypeMeta(lesson.contentType);
                const dur = formatDuration(lesson.durationMinutes);
                return (
                  <li key={lesson.id} className="flex items-center gap-3 rounded-xl bg-[var(--neutral-50,#F7F9F6)] px-3 py-2">
                    <span className="w-5 flex-shrink-0 text-right text-[0.75rem] font-bold text-[var(--neutral-300)]">{i + 1}</span>
                    <Icon icon={meta.icon} width={17} height={17} className="flex-shrink-0 text-[var(--blue-600)]" />
                    <span className="min-w-0 flex-1 truncate text-[0.8438rem] font-semibold text-[var(--ink)]">{lesson.title}</span>
                    {dur && <span className="flex-shrink-0 text-[0.75rem] text-[var(--ink-muted)]">{dur}</span>}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {course.moderationNote && (
          <div className="rounded-xl bg-[#FFF4D8] px-3.5 py-2.5 text-[0.8125rem] text-[#8A6200]">
            <strong>Motivo del último rechazo:</strong> {course.moderationNote}
          </div>
        )}

        {rejecting ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="reject-note" className="text-[0.8125rem] font-bold text-[var(--ink)]">
              Motivo del rechazo
            </label>
            <textarea
              id="reject-note"
              value={note}
              onChange={(e) => { setNote(e.target.value); setNoteError(null); }}
              rows={3}
              placeholder="Ej. la lección 3 no tiene contenido, falta un examen, la portada está rota…"
              className="w-full rounded-xl border border-[var(--neutral-100)] bg-white p-3 text-[0.875rem] text-[var(--ink)] outline-none focus:border-[var(--red-400,#E08A72)]"
            />
            {noteError && <p className="text-[0.75rem] text-[var(--red-600)]">{noteError}</p>}
            <div className="mt-1 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setRejecting(false); setNote(''); setNoteError(null); }}
                disabled={busy}
                className="rounded-full px-4 py-2 text-[0.8125rem] font-bold text-[var(--ink-muted)] hover:bg-[var(--neutral-100)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmReject}
                disabled={busy}
                className="rounded-full bg-[var(--red-600)] px-5 py-2 text-[0.8125rem] font-bold text-white disabled:opacity-60"
              >
                {busy ? 'Rechazando…' : 'Confirmar rechazo'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setRejecting(true)}
              disabled={busy}
              className="rounded-2xl border border-[var(--red-line,#F0B79F)] px-5 py-2.5 text-[0.875rem] font-bold text-[var(--red-600)] hover:bg-[#FFF1ED] disabled:opacity-60"
            >
              Rechazar
            </button>
            <button
              type="button"
              onClick={() => onDecide('approved', note.trim())}
              disabled={busy}
              className="rounded-2xl bg-[var(--green-600)] px-5 py-2.5 text-[0.875rem] font-bold text-white hover:bg-[var(--green-700)] disabled:opacity-60"
            >
              {busy ? 'Aprobando…' : 'Aprobar y publicar'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function ReviewPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    api.courses()
      .then(setCourses)
      .catch((err) => setError(getErrorMessage(err)));
  };

  useEffect(load, []);

  const pending = useMemo(
    () => (courses ?? []).filter((c) => c.status === 'pending_review'),
    [courses],
  );
  const openCourse = pending.find((c) => c.id === openId) ?? null;

  const decide = async (decision: 'approved' | 'rejected', note: string) => {
    if (!openId) return;
    setBusy(true);
    setError(null);
    try {
      await api.moderateCourse(openId, decision, note || undefined);
      setOpenId(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader
        title="Revisión de cursos"
        subtitle={
          courses === null
            ? 'Cargando cola de revisión…'
            : `${pending.length} ${pending.length === 1 ? 'curso espera' : 'cursos esperan'} aprobación`
        }
      />

      {error && (
        <div className="rounded-xl border-l-4 border-[var(--red-500)] bg-[#FFF1ED] px-4 py-3 text-[0.8125rem] text-[var(--red-600)]">
          {error}
        </div>
      )}

      {courses === null ? (
        <div className="flex justify-center py-16"><WaveSpinner size="md" label="Cargando…" /></div>
      ) : pending.length === 0 ? (
        <Card className="p-2">
          <EmptyState
            icon={APP_ICONS.check}
            title="Sin pendientes"
            description="No hay ningún curso esperando revisión en este momento."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map((course) => (
            <PendingRow key={course.id} course={course} onOpen={() => setOpenId(course.id)} />
          ))}
        </div>
      )}

      {openCourse && (
        <ReviewModal
          course={openCourse}
          busy={busy}
          onClose={() => setOpenId(null)}
          onDecide={decide}
        />
      )}
    </div>
  );
}

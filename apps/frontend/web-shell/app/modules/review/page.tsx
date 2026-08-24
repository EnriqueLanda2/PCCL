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
import type { Course, Evaluation, Lesson } from '@/lib/types';
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

function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3010';
}

function absoluteMediaUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBaseUrl()}${url.startsWith('/') ? '' : '/'}${url}`;
}

/** Contenido completo de una lección, según su tipo — es lo que el revisor
    necesita ver para evaluar calidad real, no solo el título de la lista. */
function LessonContent({ lesson }: Readonly<{ lesson: Lesson }>) {
  if (lesson.contentType === 'video' && lesson.fileUrl) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        controls
        preload="metadata"
        src={absoluteMediaUrl(lesson.fileUrl)}
        style={{ width: '100%', maxHeight: '20rem', borderRadius: 'var(--radius-md)', background: '#000' }}
      />
    );
  }
  if (lesson.contentType === 'file' && lesson.fileUrl) {
    return (
      <a
        href={absoluteMediaUrl(lesson.fileUrl)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--blue-50,#EAF2FF)] px-3.5 py-1.5 text-[0.8125rem] font-semibold text-[var(--blue-600)] hover:underline"
      >
        ↗ Abrir documento
      </a>
    );
  }
  if (lesson.contentType === 'link' && lesson.content) {
    return (
      <a href={lesson.content} target="_blank" rel="noreferrer" className="text-[0.8438rem] font-semibold text-[var(--blue-600)] hover:underline">
        {lesson.content}
      </a>
    );
  }
  if (!lesson.content) {
    return <p className="text-[0.8125rem] italic text-[var(--ink-muted)]">Esta lección no tiene contenido cargado todavía.</p>;
  }
  return (
    <p className="whitespace-pre-wrap text-[0.8438rem] leading-relaxed text-[var(--ink-soft)]">{lesson.content}</p>
  );
}

/** Fila de temario de solo lectura — mismo look que el temario del estudio
    del instructor, pero sin "Editar"/"Entregas": el revisor solo expande
    para leer, nunca modifica. */
function ReviewLessonRow({
  lesson, isLast, isOpen, onToggle,
}: Readonly<{ lesson: Lesson; isLast: boolean; isOpen: boolean; onToggle: () => void }>) {
  const meta = contentTypeMeta(lesson.contentType);
  const duration = formatDuration(lesson.durationMinutes);
  return (
    <div style={{ borderBottom: isLast && !isOpen ? 'none' : '1px solid var(--neutral-100)' }}>
      <button type="button" onClick={onToggle} className="flex w-full flex-wrap items-center gap-3 py-3 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--blue-50)] text-[var(--blue-700)]">
          <Icon icon={meta.icon} width={17} height={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.875rem] font-bold text-[var(--ink)]">{lesson.title}</p>
          <p className="text-[0.75rem] text-[var(--ink-muted)]">{meta.label}{duration ? ` · ${duration}` : ''}</p>
        </div>
        <Icon
          icon={APP_ICONS.chevronDown}
          width={17}
          height={17}
          className={`flex-shrink-0 text-[var(--ink-muted)] transition-transform ${isOpen ? '' : '-rotate-90'}`}
        />
      </button>
      {isOpen && (
        <div className="flex flex-col gap-2 pb-4 pl-12 pr-2">
          <LessonContent lesson={lesson} />
        </div>
      )}
    </div>
  );
}

/** Examen completo (Kahoot): todas las preguntas, sus opciones y cuál es la
    correcta — el revisor necesita verlo entero, no solo que "hay un examen". */
function EvaluationContent({ evaluation }: Readonly<{ evaluation: Evaluation }>) {
  const questions = evaluation.questions ?? [];
  if (questions.length === 0) {
    return <p className="text-[0.8125rem] italic text-[var(--ink-muted)]">Este examen todavía no tiene preguntas cargadas.</p>;
  }
  return (
    <ol className="flex flex-col gap-3">
      {questions.map((q, qi) => (
        <li key={`${evaluation.id}-${qi}`} className="rounded-xl bg-[var(--neutral-50,#F7F9F6)] p-3">
          <p className="mb-1.5 text-[0.8438rem] font-semibold text-[var(--ink)]">{qi + 1}. {q.prompt}</p>
          <ul className="flex flex-col gap-1">
            {q.options.map((opt, oi) => (
              <li
                key={oi}
                className={`rounded-lg px-2.5 py-1 text-[0.8125rem] ${
                  oi === q.correctIndex ? 'bg-[var(--green-50)] font-semibold text-[var(--green-700)]' : 'text-[var(--ink-soft)]'
                }`}
              >
                {oi === q.correctIndex ? '✓ ' : ''}{opt}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const lessons = course.lessons ?? [];

  useEffect(() => {
    let alive = true;
    api.evaluations(course.id).then((list) => { if (alive) setEvaluations(list); }).catch(() => {});
    return () => { alive = false; };
  }, [course.id]);

  /* Mismo temario unificado que ve el instructor: lecciones + exámenes en
     orden de creación, para que el revisor apruebe TODO el contenido, no
     solo las lecciones. */
  type TemarioRow =
    | { kind: 'lesson'; id: string; createdAt: string; lesson: Lesson }
    | { kind: 'evaluation'; id: string; createdAt: string; evaluation: Evaluation };
  const temarioRows = useMemo<TemarioRow[]>(() => {
    const rows: TemarioRow[] = [
      ...lessons.map((lesson) => ({ kind: 'lesson' as const, id: lesson.id, createdAt: lesson.createdAt ?? '', lesson })),
      ...evaluations.map((evaluation) => ({ kind: 'evaluation' as const, id: evaluation.id, createdAt: (evaluation as { createdAt?: string }).createdAt ?? '', evaluation })),
    ];
    return rows.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  }, [lessons, evaluations]);

  const totalMinutes = lessons.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0);
  const temarioSummary = [
    `${lessons.length} ${lessons.length === 1 ? 'lección' : 'lecciones'}`,
    evaluations.length > 0 ? `${evaluations.length} ${evaluations.length === 1 ? 'examen' : 'exámenes'}` : null,
    totalMinutes ? formatDuration(totalMinutes) : null,
  ].filter(Boolean).join(' · ');

  const confirmReject = () => {
    if (!note.trim()) {
      setNoteError('Escribe qué debe corregir el instructor — sin esto no puede saber por qué se rechazó.');
      return;
    }
    onDecide('rejected', note.trim());
  };

  return (
    <Modal open onClose={onClose} title={course.title} description={course.createdBy ?? undefined} className="max-w-4xl">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* ── Columna principal: lo mismo que ve el instructor, sin poder tocarlo ── */}
        <div className="flex min-w-0 flex-col gap-5">
          <section className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_12px_28px_rgba(23,50,77,0.06)]">
            {course.coverImageUrl && (
              <div
                className="mb-4 h-40 w-full overflow-hidden rounded-2xl bg-[var(--neutral-100)] bg-cover bg-center"
                style={{ backgroundImage: `url(${course.coverImageUrl})` }}
              />
            )}
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="blue">{LEVEL_LABEL[course.level] ?? course.level}</Badge>
              <Badge variant="teal">{course.isFree || !course.price ? 'Gratuito' : `USD $${Number(course.price).toFixed(2)}`}</Badge>
            </div>
            <h3 className="mb-1.5 text-[0.8125rem] font-bold text-[var(--ink)]">Descripción</h3>
            <p className="text-[0.9063rem] leading-relaxed text-[var(--ink-soft)]">
              {course.description || 'Sin descripción.'}
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_12px_28px_rgba(23,50,77,0.06)]">
            <h3 className="mb-0.5 text-[1.05rem] font-extrabold text-[var(--ink)]">Temario</h3>
            <p className="mb-2 text-[0.8125rem] text-[var(--ink-muted)]">{temarioSummary || 'Sin contenido'}</p>
            {temarioRows.length === 0 ? (
              <p className="rounded-2xl bg-[var(--blue-50)] px-4 py-5 text-center text-[0.875rem] text-[var(--ink-soft)]">
                Este curso todavía no tiene lecciones ni exámenes cargados.
              </p>
            ) : (
              <div className="flex max-h-96 flex-col overflow-y-auto pr-1">
                {temarioRows.map((row, i) => {
                  const isOpen = expandedId === row.id;
                  const isLast = i === temarioRows.length - 1;
                  if (row.kind === 'evaluation') {
                    const questionCount = row.evaluation.questions?.length ?? 0;
                    return (
                      <div key={row.id} style={{ borderBottom: isLast && !isOpen ? 'none' : '1px solid var(--neutral-100)' }}>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isOpen ? null : row.id)}
                          className="flex w-full flex-wrap items-center gap-3 py-3 text-left"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] text-[#92400E]">
                            <Icon icon={APP_ICONS.quiz} width={17} height={17} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[0.875rem] font-bold text-[var(--ink)]">{row.evaluation.title}</p>
                            <p className="text-[0.75rem] text-[var(--ink-muted)]">
                              Examen · {questionCount} pregunta{questionCount === 1 ? '' : 's'} · aprueba con {row.evaluation.passingScore}%
                            </p>
                          </div>
                          <Icon
                            icon={APP_ICONS.chevronDown}
                            width={17}
                            height={17}
                            className={`flex-shrink-0 text-[var(--ink-muted)] transition-transform ${isOpen ? '' : '-rotate-90'}`}
                          />
                        </button>
                        {isOpen && (
                          <div className="pb-4 pl-12 pr-2">
                            <EvaluationContent evaluation={row.evaluation} />
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <ReviewLessonRow
                      key={row.id}
                      lesson={row.lesson}
                      isLast={isLast}
                      isOpen={isOpen}
                      onToggle={() => setExpandedId(isOpen ? null : row.id)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ── Columna de acciones: aprobar / rechazar ── */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-0 lg:self-start">
          <section className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_12px_28px_rgba(23,50,77,0.06)]">
            <h3 className="mb-1 text-[1rem] font-extrabold text-[var(--ink)]">Decisión</h3>
            <p className="mb-4 text-[0.8125rem] leading-5 text-[var(--ink-muted)]">
              Apruébalo para publicarlo de inmediato, o recházalo indicando qué debe corregir el instructor.
            </p>

            {course.moderationNote && (
              <div className="mb-4 rounded-xl bg-[#FFF4D8] px-3.5 py-2.5 text-[0.8125rem] text-[#8A6200]">
                <strong>Motivo del rechazo anterior:</strong> {course.moderationNote}
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
                  rows={4}
                  placeholder="Ej. la lección 3 no tiene contenido, falta un examen, la portada está rota…"
                  className="w-full rounded-xl border border-[var(--neutral-100)] bg-white p-3 text-[0.875rem] text-[var(--ink)] outline-none focus:border-[var(--red-400,#E08A72)]"
                />
                {noteError && <p className="text-[0.75rem] text-[var(--red-600)]">{noteError}</p>}
                <div className="mt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={confirmReject}
                    disabled={busy}
                    className="rounded-full bg-[var(--red-600)] px-5 py-2 text-[0.8125rem] font-bold text-white disabled:opacity-60"
                  >
                    {busy ? 'Rechazando…' : 'Confirmar rechazo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRejecting(false); setNote(''); setNoteError(null); }}
                    disabled={busy}
                    className="rounded-full px-4 py-2 text-[0.8125rem] font-bold text-[var(--ink-muted)] hover:bg-[var(--neutral-100)]"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => onDecide('approved', note.trim())}
                  disabled={busy}
                  className="rounded-2xl bg-[var(--green-600)] px-5 py-2.5 text-[0.875rem] font-bold text-white hover:bg-[var(--green-700)] disabled:opacity-60"
                >
                  {busy ? 'Aprobando…' : 'Aprobar y publicar'}
                </button>
                <button
                  type="button"
                  onClick={() => setRejecting(true)}
                  disabled={busy}
                  className="rounded-2xl border border-[var(--red-line,#F0B79F)] px-5 py-2.5 text-[0.875rem] font-bold text-[var(--red-600)] hover:bg-[#FFF1ED] disabled:opacity-60"
                >
                  Rechazar
                </button>
              </div>
            )}
          </section>
        </aside>
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

/* ───────────────────────────────────────────
   Live Sessions Page — Clases en vivo
   Lista de sesiones programadas/en curso ·
   Formulario simple de alta
   ─────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import { api, getErrorMessage } from '@/lib/api';
import type { Course, Lesson, LiveSession, Phase } from '@/lib/types';
import { currentPhaseOrder } from '@/lib/coursePhase';
import { Card } from '@/app/components/ui/Card';
import { Badge, statusToBadgeVariant } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { AppSelect } from '@/app/components/ui/AppControls';
import { Field, Input } from '@/app/components/ui/Input';
import { Modal } from '@/app/components/ui/Modal';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { Reveal } from '@/app/components/shared/Reveal';
import { LiveClassRoom } from '@/app/components/shared/LiveClassRoom';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { PhaseSelect } from '@/app/components/shared/PhaseSelect';
import { useUser } from '@/hooks/useUser';
import { APP_ICONS } from '@/lib/icons';

/** Estados de sesión desde los que todavía se puede entrar a la sala */
const JOINABLE_STATUSES = new Set(['live', 'scheduled']);

const STATUS_LABEL: Record<string, string> = {
  scheduled: 'Programada',
  live: 'En vivo',
  ended: 'Finalizada',
  canceled: 'Cancelada',
};

function formatScheduledAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function LiveSessionsPage() {
  const [sessions,   setSessions]   = useState<LiveSession[]>([]);
  const [courses,    setCourses]    = useState<Course[]>([]);
  const [lessons,    setLessons]    = useState<Lesson[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const [error,      setError]      = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  /** Sesión que el alumno quiso abrir pero pertenece a una fase posterior a
      la suya — se le pide confirmar antes de entrar igual. */
  const [aheadSession, setAheadSession] = useState<LiveSession | null>(null);
  const [phases,     setPhases]     = useState<Phase[]>([]);

  const { user, access, refetch } = useUser();
  useEffect(() => { refetch(); }, [refetch]);
  const canManageLiveSessions = access?.roles.some((r) => r === 'instructor' || r === 'profesor' || r === 'admin') ?? false;
  const displayName = user?.fullName ?? user?.email?.split('@')[0] ?? 'Invitado';
  const currentHostName = user?.fullName ?? user?.email ?? '';

  /* ── Form state ── */
  /* Sin campo de enlace: la sala de Jitsi se genera sola a partir del id
     de la sesión (ver `roomName` al abrir el Modal) — nada que capturar aquí. */
  const [title,           setTitle]           = useState('');
  const [scheduledAt,     setScheduledAt]     = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [courseId,        setCourseId]        = useState('');
  const [phaseId,         setPhaseId]         = useState('');

  const loadAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.liveSessions(),
      api.courses().catch(() => []),
      api.lessons().catch(() => []),
    ])
      .then(([sessionList, courseList, lessonList]) => {
        setSessions(sessionList);
        setCourses(courseList);
        setLessons(lessonList);
      })
      .catch(() => { setSessions([]); setCourses([]); setLessons([]); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadAll, 0);
    return () => window.clearTimeout(timer);
  }, [loadAll]);

  /* Fases del curso elegido en el formulario — se recargan cada vez que el
     profesor cambia de curso; sin curso, no hay fases que pedir. */
  useEffect(() => {
    setPhaseId('');
    if (!courseId) { setPhases([]); return; }
    let alive = true;
    api.coursePhases(courseId).then((list) => { if (alive) setPhases(list); }).catch(() => { if (alive) setPhases([]); });
    return () => { alive = false; };
  }, [courseId]);

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [sessions],
  );

  /* Fase en la que va el alumno en cada curso — para avisarle si la clase
     que quiere abrir corresponde a una fase más adelante en el camino. */
  const currentPhaseOrderByCourse = useMemo(() => {
    const map = new Map<string, number>();
    for (const course of courses) {
      map.set(course.id, currentPhaseOrder(course.phases, lessons.filter((l) => l.courseId === course.id)));
    }
    return map;
  }, [courses, lessons]);

  const isSessionAhead = (session: LiveSession) => {
    if (!session.courseId || !session.phase) return false;
    const myOrder = currentPhaseOrderByCourse.get(session.courseId) ?? Infinity;
    return session.phase.order > myOrder;
  };

  const openSession = (session: LiveSession) => {
    if (!canManageLiveSessions && isSessionAhead(session)) {
      setAheadSession(session);
      return;
    }
    setActiveSession(session);
  };

  const resetForm = () => {
    setTitle(''); setScheduledAt('');
    setDurationMinutes('60'); setCourseId(''); setPhaseId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!title.trim() || !scheduledAt) {
      setError('Título y fecha/hora son obligatorios.');
      return;
    }
    if (courseId && !phaseId) {
      setError('Selecciona la fase del curso a la que pertenece esta clase.');
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setError(null);
    try {
      await api.createLiveSession({
        title: title.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
        courseId: courseId || undefined,
        phaseId: courseId ? phaseId : undefined,
      });
      resetForm();
      loadAll();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Page header ── */}
      <PageHeader
        title={<>Clases en vivo</>}
        subtitle={loading
          ? 'Cargando…'
          : canManageLiveSessions
            ? `${sessions.length} sesión${sessions.length !== 1 ? 'es' : ''} registradas`
            : `${sessions.length} clase${sessions.length !== 1 ? 's' : ''} disponible${sessions.length !== 1 ? 's' : ''} de tus cursos`}
      />

      <div style={{ display: 'grid', gridTemplateColumns: canManageLiveSessions ? 'repeat(auto-fit, minmax(min(100%, 21rem), 1fr))' : 'minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* ── Sessions list ── */}
        <div>
          {loading ? (
            <div className="flex justify-center py-16">
              <WaveSpinner size="lg" label="Cargando clases en vivo…" />
            </div>
          ) : sortedSessions.length === 0 ? (
            <EmptyState
              icon={APP_ICONS.live}
              title="Sin clases en vivo"
              description={canManageLiveSessions
                ? 'Aún no hay sesiones registradas. Crea la primera con el formulario.'
                : 'No hay clases en vivo programadas para los cursos en los que estás inscrito.'}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sortedSessions.map((session, i) => (
                <Reveal key={session.id} index={i}>
                  <Card padding="default">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', minWidth: 0 }}>
                        {/* Mini ventana "en vivo" — solo aparece mientras la sesión está en curso;
                            no hay nada que grabar ni guardar, así que en cualquier otro estado
                            desaparece sola y cede el lugar al ícono normal. */}
                        {session.status === 'live' ? (
                          <div style={{ width: '3.375rem', height: '2.375rem', borderRadius: '0.625rem', background: 'linear-gradient(135deg, #0E1A26, #17324D)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                            <Icon icon={APP_ICONS.live} width={16} height={16} style={{ color: 'rgba(255,255,255,0.85)' }} />
                            <span className="live-dot" style={{ position: 'absolute', top: '0.3125rem', right: '0.375rem', width: '0.375rem', height: '0.375rem', background: 'var(--red-500)', borderRadius: '50%' }} />
                          </div>
                        ) : (
                          <div style={{ width: '2.375rem', height: '2.375rem', borderRadius: '0.6875rem', background: 'linear-gradient(135deg, var(--green-700), var(--green-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                            <Icon icon={APP_ICONS.live} width={18} height={18} />
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)' }}>{session.title}</div>
                          <div style={{ fontSize: '0.7813rem', color: 'var(--ink-muted)' }}>
                            {session.hostName}
                            {session.course?.title && <> · {session.course.title}</>}
                            {session.phase && <> · Fase {session.phase.order}: {session.phase.title}</>}
                            {' · '}{formatScheduledAt(session.scheduledAt)}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                        <Badge variant={statusToBadgeVariant(session.status)}>
                          {STATUS_LABEL[session.status] ?? session.status}
                        </Badge>
                        {JOINABLE_STATUSES.has(session.status) && (
                          <Button variant="primary" size="sm" onClick={() => openSession(session)}>
                            {session.status === 'live' ? 'Unirse' : 'Entrar temprano'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {/* ── Create form ── */}
        {canManageLiveSessions && (
        <Card padding="default" style={{ position: 'sticky', top: '5rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', marginBottom: '1rem', color: 'var(--ink)' }}>
            Programar clase
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Título">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Taller de visualización de datos" disabled={submitting} />
            </Field>

            <Field label="Anfitrión">
              <Input
                value={currentHostName}
                placeholder="Profesor creador"
                disabled
              />
              <p className="mt-1 text-[0.75rem] text-[var(--ink-muted)]">
                El anfitrión y administrador de la sala será quien crea esta clase.
              </p>
            </Field>

            <Field label="Fecha y hora">
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                disabled={submitting}
              />
            </Field>

            <Field label="Duración (minutos)">
              <Input
                type="number"
                min={1}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                disabled={submitting}
              />
            </Field>

            <Field label="Curso (opcional)">
              <AppSelect
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={submitting}
              >
                <MenuItem value="">Sin curso asociado</MenuItem>
                {courses.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                ))}
              </AppSelect>
            </Field>

            {courseId && (
              <PhaseSelect
                courseId={courseId}
                phases={phases}
                value={phaseId}
                onChange={setPhaseId}
                onPhasesChange={setPhases}
                disabled={submitting}
                required
              />
            )}

            <p className="flex items-center gap-1.5 text-[0.75rem] text-[var(--ink-muted)]">
              <Icon icon={APP_ICONS.lock} width={13} height={13} />
              La sala de videollamada se genera automáticamente — sin enlaces que copiar.
            </p>

            <div className="flex items-start gap-2 rounded-2xl border border-[var(--yellow-200,#F5DFA0)] bg-[var(--yellow-50,#FFF9EC)] px-3.5 py-3">
              <Icon icon={APP_ICONS.warning} width={17} height={17} className="mt-0.5 shrink-0 text-[var(--yellow-600,#B98900)]" />
              <p className="text-[0.8125rem] leading-5 text-[var(--ink-soft)]">
                <strong className="text-[var(--ink)]">Importante:</strong> si no entrás a la sala a la hora exacta programada,
                la clase se cancela automáticamente a los <strong>15 minutos</strong> y se les avisa a los inscritos
                que se va a reagendar.
              </p>
            </div>

            {error && (
              <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
            )}

            <Button type="submit" variant="primary" loading={submitting} block>
              + Programar clase
            </Button>
          </form>
        </Card>
        )}
      </div>

      {/* ── Sala en vivo — efímera, sin grabación (ver LiveClassRoom) ── */}
      <Modal
        open={activeSession !== null}
        onClose={() => setActiveSession(null)}
        title={activeSession?.title ?? ''}
        description={activeSession ? `${activeSession.hostName} · ${formatScheduledAt(activeSession.scheduledAt)}` : undefined}
        /* Ancho para que el video conserve su 16:9 con el panel de chat al lado */
        className="max-w-6xl"
      >
        {activeSession && (
          <LiveClassRoom
            sessionId={activeSession.id}
            userName={displayName}
            onLeave={() => setActiveSession(null)}
          />
        )}
      </Modal>

      {/* ── Aviso de fase adelantada ── */}
      <Modal
        open={aheadSession !== null}
        onClose={() => setAheadSession(null)}
        title="Esta clase es de una fase más adelante"
      >
        {aheadSession && (
          <div className="flex flex-col gap-4">
            <p className="text-[0.9375rem] leading-6 text-[var(--ink-soft)]">
              <strong className="text-[var(--ink)]">{aheadSession.title}</strong> pertenece a{' '}
              <strong className="text-[var(--ink)]">Fase {aheadSession.phase?.order}: {aheadSession.phase?.title}</strong>,
              que está más adelante de donde vas en el curso. Podés seguir sin haber completado lo anterior,
              pero puede que algunos temas todavía no te resulten familiares.
            </p>
            <div className="flex justify-end gap-2.5">
              <Button variant="secondary" onClick={() => setAheadSession(null)}>Cancelar</Button>
              <Button
                variant="primary"
                onClick={() => { setActiveSession(aheadSession); setAheadSession(null); }}
              >
                Entrar de todas formas
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

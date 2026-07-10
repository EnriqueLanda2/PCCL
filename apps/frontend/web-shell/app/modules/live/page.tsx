/* ───────────────────────────────────────────
   Live Sessions Page — Clases en vivo
   Lista de sesiones programadas/en curso ·
   Formulario simple de alta
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api, getErrorMessage } from '@/lib/api';
import type { Course, LiveSession } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Badge, statusToBadgeVariant } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { Field, Input } from '@/app/components/ui/Input';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { Reveal } from '@/app/components/shared/Reveal';
import { APP_ICONS } from '@/lib/icons';

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
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  /* ── Form state ── */
  const [title,           setTitle]           = useState('');
  const [hostName,        setHostName]        = useState('');
  const [scheduledAt,     setScheduledAt]     = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [joinUrl,         setJoinUrl]         = useState('');
  const [courseId,        setCourseId]        = useState('');

  const loadAll = () => {
    setLoading(true);
    Promise.all([api.liveSessions(), api.courses().catch(() => [])])
      .then(([sessionList, courseList]) => {
        setSessions(sessionList);
        setCourses(courseList);
      })
      .catch(() => { setSessions([]); setCourses([]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [sessions],
  );

  const resetForm = () => {
    setTitle(''); setHostName(''); setScheduledAt('');
    setDurationMinutes('60'); setJoinUrl(''); setCourseId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hostName.trim() || !scheduledAt) {
      setError('Título, anfitrión y fecha/hora son obligatorios.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.createLiveSession({
        title: title.trim(),
        hostName: hostName.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
        joinUrl: joinUrl.trim() || undefined,
        courseId: courseId || undefined,
      });
      resetForm();
      loadAll();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Page header ── */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
          Clases en <em style={{ color: 'var(--blue-600)', fontStyle: 'italic' }}>vivo</em>
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
          {loading ? 'Cargando…' : `${sessions.length} sesión${sessions.length !== 1 ? 'es' : ''} registradas`}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
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
              description="Aún no hay sesiones registradas. Crea la primera con el formulario."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedSessions.map((session, i) => (
                <Reveal key={session.id} index={i}>
                  <Card padding="default">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: 0 }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'linear-gradient(135deg, var(--green-700), var(--green-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                          <Icon icon={APP_ICONS.live} width={18} height={18} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{session.title}</div>
                          <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)' }}>
                            {session.hostName}
                            {session.course?.title && <> · {session.course.title}</>}
                            {' · '}{formatScheduledAt(session.scheduledAt)}
                          </div>
                        </div>
                      </div>
                      <Badge variant={statusToBadgeVariant(session.status)}>
                        {STATUS_LABEL[session.status] ?? session.status}
                      </Badge>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {/* ── Create form ── */}
        <Card padding="default" style={{ position: 'sticky', top: '80px' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '16px', color: 'var(--ink)' }}>
            Programar clase
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Título">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Taller de visualización de datos" disabled={submitting} />
            </Field>

            <Field label="Anfitrión">
              <Input value={hostName} onChange={(e) => setHostName(e.target.value)} placeholder="Nombre del instructor" disabled={submitting} />
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
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                disabled={submitting}
                className="w-full h-11 px-4 rounded-2xl text-sm bg-[#F8FBF5] text-[var(--ink)] border border-[#DDE7D7] outline-none focus:border-[var(--green-500)] focus:ring-2 focus:ring-[#D2F2DE] disabled:cursor-not-allowed"
              >
                <option value="">Sin curso asociado</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </Field>

            <Field label="Enlace de la sesión (opcional)">
              <Input value={joinUrl} onChange={(e) => setJoinUrl(e.target.value)} placeholder="https://…" disabled={submitting} />
            </Field>

            {error && (
              <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[13px] text-[#BF2600]">{error}</p>
            )}

            <Button type="submit" variant="primary" loading={submitting} block>
              + Programar clase
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

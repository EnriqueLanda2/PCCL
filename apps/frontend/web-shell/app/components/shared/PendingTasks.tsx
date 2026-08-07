/* ───────────────────────────────────────────
   PendingTasks — lo que le falta al alumno.

   Se alimenta de GET /tasks/pending, que cruza las
   lecciones de sus cursos contra lesson_completions
   y las evaluaciones contra sus intentos. La lista
   se pinta con ToolCallsSection del registry.

   Se puede acotar a un curso (`courseId`) para la
   ficha del curso, u omitirlo para el perfil, donde
   se muestran las de todos sus cursos.
   ─────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { PendingTask } from '@/lib/types';
import { ToolCallsSection, type ToolCallEntry } from '@/registry/new-york/ui/tool-calls-section';
import { APP_ICONS } from '@/lib/icons';

interface PendingTasksProps {
  /** Acota a un curso; si se omite, trae las de todos los cursos del alumno */
  courseId?: string;
  title?: string;
  /** Mostrar la lista abierta de entrada */
  defaultExpanded?: boolean;
  className?: string;
}

/** Traduce una tarea al formato que espera ToolCallsSection. */
function toEntry(task: PendingTask): ToolCallEntry {
  const isLesson = task.kind === 'lesson';
  return {
    tool_name: task.title,
    tool_category: isLesson ? 'lesson' : 'evaluation',
    message: task.title,
    show_category: false,
    tool_call_id: task.id,
    inputs: {
      Curso: task.courseTitle,
      Tipo: isLesson ? 'Lección' : 'Evaluación',
      ...(task.durationMinutes ? { Duración: `${task.durationMinutes} min` } : {}),
    },
    output: task.done ? 'Completada' : undefined,
  };
}

export function PendingTasks({
  courseId,
  title = 'Tareas pendientes',
  defaultExpanded = false,
  className,
}: Readonly<PendingTasksProps>) {
  const [tasks,   setTasks]   = useState<PendingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed,  setFailed]  = useState(false);
  const [busy,    setBusy]    = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const closeTimer = useRef<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await api.pendingTasks(courseId);
      setTasks(res.tasks);
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);
  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  const pending = tasks.filter((t) => !t.done);
  const done    = tasks.length - pending.length;
  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setAnchorEl(null), 90);
  };

  /** Marca la siguiente lección pendiente — atajo para avanzar sin salir de aquí. */
  const completeNextLesson = async () => {
    const next = pending.find((t) => t.kind === 'lesson');
    if (!next) return;
    setBusy(true);
    try {
      await api.setLessonCompleted(next.id, true);
      await load();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const open = Boolean(anchorEl);
  const summary = loading
    ? 'Cargando tareas…'
    : failed
      ? 'Tareas no disponibles'
      : tasks.length === 0
        ? 'Sin tareas'
        : pending.length === 0
          ? `Todo al día · ${done}/${tasks.length}`
          : `${pending.length} pendiente${pending.length !== 1 ? 's' : ''} · ${done}/${tasks.length}`;

  return (
    <section className={`relative inline-flex ${className ?? ''}`}>
      <Button
        variant="outlined"
        onMouseEnter={(event) => { cancelClose(); setAnchorEl(event.currentTarget); }}
        onMouseLeave={closeSoon}
        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <Icon icon={APP_ICONS.clipboard} width={16} height={16} />}
        sx={{
          borderRadius: '999px',
          borderColor: 'var(--neutral-200)',
          bgcolor: 'rgba(255,255,255,0.78)',
          color: 'var(--ink-soft)',
          px: 1.8,
          py: 0.75,
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: '0 10px 24px rgba(23,50,77,0.08)',
          backdropFilter: 'blur(8px)',
          '&:hover': { bgcolor: 'var(--blue-50)', borderColor: 'var(--blue-300)' },
        }}
      >
        {summary}
      </Button>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ zIndex: 40 }}
        modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
      >
        <Paper
          onMouseEnter={cancelClose}
          onMouseLeave={closeSoon}
          sx={{
            width: { xs: 320, sm: 440 },
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 460,
            overflow: 'auto',
            borderRadius: '1.125rem',
            border: '1px solid var(--neutral-100)',
            bgcolor: 'rgba(255,255,255,0.96)',
            p: 2,
            boxShadow: '0 24px 60px rgba(23,50,77,0.18)',
          }}
        >
          {failed ? (
            <p className="rounded-xl border-l-4 border-[#C8901B] bg-[#FDF7E7] px-4 py-3 text-[0.8125rem] text-[#8A6212]">
              No se pudieron cargar tus tareas. Intenta de nuevo en unos momentos.
            </p>
          ) : tasks.length === 0 && !loading ? (
            <p className="text-[0.8125rem] text-[var(--ink-muted)]">No hay tareas registradas todavía.</p>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[0.9375rem] font-bold text-[var(--ink)]">{title}</h3>
          <p className="mt-0.5 text-[0.8125rem] text-[var(--ink-muted)]">
            {pending.length === 0
              ? `Todo al día · ${done} de ${tasks.length} completadas`
              : `${pending.length} pendiente${pending.length !== 1 ? 's' : ''} · ${done} de ${tasks.length} completadas`}
          </p>
        </div>
        {pending.some((t) => t.kind === 'lesson') && (
          <Button
            variant="outlined"
            size="small"
            disabled={busy}
            onClick={completeNextLesson}
            startIcon={busy ? <CircularProgress size={13} color="inherit" /> : undefined}
            sx={{
              borderRadius: '999px',
              borderColor: 'var(--neutral-200)',
              color: 'var(--ink-soft)',
              bgcolor: 'var(--panel)',
              fontFamily: 'var(--font-sans)',
              fontSize: 12.5,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--green-50)', borderColor: 'var(--green-300)' },
            }}
          >
            Marcar siguiente lección
          </Button>
        )}
      </div>

      <ToolCallsSection
        toolCalls={(pending.length > 0 ? pending : tasks).map(toEntry)}
        defaultExpanded={defaultExpanded}
      />
            </>
          )}
        </Paper>
      </Popper>
    </section>
  );
}

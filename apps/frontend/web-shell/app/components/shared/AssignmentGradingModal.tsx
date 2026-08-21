/* ───────────────────────────────────────────
   AssignmentGradingModal — entregas de una tarea, lado instructor
   ───────────────────────────────────────────
   Lista las entregas de una lección 'assignment' y permite calificarlas a
   mano: puntaje 0–100 + retroalimentación. El alumno ve el resultado en su
   panel de entrega dentro del camino del curso.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { api, getErrorMessage } from '@/lib/api';
import type { AssignmentSubmission, Lesson } from '@/lib/types';
import { Modal } from '@/app/components/ui/Modal';
import { Badge } from '@/app/components/ui/Badge';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { fieldSx, softButtonSx } from '@/lib/muiFieldStyles';
import { APP_ICONS } from '@/lib/icons';

function formatDate(iso?: string | null) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function SubmissionRow({
  submission,
  onGraded,
}: Readonly<{ submission: AssignmentSubmission; onGraded: (updated: AssignmentSubmission) => void }>) {
  const graded = submission.score != null;
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(submission.score != null ? String(submission.score) : '');
  const [feedback, setFeedback] = useState(submission.feedback ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    const parsed = Number(score);
    if (score.trim() === '' || !Number.isInteger(parsed) || parsed < 0 || parsed > 100) {
      setError('La calificación debe ser un entero entre 0 y 100.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await api.gradeAssignmentSubmission(submission.id, parsed, feedback.trim() || null);
      onGraded(updated);
      setOpen(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--neutral-100)] bg-white p-3.5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--blue-50)] text-[var(--blue-600)]">
          <Icon icon={APP_ICONS.file} width={17} height={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.875rem] font-bold text-[var(--ink)]">{submission.userEmail ?? submission.userId}</p>
          <p className="text-[0.75rem] text-[var(--ink-muted)]">
            <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="font-semibold text-[var(--blue-600)] underline-offset-2 hover:underline">
              {submission.fileName ?? 'Ver archivo'}
            </a>
            {' · '}entregada el {formatDate(submission.submittedAt)}
          </p>
        </div>
        {graded ? (
          <Badge variant={(submission.score ?? 0) >= 70 ? 'green' : 'red'}>{submission.score}/100</Badge>
        ) : (
          <Badge variant="yellow">Sin calificar</Badge>
        )}
        <Button size="small" onClick={() => setOpen((v) => !v)} sx={{ ...softButtonSx, boxShadow: 'none', px: 1.75 }}>
          {open ? 'Cerrar' : graded ? 'Editar nota' : 'Calificar'}
        </Button>
      </div>

      {!open && graded && submission.feedback && (
        <p className="mt-2 rounded-xl bg-[var(--green-50)] px-3 py-2 text-[0.8125rem] leading-5 text-[var(--ink-soft)]">
          {submission.feedback}
        </p>
      )}

      {open && (
        <div className="mt-3 flex flex-col gap-3 border-t border-[var(--neutral-100)] pt-3">
          <div className="flex flex-wrap items-start gap-3">
            <TextField
              type="number"
              label="Calificación (0–100)"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              disabled={saving}
              size="small"
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              sx={{ ...fieldSx, width: '10rem' }}
            />
            <TextField
              label="Retroalimentación para el alumno (opcional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={saving}
              size="small"
              fullWidth
              multiline
              minRows={2}
              sx={{ ...fieldSx, flex: '1 1 16rem' }}
            />
          </div>
          {error && (
            <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
          )}
          <div className="flex justify-end">
            <Button
              variant="contained"
              disabled={saving}
              onClick={() => void handleSave()}
              sx={{ ...softButtonSx, bgcolor: 'var(--green-600)', color: '#fff', '&:hover': { bgcolor: 'var(--green-700)' } }}
            >
              {saving ? 'Guardando…' : 'Guardar calificación'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AssignmentGradingModal({
  open,
  onClose,
  lesson,
}: Readonly<{ open: boolean; onClose: () => void; lesson: Lesson }>) {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Sin reset de estado acá: el padre monta el modal solo mientras hay una
     lección elegida, así que cada apertura arranca con el estado inicial. */
  useEffect(() => {
    if (!open) return;
    let alive = true;
    api.assignmentSubmissions(lesson.id)
      .then((list) => { if (alive) setSubmissions(list); })
      .catch((err) => { if (alive) { setError(getErrorMessage(err)); setSubmissions([]); } });
    return () => { alive = false; };
  }, [open, lesson.id]);

  const graded = submissions?.filter((s) => s.score != null).length ?? 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Entregas · ${lesson.title}`}
      description={
        submissions === null
          ? 'Cargando entregas…'
          : `${submissions.length} ${submissions.length === 1 ? 'entrega' : 'entregas'} · ${graded} calificada${graded === 1 ? '' : 's'}`
      }
      className="max-w-2xl"
    >
      {submissions === null ? (
        <div className="flex justify-center py-8"><WaveSpinner size="sm" /></div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {error && (
            <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
          )}
          {submissions.length === 0 && !error && (
            <p className="rounded-2xl bg-[var(--blue-50)] px-4 py-6 text-center text-[0.875rem] text-[var(--ink-soft)]">
              Nadie ha entregado esta tarea todavía.
            </p>
          )}
          {submissions.map((submission) => (
            <SubmissionRow
              key={submission.id}
              submission={submission}
              onGraded={(updated) =>
                setSubmissions((prev) => prev?.map((s) => (s.id === updated.id ? updated : s)) ?? null)
              }
            />
          ))}
        </div>
      )}
    </Modal>
  );
}

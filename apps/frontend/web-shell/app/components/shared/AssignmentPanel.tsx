/* ───────────────────────────────────────────
   AssignmentPanel — entrega de una tarea, lado alumno
   ───────────────────────────────────────────
   Vive dentro del panel de actividad del camino del curso cuando la lección
   es contentType 'assignment'. El alumno sube UN archivo como entrega (subir
   otro la reemplaza y borra la calificación anterior); cuando el instructor
   la califica, acá mismo aparece el puntaje y su retroalimentación.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { api, getErrorMessage } from '@/lib/api';
import type { AssignmentSubmission, Lesson } from '@/lib/types';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { Badge } from '@/app/components/ui/Badge';
import { APP_ICONS } from '@/lib/icons';

function formatDate(iso?: string | null) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

export function AssignmentPanel({
  lesson,
  onSubmissionChange,
}: Readonly<{ lesson: Lesson; onSubmissionChange?: (submission: AssignmentSubmission | null) => void }>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  /* undefined = todavía cargando; null = sin entrega */
  const [submission, setSubmission] = useState<AssignmentSubmission | null | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api.myAssignmentSubmission(lesson.id)
      .then((result) => {
        if (!alive) return;
        /* "Sin entrega" viaja como cuerpo vacío ('' o undefined), no como
           null estricto — se normaliza para que los checks distingan bien
           "cargando" (undefined) de "sin entrega" (null). */
        const normalized = result && typeof result === 'object' ? result : null;
        setSubmission(normalized);
        onSubmissionChange?.(normalized);
      })
      .catch(() => { if (alive) setSubmission(null); });
    return () => { alive = false; };
    /* onSubmissionChange no va en deps a propósito: es un setter estable del
       padre y meterlo re-dispararía el fetch en cada render. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded = await api.uploadDocument(file);
      const saved = await api.submitAssignment(lesson.id, {
        fileUrl: uploaded.url,
        fileName: uploaded.fileName ?? file.name,
      });
      setSubmission(saved);
      onSubmissionChange?.(saved);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const graded = submission != null && submission.score != null;
  const passed = graded && (submission.score ?? 0) >= 70;

  return (
    <section className="flex flex-col gap-4 rounded-[1.25rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_12px_28px_rgba(23,50,77,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-[0.9375rem] font-extrabold text-[var(--ink)]">
          <Icon icon={APP_ICONS.upload} width={18} height={18} className="text-[var(--green-600)]" />
          Tu entrega
        </h3>
        {submission === undefined ? null : submission === null ? (
          <Badge variant="yellow">Sin entregar</Badge>
        ) : graded ? (
          <Badge variant={passed ? 'green' : 'red'}>Calificada</Badge>
        ) : (
          <Badge variant="blue">En espera de calificación</Badge>
        )}
      </div>

      {submission === undefined && (
        <p className="text-[0.875rem] text-[var(--ink-muted)]">Cargando tu entrega…</p>
      )}

      {submission && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[var(--blue-50)] px-3.5 py-3">
          <Icon icon={APP_ICONS.file} width={20} height={20} className="shrink-0 text-[var(--blue-600)]" />
          <div className="min-w-0 flex-1">
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-[0.875rem] font-bold text-[var(--blue-700)] underline-offset-2 hover:underline"
            >
              {submission.fileName ?? 'Archivo entregado'}
            </a>
            <p className="text-[0.75rem] text-[var(--ink-muted)]">Entregado el {formatDate(submission.submittedAt)}</p>
          </div>
        </div>
      )}

      {graded && (
        <div
          className="flex items-start gap-3 rounded-xl px-3.5 py-3"
          style={{
            background: passed ? 'var(--green-50)' : '#FFF1ED',
            borderLeft: `3px solid ${passed ? 'var(--green-500)' : 'var(--red-500)'}`,
          }}
        >
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[1.0625rem] font-extrabold text-white"
            style={{ background: passed ? 'var(--green-600)' : 'var(--red-500)' }}
          >
            {submission?.score}
          </span>
          <div className="min-w-0">
            <p className="text-[0.8125rem] font-extrabold" style={{ color: passed ? 'var(--green-700)' : 'var(--red-600)' }}>
              Calificación: {submission?.score}/100
            </p>
            {submission?.feedback ? (
              <p className="mt-0.5 text-[0.8438rem] leading-6 text-[var(--ink-soft)]">{submission.feedback}</p>
            ) : (
              <p className="mt-0.5 text-[0.8125rem] text-[var(--ink-muted)]">El instructor no dejó comentarios.</p>
            )}
            <p className="mt-1 text-[0.6875rem] text-[var(--ink-muted)]">
              Calificada por {submission?.gradedBy ?? 'el instructor'} · {formatDate(submission?.gradedAt)}
            </p>
          </div>
        </div>
      )}

      {submission !== undefined && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex min-h-[5rem] w-full flex-col items-center justify-center gap-1.5 rounded-[1.125rem] border-2 border-dashed border-[#DDE7D7] bg-[#F8FBF5] px-4 py-4 text-[var(--ink-muted)] transition-colors hover:border-[var(--green-300)] disabled:opacity-60"
        >
          {uploading ? (
            <WaveSpinner size="sm" />
          ) : (
            <>
              <Icon icon={APP_ICONS.upload} width={22} height={22} />
              <span className="text-xs font-medium">
                {submission
                  ? 'Subir otro archivo reemplaza tu entrega (y se vuelve a calificar)'
                  : 'Haz clic para subir tu entrega (PDF, Word o PowerPoint — máx. 20 MB)'}
              </span>
            </>
          )}
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.doc,.docx,.ppt,.pptx"
        className="hidden"
        onChange={(e) => void handleFileSelect(e)}
        disabled={uploading}
      />

      {error && (
        <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
      )}
    </section>
  );
}

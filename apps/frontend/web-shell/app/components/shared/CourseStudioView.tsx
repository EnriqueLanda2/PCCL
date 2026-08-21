/* ───────────────────────────────────────────
   CourseStudioView — estudio del curso, lado instructor
   ───────────────────────────────────────────
   Vista propia para crear y administrar un curso. Antes el instructor caía
   en la ficha de alumno (CourseContentView, con "Ya estás inscrito", "Tu
   progreso", reseñas…), que no le corresponde. Acá tiene su flujo real:

   · course === null  → modo creación: formulario + "Guardar como borrador".
   · course existente → edición: mismos campos, temario con sus lecciones,
     y las acciones de estado (enviar a revisión / publicar si es admin),
     incluyendo el motivo del revisor cuando lo rechazaron.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { api, getErrorMessage } from '@/lib/api';
import type { Course, Evaluation, Lesson, Phase } from '@/lib/types';
import { Badge } from '@/app/components/ui/Badge';
import { Field } from '@/app/components/ui/Input';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { CreateLessonModal } from '@/app/components/shared/CreateLessonModal';
import { AssignmentGradingModal } from '@/app/components/shared/AssignmentGradingModal';
import { contentTypeMeta, formatDuration } from '@/lib/lessonContentTypes';
import { fieldSx, softButtonSx } from '@/lib/muiFieldStyles';
import { usePageHeader } from '@/hooks/usePageHeader';
import { APP_ICONS } from '@/lib/icons';

const LEVEL_OPTIONS: { value: 'basic' | 'intermediate' | 'advanced'; label: string }[] = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
];

const STATUS_META: Record<string, { label: string; variant: 'blue' | 'green' | 'yellow' | 'red' | 'dark' }> = {
  draft: { label: 'Borrador', variant: 'yellow' },
  pending_review: { label: 'En revisión', variant: 'blue' },
  published: { label: 'Publicado', variant: 'green' },
  rejected: { label: 'Rechazado', variant: 'red' },
};

const pillSx = (active: boolean) => ({
  flex: 1,
  borderRadius: '0.75rem',
  border: active ? '1.5px solid var(--green-500)' : '1.5px solid #DDE7D7',
  bgcolor: active ? 'var(--green-50)' : '#fff',
  color: active ? 'var(--green-700)' : 'var(--ink-muted)',
  py: 1,
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  fontWeight: active ? 700 : 500,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    bgcolor: active ? 'var(--green-50)' : '#F8FBF5',
    borderColor: active ? 'var(--green-500)' : 'var(--green-300)',
  },
});

/** Tarjeta de fases: renombrar, subir/bajar (reordenar) y borrar. Borrar una
    fase NO borra sus lecciones — quedan "sin fase" (FK con SetNull). */
function PhasesCard({
  courseId,
  phases,
  onChange,
}: Readonly<{ courseId: string; phases: Phase[]; onChange: (phases: Phase[]) => void }>) {
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try { await fn(); } catch (err) { setError(getErrorMessage(err)); } finally { setBusy(false); }
  };

  const handleAdd = () => run(async () => {
    const title = newTitle.trim();
    if (!title) return;
    const created = await api.createPhase(courseId, title);
    setNewTitle('');
    onChange(phases.some((p) => p.id === created.id) ? phases : [...phases, created]);
  });

  const handleRename = () => run(async () => {
    if (!editingId) return;
    if (!editingTitle.trim()) { setError('El nombre de la fase no puede quedar vacío.'); return; }
    const updated = await api.updatePhase(editingId, editingTitle.trim());
    onChange(phases.map((p) => (p.id === updated.id ? updated : p)));
    setEditingId(null);
  });

  const handleMove = (index: number, dir: -1 | 1) => run(async () => {
    const target = index + dir;
    if (target < 0 || target >= phases.length) return;
    const ids = phases.map((p) => p.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    onChange(await api.reorderPhases(courseId, ids));
  });

  const handleDelete = (id: string) => run(async () => {
    await api.deletePhase(id);
    const remaining = phases.filter((p) => p.id !== id).map((p) => p.id);
    /* Reordenar tras borrar compacta la numeración a 1..N, sin huecos. */
    onChange(remaining.length ? await api.reorderPhases(courseId, remaining) : []);
  });

  const iconBtn = 'flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--neutral-100)] bg-white text-[var(--ink-muted)] transition-colors hover:border-[var(--green-300)] hover:text-[var(--ink)] disabled:opacity-35 disabled:hover:border-[var(--neutral-100)]';

  return (
    <section className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_12px_28px_rgba(23,50,77,0.06)]">
      <h2 className="mb-1 text-[1rem] font-extrabold text-[var(--ink)]">Fases del curso</h2>
      <p className="mb-3 text-[0.75rem] leading-5 text-[var(--ink-muted)]">
        Agrupan el temario en pasos — este orden es el que recorre el alumno. Borrar una fase no borra sus lecciones (quedan sin fase).
      </p>

      {phases.length === 0 && (
        <p className="mb-3 rounded-xl bg-[var(--blue-50)] px-3 py-2.5 text-center text-[0.8125rem] text-[var(--ink-soft)]">
          Este curso todavía no tiene fases.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        {phases.map((phase, index) => (
          <div key={phase.id} className="flex items-center gap-2 rounded-xl bg-[#F8FBF5] px-2.5 py-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--green-600)] text-[0.6875rem] font-extrabold text-white">
              {index + 1}
            </span>
            {editingId === phase.id ? (
              <>
                <TextField
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleRename(); } }}
                  disabled={busy}
                  size="small"
                  fullWidth
                  autoFocus
                  sx={fieldSx}
                />
                <button type="button" className={iconBtn} disabled={busy} onClick={() => void handleRename()} aria-label="Guardar nombre">
                  <Icon icon={APP_ICONS.check} width={15} height={15} className="text-[var(--green-600)]" />
                </button>
                <button type="button" className={iconBtn} disabled={busy} onClick={() => setEditingId(null)} aria-label="Cancelar">
                  <Icon icon={APP_ICONS.close} width={15} height={15} />
                </button>
              </>
            ) : (
              <>
                <p className="min-w-0 flex-1 truncate text-[0.8438rem] font-bold text-[var(--ink)]">{phase.title}</p>
                <button type="button" className={iconBtn} disabled={busy || index === 0} onClick={() => void handleMove(index, -1)} aria-label={`Subir ${phase.title}`}>
                  <Icon icon={APP_ICONS.chevronUp} width={15} height={15} />
                </button>
                <button type="button" className={iconBtn} disabled={busy || index === phases.length - 1} onClick={() => void handleMove(index, 1)} aria-label={`Bajar ${phase.title}`}>
                  <Icon icon={APP_ICONS.chevronDown} width={15} height={15} />
                </button>
                <button type="button" className={iconBtn} disabled={busy} onClick={() => { setEditingId(phase.id); setEditingTitle(phase.title); }} aria-label={`Renombrar ${phase.title}`}>
                  <Icon icon={APP_ICONS.edit} width={14} height={14} />
                </button>
                <button type="button" className={iconBtn} disabled={busy} onClick={() => void handleDelete(phase.id)} aria-label={`Borrar ${phase.title}`}>
                  <Icon icon={APP_ICONS.trash} width={14} height={14} className="text-[var(--red-500)]" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <TextField
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleAdd(); } }}
          placeholder="Nueva fase, ej. Fundamentos"
          disabled={busy}
          size="small"
          fullWidth
          sx={fieldSx}
        />
        <Button onClick={() => void handleAdd()} disabled={busy || !newTitle.trim()} sx={{ ...softButtonSx, boxShadow: 'none', px: 1.75, whiteSpace: 'nowrap' }}>
          Agregar
        </Button>
      </div>

      {error && (
        <p className="mt-2.5 rounded-xl bg-[#FFF1ED] px-3 py-2 text-[0.8125rem] text-[#BF2600]">{error}</p>
      )}
    </section>
  );
}

interface CourseStudioViewProps {
  /** null = crear un curso nuevo */
  course: Course | null;
  isAdmin: boolean;
  onBack: () => void;
  /** Creación o actualización exitosa — el padre sincroniza su lista */
  onSaved: (course: Course) => void;
  /** Abrir la ficha tal como la ve un alumno */
  onPreview: (course: Course) => void;
}

export function CourseStudioView({ course, isAdmin, onBack, onSaved, onPreview }: Readonly<CourseStudioViewProps>) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  /* El curso "vivo" del estudio: arranca con el prop y se reemplaza con cada
     respuesta del backend (crear, guardar, enviar a revisión, publicar). */
  const [current, setCurrent] = useState<Course | null>(course);
  const isNew = current === null;

  const [title, setTitle] = useState(course?.title ?? '');
  const [description, setDescription] = useState(course?.description ?? '');
  const [level, setLevel] = useState<string>(course?.level ?? 'basic');
  const [isFree, setIsFree] = useState(course ? Boolean(course.isFree) || !(course.price ?? 0) : true);
  const [price, setPrice] = useState(course?.price ? String(course.price) : '');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(course?.coverImageUrl ?? null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  /* Los exámenes NO son lecciones (viven en Evaluation, igual que las clases
     en vivo) — se cargan aparte y se mezclan en el temario para que el
     instructor vea TODO lo que armó, no solo las lecciones. */
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  /* true de entrada solo si ya hay curso que consultar — así el efecto no
     necesita prender el loading de forma síncrona (regla set-state-in-effect). */
  const [lessonsLoading, setLessonsLoading] = useState(Boolean(course));
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [gradingLesson, setGradingLesson] = useState<Lesson | null>(null);

  const status = current?.status ?? 'draft';
  const statusMeta = STATUS_META[status] ?? { label: status, variant: 'dark' as const };

  usePageHeader({
    eyebrow: 'Estudio de curso',
    title: isNew ? 'Nuevo curso' : (current?.title ?? 'Curso'),
    subtitle: isNew ? 'Se guarda como borrador — nada se publica sin revisión.' : undefined,
  });

  useEffect(() => {
    if (!current?.id) return;
    let alive = true;
    Promise.all([
      api.lessons().then((all) => all.filter((l) => l.courseId === current.id)).catch(() => []),
      api.evaluations(current.id).catch(() => []),
      api.coursePhases(current.id).catch(() => []),
    ])
      .then(([lessonList, evaluationList, phaseList]) => {
        if (!alive) return;
        setLessons(lessonList);
        setEvaluations(evaluationList);
        setPhases(phaseList);
      })
      .finally(() => { if (alive) setLessonsLoading(false); });
    return () => { alive = false; };
  }, [current?.id]);

  /* "Asignar examen" y "Clases en vivo" del modal no crean una Lesson — crean
     Evaluation/LiveSession y avisan por onLiveSaved. Se recargan los exámenes
     para que el recién creado aparezca en el temario al instante. */
  const reloadEvaluations = () => {
    if (!current?.id) return;
    api.evaluations(current.id).then(setEvaluations).catch(() => {});
  };

  /* El modal de lección también puede crear fases (PhaseSelect) — al cerrarlo
     se recargan para que la tarjeta de fases no se quede desactualizada. */
  const reloadPhases = () => {
    if (!current?.id) return;
    api.coursePhases(current.id).then(setPhases).catch(() => {});
  };

  const busy = uploading || saving || statusBusy;

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setCoverImageUrl(url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const buildDto = () => {
    const numericPrice = Number(price);
    return {
      title: title.trim(),
      description: description.trim(),
      level,
      isFree,
      price: isFree ? 0 : numericPrice,
      currency: 'USD',
      ...(coverImageUrl ? { coverImageUrl } : {}),
    };
  };

  const validate = () => {
    if (!title.trim() || !description.trim()) {
      setError('Título y descripción son obligatorios.');
      return false;
    }
    const numericPrice = Number(price);
    if (!isFree && (!price.trim() || Number.isNaN(numericPrice) || numericPrice <= 0)) {
      setError('Ingresa un precio válido o marca el curso como gratuito.');
      return false;
    }
    return true;
  };

  /** Crea (borrador) o guarda cambios. Devuelve el curso resultante o null. */
  const saveCourse = async (): Promise<Course | null> => {
    if (!validate()) return null;
    setSaving(true);
    setError(null);
    try {
      const saved = current
        ? await api.updateCourse(current.id, buildDto())
        : await api.createCourse(buildDto());
      setCurrent(saved);
      onSaved(saved);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2200);
      return saved;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setSaving(false);
    }
  };

  /** Guarda lo editado y recién entonces lo manda a la cola del revisor —
      así lo que revisa el revisor es exactamente lo que se ve en pantalla. */
  const handleSubmitForReview = async () => {
    const saved = await saveCourse();
    if (!saved) return;
    setStatusBusy(true);
    try {
      const updated = await api.submitCourseForReview(saved.id);
      setCurrent(updated);
      onSaved(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStatusBusy(false);
    }
  };

  const handlePublishNow = async () => {
    const saved = await saveCourse();
    if (!saved) return;
    setStatusBusy(true);
    try {
      const updated = await api.publishCourse(saved.id);
      setCurrent(updated);
      onSaved(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setStatusBusy(false);
    }
  };

  const handleLessonSaved = (saved: Lesson) => {
    setLessons((prev) => {
      const exists = prev.some((l) => l.id === saved.id);
      return exists ? prev.map((l) => (l.id === saved.id ? saved : l)) : [...prev, saved];
    });
  };

  const canSendToReview = status === 'draft' || status === 'rejected';
  const totalMinutes = useMemo(
    () => lessons.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0),
    [lessons],
  );

  /* Temario unificado: lecciones + exámenes en orden de creación — el mismo
     orden en el que el alumno los recorre en el camino del curso. */
  type TemarioRow =
    | { kind: 'lesson'; id: string; createdAt: string; lesson: Lesson }
    | { kind: 'evaluation'; id: string; createdAt: string; evaluation: Evaluation };
  const temarioRows = useMemo<TemarioRow[]>(() => {
    const rows: TemarioRow[] = [
      ...lessons.map((lesson) => ({ kind: 'lesson' as const, id: lesson.id, createdAt: lesson.createdAt ?? '', lesson })),
      ...evaluations.map((evaluation) => ({ kind: 'evaluation' as const, id: evaluation.id, createdAt: evaluation.createdAt ?? '', evaluation })),
    ];
    return rows.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  }, [lessons, evaluations]);

  const temarioSummary = [
    `${lessons.length} ${lessons.length === 1 ? 'lección' : 'lecciones'}`,
    evaluations.length > 0 ? `${evaluations.length} ${evaluations.length === 1 ? 'examen' : 'exámenes'}` : null,
    totalMinutes ? formatDuration(totalMinutes) : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="flex flex-col gap-5">
      {/* ── Volver + estado ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-1.5 text-[0.875rem] font-semibold text-[var(--blue-600)] transition-colors hover:text-[var(--blue-700)]"
        >
          <Icon icon={APP_ICONS.chevronLeft} width={17} height={17} className="transition-transform duration-200 ease-out group-hover:-translate-x-1" />
          Volver a mis cursos
        </button>
        <div className="flex items-center gap-2">
          {!isNew && <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>}
          {!isNew && current && (
            <Button size="small" onClick={() => onPreview(current)} sx={{ ...softButtonSx, boxShadow: 'none', px: 1.75 }}>
              Ver como alumno
            </Button>
          )}
        </div>
      </div>

      {/* ── Motivo del rechazo — la corrección empieza por leer esto ── */}
      {status === 'rejected' && current?.moderationNote && (
        <div className="rounded-2xl border-l-4 border-[var(--red-500)] bg-[#FFF1ED] px-4 py-3">
          <p className="text-[0.8125rem] font-extrabold text-[var(--red-600)]">Rechazado por el revisor</p>
          <p className="mt-0.5 text-[0.875rem] leading-6 text-[var(--ink-soft)]">{current.moderationNote}</p>
          <p className="mt-1 text-[0.75rem] text-[var(--ink-muted)]">
            Corrige lo señalado y usa &ldquo;Reenviar a revisión&rdquo; cuando esté listo.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* ── Columna principal: formulario + temario ── */}
        <div className="flex min-w-0 flex-col gap-6">
          <section className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_12px_28px_rgba(23,50,77,0.06)] sm:p-6">
            <h2 className="mb-4 text-[1.05rem] font-extrabold text-[var(--ink)]">Información del curso</h2>
            <div className="flex flex-col gap-4">
              <Field label="Portada">
                <Button
                  onClick={() => coverInputRef.current?.click()}
                  disabled={busy}
                  fullWidth
                  sx={{
                    position: 'relative', height: 176, overflow: 'hidden', borderRadius: '1rem',
                    border: '2px dashed #DDE7D7', bgcolor: '#F8FBF5', color: 'var(--ink-muted)', textTransform: 'none',
                    '&:hover': { borderColor: 'var(--green-400)', bgcolor: '#F8FBF5' },
                  }}
                >
                  {coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverImageUrl} alt="Portada del curso" className="h-full w-full object-cover" />
                  ) : uploading ? (
                    <WaveSpinner size="sm" />
                  ) : (
                    <span className="flex flex-col items-center gap-1.5">
                      <Icon icon={APP_ICONS.upload} width={22} height={22} />
                      <span className="text-xs font-medium">Haz clic para subir la portada (PNG, JPG, WEBP)</span>
                    </span>
                  )}
                </Button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => void handleCoverSelect(e)}
                  disabled={busy}
                />
              </Field>

              <Field label="Título">
                <TextField
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. APIs REST con Node.js y Express"
                  disabled={busy}
                  fullWidth
                  size="small"
                  sx={fieldSx}
                />
              </Field>

              <Field label="Descripción">
                <TextField
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="¿Qué aprenderán tus estudiantes? Esto es lo primero que leen en el catálogo."
                  disabled={busy}
                  fullWidth
                  multiline
                  minRows={4}
                  sx={fieldSx}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nivel">
                  <div className="flex gap-2">
                    {LEVEL_OPTIONS.map((opt) => (
                      <Button key={opt.value} disabled={busy} onClick={() => setLevel(opt.value)} variant="outlined" sx={pillSx(level === opt.value)}>
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                </Field>

                <Field label="Precio">
                  <div className="flex gap-2">
                    <Button disabled={busy} onClick={() => setIsFree(true)} variant="outlined" sx={pillSx(isFree)}>Gratuito</Button>
                    <Button disabled={busy} onClick={() => setIsFree(false)} variant="outlined" sx={pillSx(!isFree)}>De pago</Button>
                  </div>
                  {!isFree && (
                    <div className="mt-2">
                      <TextField
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="19.99"
                        disabled={busy}
                        fullWidth
                        size="small"
                        slotProps={{
                          htmlInput: { min: 0, step: '0.01' },
                          input: { startAdornment: <InputAdornment position="start">USD $</InputAdornment> },
                        }}
                        sx={fieldSx}
                      />
                    </div>
                  )}
                </Field>
              </div>
            </div>
          </section>

          {/* ── Temario ── */}
          <section className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_12px_28px_rgba(23,50,77,0.06)] sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[1.05rem] font-extrabold text-[var(--ink)]">Temario</h2>
                <p className="text-[0.8125rem] text-[var(--ink-muted)]">
                  {isNew ? 'Disponible en cuanto guardes el borrador.' : temarioSummary}
                </p>
              </div>
              {!isNew && (
                <Button
                  onClick={() => { setEditingLesson(null); setLessonModalOpen(true); }}
                  sx={{ ...softButtonSx, boxShadow: 'none', px: 2 }}
                >
                  + Agregar lección
                </Button>
              )}
            </div>

            {isNew ? (
              <p className="rounded-2xl bg-[var(--blue-50)] px-4 py-5 text-center text-[0.875rem] text-[var(--ink-soft)]">
                Primero guarda el borrador — después podrás agregar videos, lecturas, tareas, exámenes y clases en vivo.
              </p>
            ) : lessonsLoading ? (
              <div className="flex justify-center py-6"><WaveSpinner size="sm" /></div>
            ) : temarioRows.length === 0 ? (
              <p className="rounded-2xl bg-[var(--blue-50)] px-4 py-5 text-center text-[0.875rem] text-[var(--ink-soft)]">
                Este curso todavía no tiene lecciones. El revisor necesita ver contenido para aprobarlo.
              </p>
            ) : (
              <div className="flex flex-col">
                {temarioRows.map((row, i) => {
                  const isLast = i === temarioRows.length - 1;
                  if (row.kind === 'evaluation') {
                    const questionCount = row.evaluation.questions?.length ?? 0;
                    return (
                      <div
                        key={row.id}
                        className="flex flex-wrap items-center gap-3 py-3"
                        style={{ borderBottom: isLast ? 'none' : '1px solid var(--neutral-100)' }}
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
                      </div>
                    );
                  }
                  const { lesson } = row;
                  const meta = contentTypeMeta(lesson.contentType);
                  const duration = formatDuration(lesson.durationMinutes);
                  return (
                    <div
                      key={row.id}
                      className="flex flex-wrap items-center gap-3 py-3"
                      style={{ borderBottom: isLast ? 'none' : '1px solid var(--neutral-100)' }}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--blue-50)] text-[var(--blue-700)]">
                        <Icon icon={meta.icon} width={17} height={17} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[0.875rem] font-bold text-[var(--ink)]">{lesson.title}</p>
                        <p className="text-[0.75rem] text-[var(--ink-muted)]">{meta.label}{duration ? ` · ${duration}` : ''}</p>
                      </div>
                      {lesson.contentType === 'assignment' && (
                        <Button size="small" onClick={() => setGradingLesson(lesson)} sx={{ ...softButtonSx, boxShadow: 'none', px: 1.5 }}>
                          Entregas
                        </Button>
                      )}
                      <Button
                        size="small"
                        onClick={() => { setEditingLesson(lesson); setLessonModalOpen(true); }}
                        sx={{ ...softButtonSx, boxShadow: 'none', px: 1.5 }}
                      >
                        Editar
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* ── Columna de acciones ── */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-4 lg:self-start">
          <section className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_12px_28px_rgba(23,50,77,0.06)]">
            <h2 className="mb-1 text-[1rem] font-extrabold text-[var(--ink)]">
              {isNew ? 'Publicación' : 'Estado del curso'}
            </h2>
            <p className="mb-4 text-[0.8125rem] leading-5 text-[var(--ink-muted)]">
              {isNew
                ? 'Tu curso se guarda como borrador privado. Cuando el temario esté listo, envíalo a revisión — un revisor lo aprueba antes de publicarse.'
                : status === 'draft'
                  ? 'Borrador privado — solo tú lo ves. Envíalo a revisión cuando esté listo.'
                  : status === 'pending_review'
                    ? 'En la cola del revisor. Te avisará aprobándolo (se publica solo) o dejándote el motivo del rechazo.'
                    : status === 'rejected'
                      ? 'El revisor lo rechazó — el motivo está arriba. Corrige y reenvíalo.'
                      : 'Publicado en el catálogo. Los cambios que guardes se reflejan de inmediato.'}
            </p>

            <div className="flex flex-col gap-2.5">
              <Button
                variant="contained"
                disabled={busy}
                onClick={() => void saveCourse()}
                sx={{ ...softButtonSx, bgcolor: 'var(--green-600)', color: '#fff', width: '100%', '&:hover': { bgcolor: 'var(--green-700)' } }}
              >
                {saving ? 'Guardando…' : isNew ? 'Guardar como borrador' : 'Guardar cambios'}
              </Button>

              {!isNew && canSendToReview && (
                <Button
                  variant="outlined"
                  disabled={busy}
                  onClick={() => void handleSubmitForReview()}
                  sx={{ ...softButtonSx, boxShadow: 'none', width: '100%' }}
                >
                  {statusBusy ? 'Enviando…' : status === 'rejected' ? 'Corregido: reenviar a revisión' : 'Enviar a revisión'}
                </Button>
              )}

              {!isNew && isAdmin && status !== 'published' && (
                <Button
                  variant="outlined"
                  disabled={busy}
                  onClick={() => void handlePublishNow()}
                  sx={{ ...softButtonSx, boxShadow: 'none', width: '100%' }}
                >
                  Publicar sin revisión (admin)
                </Button>
              )}
            </div>

            {savedFlash && (
              <p className="mt-3 rounded-xl bg-[var(--green-50)] px-3 py-2 text-center text-[0.8125rem] font-bold text-[var(--green-700)]">
                Cambios guardados ✓
              </p>
            )}
            {error && (
              <p className="mt-3 rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
            )}
          </section>

          {!isNew && (
            <section className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5 shadow-[0_12px_28px_rgba(23,50,77,0.06)]">
              <h2 className="mb-3 text-[1rem] font-extrabold text-[var(--ink)]">Resumen</h2>
              <ul className="flex flex-col gap-2 text-[0.8438rem] text-[var(--ink-soft)]">
                <li className="flex items-center gap-2.5"><Icon icon={APP_ICONS.book} width={16} height={16} />{lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'}</li>
                <li className="flex items-center gap-2.5"><Icon icon={APP_ICONS.users} width={16} height={16} />{current?.studentsCount ?? 0} estudiantes</li>
                <li className="flex items-center gap-2.5">
                  <Icon icon={APP_ICONS.star} width={16} height={16} />
                  {isFree || !Number(price) ? 'Gratuito' : `USD $${Number(price).toFixed(2)}`}
                </li>
              </ul>
            </section>
          )}

          {!isNew && current && (
            <PhasesCard courseId={current.id} phases={phases} onChange={setPhases} />
          )}
        </aside>
      </div>

      {current && (
        <CreateLessonModal
          open={lessonModalOpen}
          /* reloadPhases: el modal también puede crear fases con PhaseSelect */
          onClose={() => { setLessonModalOpen(false); reloadPhases(); }}
          courseId={current.id}
          lesson={editingLesson}
          onSaved={handleLessonSaved}
          onLiveSaved={reloadEvaluations}
        />
      )}

      {gradingLesson && (
        <AssignmentGradingModal
          open={Boolean(gradingLesson)}
          onClose={() => setGradingLesson(null)}
          lesson={gradingLesson}
        />
      )}
    </div>
  );
}

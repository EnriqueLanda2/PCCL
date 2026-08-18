/* ───────────────────────────────────────────
   CreateLessonModal — alta/edición de lección
   dentro de un curso ya creado.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { api, getErrorMessage } from '@/lib/api';
import type { Lesson, Phase, SessionUser } from '@/lib/types';
import { Modal } from '@/app/components/ui/Modal';
import { Field } from '@/app/components/ui/Input';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { CONTENT_TYPE_META, type LessonContentType } from '@/lib/lessonContentTypes';
import { fieldSx, softButtonSx } from '@/lib/muiFieldStyles';
import { APP_ICONS } from '@/lib/icons';
import { PhaseSelect } from '@/app/components/shared/PhaseSelect';
import { QuestionsEditor, emptyQuestion, type QuestionDraft } from '@/app/components/shared/QuestionsEditor';

const CONTENT_TYPES: LessonContentType[] = ['video', 'file', 'reading', 'live', 'exam'];
const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface CreateLessonModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  lesson?: Lesson | null;
  onSaved: (lesson: Lesson) => void;
  onLiveSaved?: () => void;
}

function dateToLocalValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
}

function localValueToDate(value: string) {
  if (!value) return new Date();
  const [date, time] = value.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

function formatDateTime(value: string) {
  if (!value) return 'Selecciona fecha y hora';
  return localValueToDate(value).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Campo numérico de hora/minuto que se escribe dígito por dígito (ej. "1"
    luego "5" → 15) — sin lista fija de opciones. Mientras el campo tiene foco
    nunca se reformatea desde afuera (eso fue lo que rompía escribir un
    número de 2 dígitos con el picker viejo: el valor formateado "0X" se
    volvía a pintar sobre lo que ibas tecleando). Solo al perder el foco se
    recorta al rango válido y se rellena con cero a la izquierda. */
function TimeNumberField({
  value,
  min = 0,
  max,
  onCommit,
}: Readonly<{ value: string; min?: number; max: number; onCommit: (n: number) => void }>) {
  const [local, setLocal] = useState(value);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setLocal(value);
  }, [value, focused]);

  const clamp = (raw: string) => Math.min(max, Math.max(min, Number(raw || min)));

  return (
    <input
      type="text"
      inputMode="numeric"
      value={local}
      onFocus={() => setFocused(true)}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
        setLocal(digits);
        if (digits !== '') onCommit(clamp(digits));
      }}
      onBlur={() => {
        setFocused(false);
        const n = clamp(local);
        onCommit(n);
        setLocal(String(n).padStart(2, '0'));
      }}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
      className="h-10 w-full rounded-xl border border-[#DDE7D7] bg-white px-3 text-center text-[0.9375rem] font-semibold text-[var(--ink)] transition-colors hover:border-[var(--green-300)] focus:border-[var(--green-500)] focus:outline-none"
    />
  );
}

function DateTimePickerField({
  value,
  disabled,
  onChange,
}: Readonly<{ value: string; disabled: boolean; onChange: (value: string) => void }>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selected = useMemo(() => localValueToDate(value), [value]);
  const [viewDate, setViewDate] = useState(selected);
  const open = Boolean(anchorEl);
  const selectedDayKey = selected.toDateString();
  const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  start.setDate(start.getDate() - start.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });

  const setPart = (next: Date) => onChange(dateToLocalValue(next));
  const pickDay = (day: Date) => {
    const next = new Date(day);
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    setPart(next);
  };
  const setHour = (hour12: string) => {
    const next = new Date(selected);
    const isPm = selected.getHours() >= 12;
    next.setHours((Number(hour12) % 12) + (isPm ? 12 : 0));
    setPart(next);
  };
  const setMinute = (minute: string) => {
    const next = new Date(selected);
    next.setMinutes(Number(minute));
    setPart(next);
  };
  const setAmPm = (ampm: 'AM' | 'PM') => {
    const next = new Date(selected);
    const hour = next.getHours();
    if (ampm === 'AM' && hour >= 12) next.setHours(hour - 12);
    if (ampm === 'PM' && hour < 12) next.setHours(hour + 12);
    setPart(next);
  };

  return (
    <>
      <Button
        type="button"
        disabled={disabled}
        onClick={(event) => { setAnchorEl(anchorEl ? null : event.currentTarget); setViewDate(selected); }}
        fullWidth
        endIcon={<Icon icon="solar:calendar-mark-bold-duotone" width={18} height={18} />}
        sx={{
          justifyContent: 'space-between',
          height: 54,
          borderRadius: '1.125rem',
          border: '1px solid #DDE7D7',
          bgcolor: '#F8FBF5',
          color: value ? 'var(--ink)' : '#A2AE9D',
          px: 2.5,
          fontFamily: 'var(--font-sans)',
          fontSize: 16,
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': { bgcolor: '#F8FBF5', borderColor: 'var(--green-300)' },
        }}
      >
        {formatDateTime(value)}
      </Button>

      <Popper open={open} anchorEl={anchorEl} placement="top-start" sx={{ zIndex: 1400 }}>
        <Paper
          sx={{
            width: 600,
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: '1.375rem',
            border: '1px solid #DDE7D7',
            bgcolor: '#F8FBF5',
            p: 2,
            boxShadow: '0 26px 70px rgba(23,50,77,0.22)',
          }}
        >
          <div className="grid gap-5 sm:grid-cols-[1fr_15rem]">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-sm text-[var(--ink)]">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</strong>
                <div className="flex gap-1">
                  <IconButton size="small" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}>
                    <Icon icon="solar:alt-arrow-left-linear" width={16} />
                  </IconButton>
                  <IconButton size="small" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}>
                    <Icon icon="solar:alt-arrow-right-linear" width={16} />
                  </IconButton>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((day) => <span key={day} className="text-xs font-semibold text-[var(--ink-soft)]">{day}</span>)}
                {days.map((day) => {
                  const selectedDay = day.toDateString() === selectedDayKey;
                  const isToday = day.toDateString() === new Date().toDateString();
                  const sameMonth = day.getMonth() === viewDate.getMonth();
                  return (
                    <Button
                      key={day.toISOString()}
                      onClick={() => pickDay(day)}
                      sx={{
                        minWidth: 0,
                        height: 36,
                        borderRadius: '0.625rem',
                        color: selectedDay ? '#fff' : sameMonth ? 'var(--ink)' : 'var(--ink-muted)',
                        bgcolor: selectedDay ? 'var(--blue-600)' : 'transparent',
                        border: !selectedDay && isToday ? '1.5px solid var(--blue-300)' : '1.5px solid transparent',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: selectedDay ? 800 : 500,
                        '&:hover': { bgcolor: selectedDay ? 'var(--blue-700)' : 'var(--blue-50)' },
                      }}
                    >
                      {day.getDate()}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Resumen legible de lo elegido — confirma de un vistazo antes de tocar "Listo". */}
              <div className="rounded-2xl border border-[#DDE7D7] bg-white px-3 py-2.5 text-center">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Seleccionado</p>
                <p className="mt-0.5 text-[0.9375rem] font-bold text-[var(--ink)]">{formatDateTime(value)}</p>
              </div>

              <div>
                <p className="mb-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Hora</p>
                <div className="grid grid-cols-2 gap-2">
                  <TimeNumberField
                    value={String((selected.getHours() % 12) || 12).padStart(2, '0')}
                    min={1}
                    max={12}
                    onCommit={(n) => setHour(String(n))}
                  />
                  <TimeNumberField
                    value={String(selected.getMinutes()).padStart(2, '0')}
                    min={0}
                    max={59}
                    onCommit={(n) => setMinute(String(n))}
                  />
                </div>
              </div>

              {/* AM/PM como toggle, no un tercer select angosto: dos botones grandes,
                  más fácil de tocar y no compite por espacio con hora/minuto. */}
              <div className="flex rounded-full border border-[#DDE7D7] bg-white p-1">
                {(['AM', 'PM'] as const).map((ampm) => {
                  const active = (selected.getHours() >= 12 ? 'PM' : 'AM') === ampm;
                  return (
                    <button
                      key={ampm}
                      type="button"
                      onClick={() => setAmPm(ampm)}
                      className={`flex-1 rounded-full py-1.5 text-[0.8125rem] font-bold transition-colors ${
                        active ? 'bg-[var(--green-600)] text-white' : 'text-[var(--ink-soft)] hover:bg-[var(--green-50)]'
                      }`}
                    >
                      {ampm}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto flex justify-between gap-2">
                <Button size="small" sx={{ ...softButtonSx, boxShadow: 'none' }} onClick={() => onChange('')}>Limpiar</Button>
                <Button size="small" sx={{ ...softButtonSx, boxShadow: 'none' }} onClick={() => { const now = new Date(); onChange(dateToLocalValue(now)); setViewDate(now); }}>Hoy</Button>
                <Button size="small" variant="contained" sx={{ ...softButtonSx, bgcolor: 'var(--green-600)', color: '#fff' }} onClick={() => setAnchorEl(null)}>Listo</Button>
              </div>
            </div>
          </div>
        </Paper>
      </Popper>
    </>
  );
}

export function CreateLessonModal({ open, onClose, courseId, lesson, onSaved, onLiveSaved }: Readonly<CreateLessonModalProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(lesson);
  /* Guardia sincrónica contra doble envío — Enter en cualquier input de
     texto del formulario (ej. una opción del examen) dispara el submit
     nativo del <form>, y si eso pasa justo antes de un clic en "Asignar
     examen", el estado `submitting` (que se actualiza async) todavía no
     alcanzó a re-renderizar el botón como disabled. Un ref se lee/escribe al
     toque, sin esperar un re-render, así que sí corta la segunda llamada. */
  const submittingRef = useRef(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<LessonContentType>('reading');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveHostName, setLiveHostName] = useState('');
  const [liveScheduledAt, setLiveScheduledAt] = useState('');
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [phaseId, setPhaseId] = useState('');
  const [examPassingScore, setExamPassingScore] = useState('70');
  const [examPosition, setExamPosition] = useState<'start' | 'end'>('end');
  const [examQuestions, setExamQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      setTitle(lesson?.title ?? '');
      setContent(lesson?.content ?? '');
      setContentType(
        lesson?.contentType && CONTENT_TYPES.includes(lesson.contentType as LessonContentType)
          ? lesson.contentType as LessonContentType
          : 'reading',
      );
      setDurationMinutes(lesson?.durationMinutes ? String(lesson.durationMinutes) : '');
      setFileUrl(lesson?.fileUrl ?? null);
      setLiveHostName('');
      setLiveScheduledAt('');
      setPhaseId(lesson?.phaseId ?? '');
      setExamPassingScore('70');
      setExamPosition('end');
      setExamQuestions([emptyQuestion()]);
      setError(null);
      api.me()
        .then((me) => {
          setCurrentUser(me);
          setLiveHostName(me.fullName ?? me.email);
        })
        .catch(() => setCurrentUser(null));
      api.coursePhases(courseId).then(setPhases).catch(() => setPhases([]));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, lesson, courseId]);

  const busy = uploading || submitting;
  const needsDocument = contentType === 'file';
  const needsVideo = contentType === 'video';
  const needsLive = contentType === 'live';
  const needsExam = contentType === 'exam';
  const currentHostName = liveHostName || currentUser?.email || '';

  const handleClose = () => { if (!busy) onClose(); };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { url } = needsVideo ? await api.uploadVideo(file) : await api.uploadDocument(file);
      setFileUrl(url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!title.trim() || (!needsLive && !needsExam && !content.trim())) {
      setError(needsLive || needsExam ? 'Título es obligatorio.' : 'Título y contenido son obligatorios.');
      return;
    }
    if (needsLive && !isEditing && !liveScheduledAt) {
      setError('Fecha y hora son obligatorias para una clase en vivo.');
      return;
    }
    if ((needsLive || needsExam) && !isEditing && !phaseId) {
      setError('Selecciona la fase del curso a la que pertenece esta clase.');
      return;
    }
    if (needsExam && !isEditing) {
      if (examQuestions.length === 0) {
        setError('Agrega al menos una pregunta al examen.');
        return;
      }
      for (let i = 0; i < examQuestions.length; i += 1) {
        const q = examQuestions[i];
        if (!q.prompt.trim()) {
          setError(`Falta el texto de la pregunta ${i + 1}.`);
          return;
        }
        const filled = q.options.filter((o) => o.trim());
        if (filled.length < 2) {
          setError(`La pregunta ${i + 1} necesita al menos 2 incisos con texto.`);
          return;
        }
        if (!q.options[q.correctIndex]?.trim()) {
          setError(`Marca cuál inciso es la correcta en la pregunta ${i + 1}.`);
          return;
        }
      }
    }
    submittingRef.current = true;
    setSubmitting(true);
    setError(null);
    try {
      if (needsLive && !isEditing) {
        await api.createLiveSession({
          title: title.trim(),
          scheduledAt: new Date(liveScheduledAt).toISOString(),
          durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
          courseId,
          phaseId,
        });
        onLiveSaved?.();
        onClose();
        return;
      }

      if (needsExam && !isEditing) {
        /* Incisos vacíos (ej. el profesor agregó un 4to inciso y lo dejó en
           blanco) se descartan acá — no antes, porque hasta este punto el
           índice de la correcta todavía tiene que corresponder 1 a 1 con lo
           que se ve en el formulario. */
        const questions = examQuestions.map((q) => {
          const correctText = q.options[q.correctIndex]?.trim() ?? '';
          const options = q.options.map((o) => o.trim()).filter(Boolean);
          return { prompt: q.prompt.trim(), options, correctIndex: Math.max(0, options.indexOf(correctText)) };
        });
        await api.createEvaluation({
          title: title.trim(),
          description: content.trim() || undefined,
          passingScore: examPassingScore ? Number(examPassingScore) : undefined,
          courseId,
          phaseId,
          phasePosition: examPosition,
          questions,
        });
        onLiveSaved?.();
        onClose();
        return;
      }

      const dto = {
        title: title.trim(),
        content: content.trim(),
        /* 'live' y 'exam' son pseudo-tipos que ya se manejaron arriba y
           siempre retornan antes de llegar acá — nunca se guardan como
           contentType real de una lección. */
        contentType: contentType as Lesson['contentType'],
        courseId,
        phaseId: phaseId || undefined,
        durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
        fileUrl: needsDocument || needsVideo ? fileUrl ?? undefined : undefined,
      };
      const saved = isEditing && lesson
        ? await api.updateLesson(lesson.id, dto)
        : await api.createLesson(dto);

      onSaved(saved);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditing ? 'Editar lección' : 'Nueva lección'}
      description={isEditing ? 'Actualiza el contenido o reemplaza el adjunto.' : 'Agrega contenido a este curso.'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Título">
          <TextField value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Autenticación con JWT" disabled={busy} fullWidth size="small" sx={fieldSx} />
        </Field>

        <Field label="Tipo de contenido">
          <Select value={contentType} onChange={(e: SelectChangeEvent) => setContentType(e.target.value as LessonContentType)} disabled={busy} fullWidth size="small" sx={fieldSx}>
            {CONTENT_TYPES.map((type) => (
              <MenuItem key={type} value={type}>{CONTENT_TYPE_META[type].label}</MenuItem>
            ))}
          </Select>
        </Field>

        <Field label="Contenido / descripción">
          <TextField
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Texto de la lección, o una descripción de lo que cubre el video/documento adjunto."
            disabled={busy}
            fullWidth
            multiline
            minRows={3}
            sx={fieldSx}
          />
        </Field>

        {!(isEditing && (needsLive || needsExam)) && (
          <PhaseSelect
            courseId={courseId}
            phases={phases}
            value={phaseId}
            onChange={setPhaseId}
            onPhasesChange={setPhases}
            disabled={busy}
            required={needsLive || needsExam}
            variant="mui"
          />
        )}

        {needsExam && !isEditing && (
          <>
            <Field label="Puntaje mínimo aprobatorio (%)">
              <TextField
                type="number"
                value={examPassingScore}
                onChange={(e) => setExamPassingScore(e.target.value)}
                disabled={busy}
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 1, max: 100 } }}
                sx={fieldSx}
              />
            </Field>

            <Field label="Posición dentro de la fase">
              <div className="flex rounded-full border border-[#DDE7D7] bg-white p-1">
                {([
                  { value: 'start', label: 'Al comienzo' },
                  { value: 'end', label: 'Al final' },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setExamPosition(option.value)}
                    disabled={busy}
                    className={`flex-1 rounded-full py-1.5 text-[0.8125rem] font-bold transition-colors ${
                      examPosition === option.value ? 'bg-[var(--green-600)] text-white' : 'text-[var(--ink-soft)] hover:bg-[var(--green-50)]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[0.75rem] text-[var(--ink-muted)]">
                "Al comienzo" lo pone antes de las lecciones de la fase; "al final" lo pone como examen de cierre, después de completarlas todas.
              </p>
            </Field>

            <Field label="Preguntas del examen">
              <QuestionsEditor questions={examQuestions} onChange={setExamQuestions} disabled={busy} />
            </Field>
          </>
        )}

        {(needsDocument || needsVideo) && (
          <Field label={needsVideo ? 'Video (opcional)' : 'Documento (opcional)'}>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              fullWidth
              sx={{ ...softButtonSx, height: 96, border: '2px dashed #DDE7D7', borderRadius: '1.125rem', boxShadow: 'none' }}
            >
              {uploading ? (
                <WaveSpinner size="sm" />
              ) : fileUrl ? (
                <span className="flex flex-col items-center gap-1 text-[var(--green-700)]">
                  <Icon icon={needsVideo ? APP_ICONS.video : APP_ICONS.file} width={22} height={22} />
                  <span className="text-xs font-medium">Archivo cargado — clic para reemplazar</span>
                </span>
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-[var(--ink-muted)]">
                  <Icon icon={APP_ICONS.upload} width={22} height={22} />
                  <span className="text-xs font-medium">
                    {needsVideo ? 'Haz clic para subir un video (MP4, WEBM, MOV — máx. 200 MB)' : 'Haz clic para subir un PDF, Word o PowerPoint (máx. 20 MB)'}
                  </span>
                </span>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept={needsVideo ? 'video/mp4,video/webm,video/quicktime' : 'application/pdf,.doc,.docx,.ppt,.pptx'}
              className="hidden"
              onChange={handleFileSelect}
              disabled={busy}
            />
          </Field>
        )}

        {needsLive && !isEditing && (
          <>
            <Field label="Anfitrión">
              <TextField value={currentHostName} disabled fullWidth size="small" helperText="El anfitrión y administrador será quien crea esta clase." sx={fieldSx} />
            </Field>
            <Field label="Fecha y hora">
              <DateTimePickerField value={liveScheduledAt} onChange={setLiveScheduledAt} disabled={busy} />
            </Field>
            <p className="flex items-center gap-1.5 text-[0.75rem] text-[var(--ink-muted)]">
              <Icon icon={APP_ICONS.lock} width={13} height={13} />
              Se programa una sesión en vivo real. No se guarda como video ni como lección.
            </p>
            <div className="flex items-start gap-2 rounded-2xl border border-[var(--yellow-200,#F5DFA0)] bg-[var(--yellow-50,#FFF9EC)] px-3.5 py-3">
              <Icon icon={APP_ICONS.warning} width={17} height={17} className="mt-0.5 shrink-0 text-[var(--yellow-600,#B98900)]" />
              <p className="text-[0.8125rem] leading-5 text-[var(--ink-soft)]">
                <strong className="text-[var(--ink)]">Importante:</strong> si no entrás a la sala a la hora exacta programada,
                la clase se cancela automáticamente a los <strong>15 minutos</strong> y se les avisa a los inscritos
                que se va a reagendar.
              </p>
            </div>
          </>
        )}
        {needsLive && isEditing && (
          <p className="text-[0.75rem] text-[var(--ink-muted)]">
            La sala en vivo de esta lección ya existe y se administra desde <strong>Clases en vivo</strong> — aquí solo edita el título/descripción.
          </p>
        )}

        {!needsExam && (
          <Field label="Duración en minutos (opcional)">
            <TextField
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="Ej. 25"
              disabled={busy}
              fullWidth
              size="small"
              slotProps={{ htmlInput: { min: 1 } }}
              sx={fieldSx}
            />
          </Field>
        )}

        {error && (
          <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
        )}

        <div className="mt-1 flex justify-end gap-2.5">
          <Button type="button" variant="outlined" onClick={handleClose} disabled={busy} sx={softButtonSx}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={uploading || submitting}
            sx={{ ...softButtonSx, bgcolor: 'var(--green-600)', color: '#fff', '&:hover': { bgcolor: 'var(--green-700)' } }}
          >
            {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : needsLive ? 'Programar clase' : needsExam ? 'Asignar examen' : 'Agregar lección'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

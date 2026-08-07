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
import type { Lesson, SessionUser, User } from '@/lib/types';
import { Modal } from '@/app/components/ui/Modal';
import { Field } from '@/app/components/ui/Input';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { CONTENT_TYPE_META, type LessonContentType } from '@/lib/lessonContentTypes';
import { APP_ICONS } from '@/lib/icons';

const CONTENT_TYPES: LessonContentType[] = ['video', 'file', 'reading', 'live'];
const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

interface CreateLessonModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  lesson?: Lesson | null;
  onSaved: (lesson: Lesson) => void;
  onLiveSaved?: () => void;
}

interface InstructorOption {
  id: string;
  fullName: string;
  email: string;
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

function hasRole(user: User, roleName: string) {
  return user.userRoles?.some((userRole) => userRole.role?.name === roleName) ?? false;
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '1.125rem',
    bgcolor: '#F8FBF5',
    fontFamily: 'var(--font-sans)',
    color: 'var(--ink)',
    '& fieldset': { borderColor: '#DDE7D7' },
    '&:hover fieldset': { borderColor: 'var(--green-300)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--green-500)', boxShadow: '0 0 0 2px var(--green-100)' },
    '&.Mui-disabled': { bgcolor: '#F1F6EB' },
  },
  '& input::placeholder, & textarea::placeholder': { color: '#A2AE9D', opacity: 1 },
};

const softButtonSx = {
  borderRadius: '999px',
  borderColor: 'var(--neutral-200)',
  bgcolor: 'var(--panel)',
  color: 'var(--ink-soft)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  textTransform: 'none',
  '&:hover': { bgcolor: 'var(--green-50)', borderColor: 'var(--green-300)' },
};

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
            width: 520,
            maxWidth: 'calc(100vw - 32px)',
            borderRadius: '1.375rem',
            border: '1px solid #DDE7D7',
            bgcolor: '#F8FBF5',
            p: 2,
            boxShadow: '0 26px 70px rgba(23,50,77,0.22)',
          }}
        >
          <div className="grid gap-4 sm:grid-cols-[1fr_190px]">
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
                  const sameMonth = day.getMonth() === viewDate.getMonth();
                  return (
                    <Button
                      key={day.toISOString()}
                      onClick={() => pickDay(day)}
                      sx={{
                        minWidth: 0,
                        height: 34,
                        borderRadius: '0.625rem',
                        color: selectedDay ? '#fff' : sameMonth ? 'var(--ink)' : 'var(--ink-muted)',
                        bgcolor: selectedDay ? 'var(--blue-600)' : 'transparent',
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
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <Select size="small" value={String((selected.getHours() % 12) || 12).padStart(2, '0')} onChange={(e) => setHour(e.target.value)} sx={fieldSx}>
                  {HOUR_OPTIONS.map((hour) => <MenuItem key={hour} value={hour}>{hour}</MenuItem>)}
                </Select>
                <Select size="small" value={String(Math.floor(selected.getMinutes() / 5) * 5).padStart(2, '0')} onChange={(e) => setMinute(e.target.value)} sx={fieldSx}>
                  {MINUTE_OPTIONS.map((minute) => <MenuItem key={minute} value={minute}>{minute}</MenuItem>)}
                </Select>
                <Select size="small" value={selected.getHours() >= 12 ? 'PM' : 'AM'} onChange={(e) => setAmPm(e.target.value as 'AM' | 'PM')} sx={fieldSx}>
                  <MenuItem value="AM">AM</MenuItem>
                  <MenuItem value="PM">PM</MenuItem>
                </Select>
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
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);

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
      setError(null);
      api.me()
        .then((me) => {
          setCurrentUser(me);
          if (me.roles.includes('instructor')) setLiveHostName(me.fullName ?? me.email);
        })
        .catch(() => setCurrentUser(null));
      api.users()
        .then((users) => setInstructors(
          users
            .filter((user) => user.active && hasRole(user, 'instructor'))
            .map((user) => ({ id: user.id, fullName: user.fullName, email: user.email })),
        ))
        .catch(() => setInstructors([]));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, lesson]);

  const busy = uploading || submitting;
  const needsDocument = contentType === 'file';
  const needsVideo = contentType === 'video';
  const needsLive = contentType === 'live';
  const currentUserIsInstructor = currentUser?.roles.includes('instructor') ?? false;
  const selectedInstructor = instructors.find((instructor) => instructor.fullName === liveHostName || instructor.email === liveHostName);

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
    if (!title.trim() || (!needsLive && !content.trim())) {
      setError(needsLive ? 'Título es obligatorio.' : 'Título y contenido son obligatorios.');
      return;
    }
    if (needsLive && !isEditing && (!liveHostName.trim() || !liveScheduledAt)) {
      setError('Anfitrión y fecha/hora son obligatorios para una clase en vivo.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (needsLive && !isEditing) {
        await api.createLiveSession({
          title: title.trim(),
          hostName: selectedInstructor?.fullName ?? liveHostName.trim(),
          scheduledAt: new Date(liveScheduledAt).toISOString(),
          durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
          courseId,
        });
        onLiveSaved?.();
        onClose();
        return;
      }

      const dto = {
        title: title.trim(),
        content: content.trim(),
        contentType,
        courseId,
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
              {currentUserIsInstructor ? (
                <TextField value={liveHostName} disabled fullWidth size="small" helperText="El anfitrión será el profesor que crea la clase." sx={fieldSx} />
              ) : (
                <Select
                  value={liveHostName}
                  onChange={(e: SelectChangeEvent) => setLiveHostName(e.target.value)}
                  displayEmpty
                  disabled={busy || instructors.length === 0}
                  fullWidth
                  size="small"
                  sx={fieldSx}
                >
                  <MenuItem value="" disabled>{instructors.length === 0 ? 'No hay profesores disponibles' : 'Selecciona un profesor'}</MenuItem>
                  {instructors.map((instructor) => (
                    <MenuItem key={instructor.id} value={instructor.fullName}>
                      {instructor.fullName} · {instructor.email}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Fecha y hora">
              <DateTimePickerField value={liveScheduledAt} onChange={setLiveScheduledAt} disabled={busy} />
            </Field>
            <p className="flex items-center gap-1.5 text-[0.75rem] text-[var(--ink-muted)]">
              <Icon icon={APP_ICONS.lock} width={13} height={13} />
              Se programa una sesión en vivo real. No se guarda como video ni como lección.
            </p>
          </>
        )}
        {needsLive && isEditing && (
          <p className="text-[0.75rem] text-[var(--ink-muted)]">
            La sala en vivo de esta lección ya existe y se administra desde <strong>Clases en vivo</strong> — aquí solo edita el título/descripción.
          </p>
        )}

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
            {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : needsLive ? 'Programar clase' : 'Agregar lección'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

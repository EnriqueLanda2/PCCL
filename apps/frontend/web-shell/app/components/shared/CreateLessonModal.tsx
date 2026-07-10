/* ───────────────────────────────────────────
   CreateLessonModal — alta/edición de lección
   dentro de un curso ya creado. Título, tipo de
   contenido, texto y, según el tipo, un adjunto
   (documento o video) que se sube a Cloudinary
   en cuanto se selecciona (POST /uploads/document
   o /uploads/video) — solo la URL resultante
   viaja en el DTO de la lección.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { api, getErrorMessage } from '@/lib/api';
import type { Lesson } from '@/lib/types';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { Field, Input } from '@/app/components/ui/Input';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { CONTENT_TYPE_META, type LessonContentType } from '@/lib/lessonContentTypes';
import { APP_ICONS } from '@/lib/icons';

const CONTENT_TYPES = Object.keys(CONTENT_TYPE_META) as LessonContentType[];

interface CreateLessonModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  /** Si se provee, el modal edita esta lección en vez de crear una nueva */
  lesson?: Lesson | null;
  onSaved: (lesson: Lesson) => void;
}

export function CreateLessonModal({ open, onClose, courseId, lesson, onSaved }: Readonly<CreateLessonModalProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(lesson);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<LessonContentType>('text');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* Precarga los campos al abrir en modo edición (o limpia al abrir para crear) */
  useEffect(() => {
    if (!open) return;
    setTitle(lesson?.title ?? '');
    setContent(lesson?.content ?? '');
    setContentType((lesson?.contentType as LessonContentType) ?? 'text');
    setDurationMinutes(lesson?.durationMinutes ? String(lesson.durationMinutes) : '');
    setFileUrl(lesson?.fileUrl ?? null);
    setError(null);
  }, [open, lesson]);

  const busy = uploading || submitting;
  const needsDocument = contentType === 'file';
  const needsVideo = contentType === 'video';

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
    if (!title.trim() || !content.trim()) {
      setError('Título y contenido son obligatorios.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
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
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Autenticación con JWT" disabled={busy} />
        </Field>

        <Field label="Tipo de contenido">
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as LessonContentType)}
            disabled={busy}
            className="h-11 w-full rounded-2xl border border-[#DDE7D7] bg-[#F8FBF5] px-4 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--green-500)] focus:ring-2 focus:ring-[#D2F2DE] disabled:cursor-not-allowed disabled:bg-[#F1F6EB]"
          >
            {CONTENT_TYPES.map((type) => (
              <option key={type} value={type}>{CONTENT_TYPE_META[type].label}</option>
            ))}
          </select>
        </Field>

        <Field label="Contenido / descripción">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Texto de la lección, o una descripción de lo que cubre el video/documento adjunto."
            rows={3}
            disabled={busy}
            className="w-full resize-none rounded-2xl border border-[#DDE7D7] bg-[#F8FBF5] px-4 py-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[#A2AE9D] focus:border-[var(--green-500)] focus:ring-2 focus:ring-[#D2F2DE] disabled:cursor-not-allowed disabled:bg-[#F1F6EB]"
          />
        </Field>

        {/* ── Adjunto: documento o video, según el tipo de contenido ── */}
        {(needsDocument || needsVideo) && (
          <Field label={needsVideo ? 'Video (opcional)' : 'Documento (opcional)'}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#DDE7D7] bg-[#F8FBF5] transition-colors hover:border-[var(--green-400)] disabled:cursor-not-allowed"
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
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M12 3v12m0-12 4 4m-4-4-4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-medium">
                    {needsVideo ? 'Haz clic para subir un video (MP4, WEBM, MOV — máx. 200 MB)' : 'Haz clic para subir un PDF, Word o PowerPoint (máx. 20 MB)'}
                  </span>
                </span>
              )}
            </button>
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

        <Field label="Duración en minutos (opcional)">
          <Input
            type="number"
            min={1}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            placeholder="Ej. 25"
            disabled={busy}
          />
        </Field>

        {error && (
          <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[13px] text-[#BF2600]">{error}</p>
        )}

        <div className="mt-1 flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={busy}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={submitting} disabled={uploading}>
            {isEditing ? 'Guardar cambios' : 'Agregar lección'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

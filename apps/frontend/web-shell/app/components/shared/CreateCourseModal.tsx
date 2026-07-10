/* ───────────────────────────────────────────
   CreateCourseModal — alta de curso
   Título, descripción, nivel y portada. La
   imagen se sube a Cloudinary en cuanto se
   selecciona (POST /uploads/image) y solo la
   URL resultante viaja en el DTO del curso.
   ─────────────────────────────────────────── */

'use client';

import { useRef, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import type { Course } from '@/lib/types';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { Field, Input } from '@/app/components/ui/Input';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

const LEVEL_OPTIONS: { value: 'basic' | 'intermediate' | 'advanced'; label: string }[] = [
  { value: 'basic', label: 'Básico' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' },
];

interface CreateCourseModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (course: Course) => void;
}

export function CreateCourseModal({ open, onClose, onCreated }: Readonly<CreateCourseModalProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<'basic' | 'intermediate' | 'advanced'>('basic');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTitle(''); setDescription(''); setLevel('basic');
    setCoverImageUrl(null); setError(null);
  };

  const handleClose = () => { if (!submitting && !uploading) { reset(); onClose(); } };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Título y descripción son obligatorios.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const course = await api.createCourse({
        title: title.trim(),
        description: description.trim(),
        level,
        ...(coverImageUrl ? { coverImageUrl } : {}),
      });
      onCreated(course);
      reset();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const busy = uploading || submitting;

  return (
    <Modal open={open} onClose={handleClose} title="Nuevo curso" description="Se crea como borrador — puedes publicarlo después.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* ── Portada ── */}
        <Field label="Portada (opcional)">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#DDE7D7] bg-[#F8FBF5] transition-colors hover:border-[var(--green-400)] disabled:cursor-not-allowed"
          >
            {coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="Portada del curso" className="h-full w-full object-cover" />
            ) : uploading ? (
              <WaveSpinner size="sm" />
            ) : (
              <span className="flex flex-col items-center gap-1.5 text-[var(--ink-muted)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="9" cy="9" r="1.5" />
                  <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-medium">Haz clic para subir una imagen</span>
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileSelect}
            disabled={busy}
          />
        </Field>

        <Field label="Título">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. APIs REST con Node.js y Express" disabled={busy} />
        </Field>

        <Field label="Descripción">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué aprenderán tus estudiantes?"
            rows={3}
            disabled={busy}
            className="w-full resize-none rounded-2xl border border-[#DDE7D7] bg-[#F8FBF5] px-4 py-3 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[#A2AE9D] focus:border-[var(--green-500)] focus:ring-2 focus:ring-[#D2F2DE] disabled:cursor-not-allowed disabled:bg-[#F1F6EB]"
          />
        </Field>

        <Field label="Nivel">
          <div className="flex gap-2">
            {LEVEL_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={busy}
                onClick={() => setLevel(opt.value)}
                className={
                  level === opt.value
                    ? 'flex-1 rounded-xl border-[1.5px] border-[var(--green-500)] bg-[var(--green-50)] px-3 py-2 text-sm font-semibold text-[var(--green-700)]'
                    : 'flex-1 rounded-xl border-[1.5px] border-[#DDE7D7] bg-white px-3 py-2 text-sm text-[var(--ink-muted)]'
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        {error && (
          <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[13px] text-[#BF2600]">{error}</p>
        )}

        <div className="mt-1 flex justify-end gap-2.5">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={busy}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={submitting} disabled={uploading}>
            Crear curso
          </Button>
        </div>
      </form>
    </Modal>
  );
}

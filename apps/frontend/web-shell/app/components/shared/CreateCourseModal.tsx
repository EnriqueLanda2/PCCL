/* ───────────────────────────────────────────
   CreateCourseModal — alta de curso
   Título, descripción, nivel y portada. La
   imagen se sube a Cloudinary en cuanto se
   selecciona (POST /uploads/image) y solo la
   URL resultante viaja en el DTO del curso.
   ─────────────────────────────────────────── */

'use client';

import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { api, getErrorMessage } from '@/lib/api';
import type { Course } from '@/lib/types';
import { Modal } from '@/app/components/ui/Modal';
import { Field } from '@/app/components/ui/Input';
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
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTitle(''); setDescription(''); setLevel('basic');
    setCoverImageUrl(null); setIsFree(true); setPrice(''); setError(null);
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
    const numericPrice = Number(price);
    if (!isFree && (!price.trim() || Number.isNaN(numericPrice) || numericPrice <= 0)) {
      setError('Ingresa un precio válido o marca el curso como gratuito.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const course = await api.createCourse({
        title: title.trim(),
        description: description.trim(),
        level,
        isFree,
        price: isFree ? 0 : numericPrice,
        currency: 'USD',
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
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '1rem',
      bgcolor: '#F8FBF5',
      fontFamily: 'var(--font-sans)',
      color: 'var(--ink)',
      '& fieldset': { borderColor: '#DDE7D7' },
      '&:hover fieldset': { borderColor: 'var(--green-400)' },
      '&.Mui-focused fieldset': { borderColor: 'var(--green-500)', boxShadow: '0 0 0 2px #D2F2DE' },
      '&.Mui-disabled': { bgcolor: '#F1F6EB' },
    },
    '& input::placeholder, & textarea::placeholder': { color: '#A2AE9D', opacity: 1 },
  };

  return (
    <Modal open={open} onClose={handleClose} title="Nuevo curso" description="Se crea como borrador — puedes publicarlo después.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* ── Portada ── */}
        <Field label="Portada (opcional)">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            fullWidth
            sx={{
              position: 'relative',
              height: 144,
              overflow: 'hidden',
              borderRadius: '1rem',
              border: '2px dashed #DDE7D7',
              bgcolor: '#F8FBF5',
              color: 'var(--ink-muted)',
              textTransform: 'none',
              '&:hover': { borderColor: 'var(--green-400)', bgcolor: '#F8FBF5' },
            }}
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
          </Button>
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
            placeholder="¿Qué aprenderán tus estudiantes?"
            disabled={busy}
            fullWidth
            multiline
            minRows={3}
            sx={fieldSx}
          />
        </Field>

        <Field label="Nivel">
          <div className="flex gap-2">
            {LEVEL_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                disabled={busy}
                onClick={() => setLevel(opt.value)}
                variant="outlined"
                sx={pillSx(level === opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </Field>

        <Field label="Precio">
          <div className="flex gap-2">
            <Button
              disabled={busy}
              onClick={() => setIsFree(true)}
              variant="outlined"
              sx={pillSx(isFree)}
            >
              Gratuito
            </Button>
            <Button
              disabled={busy}
              onClick={() => setIsFree(false)}
              variant="outlined"
              sx={pillSx(!isFree)}
            >
              De pago
            </Button>
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
                  input: {
                    startAdornment: <InputAdornment position="start">USD $</InputAdornment>,
                  },
                }}
                sx={fieldSx}
              />
            </div>
          )}
        </Field>

        {error && (
          <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
        )}

        <div className="mt-1 flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={busy}
            sx={{ borderRadius: '999px', px: 2.5, fontFamily: 'var(--font-sans)', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={uploading || submitting}
            sx={{
              borderRadius: '999px',
              bgcolor: 'var(--green-600)',
              px: 2.5,
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--green-700)' },
            }}
          >
            {submitting ? 'Creando…' : 'Crear curso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

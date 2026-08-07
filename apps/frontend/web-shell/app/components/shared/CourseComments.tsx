/* ───────────────────────────────────────────
   CourseComments — comentarios de alumnos en un
   curso, pintados con TwitterCard del registry.
   Solo puede comentar quien está inscrito; el
   backend lo verifica, aquí solo se refleja.
   ─────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';
import type { CourseComment } from '@/lib/types';
import { TwitterCard } from '@/registry/new-york/ui/twitter-card';
import { AppButton, AppInput } from '@/app/components/ui/AppControls';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

const MAX_LENGTH = 1000;

/** "sofia.ramirez" a partir de "Sofía Ramírez" — el handle es cosmético. */
function handleFor(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '') || 'alumno';
}

export function CourseComments({ courseId, className }: Readonly<{ courseId: string; className?: string }>) {
  const [comments, setComments] = useState<CourseComment[]>([]);
  const [draft,    setDraft]    = useState('');
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setComments(await api.courseComments(courseId));
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setSending(true);
    setError(null);
    try {
      setComments(await api.createCourseComment(courseId, body));
      setDraft('');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  /* Se actualiza en local con la respuesta del servidor: no se adivina el
     conteo, se usa el que devuelve el backend. */
  const toggleLike = async (id: string) => {
    try {
      const res = await api.toggleCommentLike(id);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, likes: res.likes, likedByMe: res.likedByMe } : c)),
      );
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const remove = async (id: string) => {
    try {
      await api.deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <section className={className}>
      <h3 className="mb-1 text-[0.9375rem] font-bold text-[var(--ink)]">
        Comentarios {comments.length > 0 && <span className="text-[var(--ink-muted)]">({comments.length})</span>}
      </h3>
      <p className="mb-3 text-[0.8125rem] text-[var(--ink-muted)]">
        Comparte dudas o aportes con el resto de la clase.
      </p>

      {error && (
        <p className="mb-3 rounded-xl border-l-4 border-[var(--red-500)] bg-[#FFF1ED] px-4 py-2.5 text-[0.8125rem] text-[var(--red-600)]">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-6">
          <WaveSpinner size="md" label="Cargando comentarios…" />
        </div>
      ) : comments.length === 0 ? (
        <p className="mb-4 rounded-[1.5rem] border border-dashed border-[var(--neutral-200)] bg-[#F8FBF5] px-4 py-5 text-center text-[0.8125rem] text-[var(--ink-muted)]">
          Todavía no hay comentarios. Sé el primero en escribir.
        </p>
      ) : (
        <div className="mb-4 flex flex-col gap-3">
          {comments.map((c) => (
            <div key={c.id} className="relative">
              <TwitterCard
                author={{ name: c.authorName, handle: handleFor(c.authorName) }}
                content={c.content}
                timestamp={c.createdAt}
                likes={c.likes}
                liked={c.likedByMe}
                onLike={() => toggleLike(c.id)}
                className="w-full max-w-none rounded-[1.5rem] border-[var(--neutral-200)] bg-white p-5 shadow-none"
              />
              {c.mine && (
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label="Borrar mi comentario"
                  className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold text-[var(--ink-muted)] transition-colors hover:bg-[#FFF1ED] hover:text-[var(--red-600)]"
                >
                  Borrar
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-2 border-t border-[var(--neutral-100)] pt-4">
        <AppInput
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="Escribe un comentario…"
          multiline
          rows={4}
          aria-label="Nuevo comentario"
          sx={{ '& .MuiOutlinedInput-root': { alignItems: 'flex-start', borderRadius: '1.125rem' } }}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.6875rem] tabular-nums text-[var(--ink-muted)]">
            {draft.length}/{MAX_LENGTH}
          </span>
          <AppButton type="submit" variant="contained" loading={sending} disabled={!draft.trim()} sx={{ px: 2.4 }}>
            Publicar
          </AppButton>
        </div>
      </form>
    </section>
  );
}

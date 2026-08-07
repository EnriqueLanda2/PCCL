/* ───────────────────────────────────────────
   NotesPanel — panel de "Notas" por lección
   (video, PDF o clase en vivo), inspirado en el
   panel de notas de una vista de detalle tipo
   "Acta de entrevista": autor + fecha + texto,
   más un compositor al fondo.

   Editor enriquecido con TipTap + soporte LaTeX
   (extensión @tiptap/extension-mathematics sobre
   KaTeX) — escribe $x^2$ o $$\int_0^1 x\,dx$$ y
   se renderiza como fórmula.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Mathematics } from '@tiptap/extension-mathematics';
import 'katex/dist/katex.min.css';
import { api, getErrorMessage } from '@/lib/api';
import type { Note } from '@/lib/types';
import { StudentAvatar } from '@/app/components/shared/StudentAvatar';

const EDITOR_EXTENSIONS = [StarterKit, Mathematics];

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function currentUserEmail(): string | null {
  try {
    const raw = sessionStorage.getItem('pccl_user');
    if (!raw) return null;
    return (JSON.parse(raw) as { email?: string }).email ?? null;
  } catch {
    return null;
  }
}

function NoteItem({ note, isOwn, onDelete }: { note: Note; isOwn: boolean; onDelete: (id: string) => void }) {
  const viewer = useEditor(
    { extensions: EDITOR_EXTENSIONS, content: note.content, editable: false, immediatelyRender: false },
    [note.content],
  );

  return (
    <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--blue-50)', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <StudentAvatar userId={note.createdBy ?? ''} fullName={note.createdBy ?? 'Anónimo'} size="xs" />
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>{note.createdBy ?? 'Anónimo'}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{formatTimestamp(note.createdAt)}</span>
        {isOwn && (
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--red-600)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
          >
            Eliminar
          </button>
        )}
      </div>
      <div className="notes-panel-content">
        <EditorContent editor={viewer} />
      </div>
    </div>
  );
}

function ToolbarButton({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      style={{
        fontSize: '0.75rem', fontWeight: 600, padding: '4px 9px', borderRadius: '0.375rem',
        border: '1px solid var(--neutral-200)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        background: active ? 'var(--blue-100)' : 'var(--panel)',
        color: active ? 'var(--blue-700)' : 'var(--ink-muted)',
      }}
    >
      {label}
    </button>
  );
}

function ComposerToolbar({ editor }: { editor: Editor }) {
  return (
    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
      <ToolbarButton label="B" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolbarButton label="I" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolbarButton label="• Lista" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <ToolbarButton
        label="∑ Fórmula"
        onClick={() => editor.chain().focus().insertContent('$x^2$ ').run()}
      />
    </div>
  );
}

interface NotesPanelProps {
  lessonId: string;
  /** Ej. "Video de la clase", "Documento PDF", "Clase en vivo" — se muestra en el header */
  scopeLabel?: string;
}

export function NotesPanel({ lessonId, scopeLabel }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [error, setError] = useState('');
  const currentEmail = currentUserEmail();

  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        style: 'outline: none; min-height: 40px; font-size: 13.5px; font-family: var(--font-sans); color: var(--ink);',
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      setCanSend(!activeEditor.isEmpty);
    },
  });

  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      api.notes(lessonId)
        .then((list) => { if (alive) setNotes(list); })
        .catch(() => { if (alive) setNotes([]); })
        .finally(() => { if (alive) setLoading(false); });
    }, 0);
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [lessonId]);

  const send = async () => {
    if (!editor || editor.isEmpty || sending) return;
    setSending(true);
    setError('');
    try {
      const created = await api.createNote(lessonId, editor.getHTML());
      setNotes((prev) => [...prev, created]);
      editor.commands.clearContent();
      setCanSend(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    const prev = notes;
    setNotes((cur) => cur.filter((n) => n.id !== id));
    try {
      await api.deleteNote(id);
    } catch {
      setNotes(prev);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--neutral-100)', borderRadius: 'var(--radius-md)', background: 'var(--panel)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--neutral-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '0.9063rem', fontWeight: 600, color: 'var(--ink)' }}>
          Notas{scopeLabel ? ` · ${scopeLabel}` : ''}
        </h3>
        <span style={{ fontSize: '0.7188rem', color: 'var(--ink-muted)' }}>{notes.length} nota{notes.length === 1 ? '' : 's'}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', padding: '14px 16px', maxHeight: '22.5rem', overflowY: 'auto' }}>
        {loading ? (
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>Cargando notas…</p>
        ) : notes.length === 0 ? (
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>Aún no hay notas. Sé el primero en escribir una.</p>
        ) : (
          notes.map((note) => (
            <NoteItem key={note.id} note={note} isOwn={note.createdBy === currentEmail} onDelete={handleDelete} />
          ))
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--neutral-100)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {editor && <ComposerToolbar editor={editor} />}
        <div
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); send(); } }}
          style={{ border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)', padding: '8px 10px', background: 'var(--blue-50)' }}
        >
          <EditorContent editor={editor} />
        </div>
        {error && <p style={{ fontSize: '0.75rem', color: 'var(--red-600)' }}>{error}</p>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--ink-muted)' }}>Ctrl+Enter para enviar · soporta LaTeX ($x^2$)</span>
          <button
            type="button"
            onClick={send}
            disabled={!canSend || sending}
            style={{
              fontSize: '0.7813rem', fontWeight: 600, padding: '6px 14px', borderRadius: '0.5rem',
              border: 'none', cursor: !canSend || sending ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)',
              background: 'var(--blue-600)', color: '#fff',
              opacity: !canSend || sending ? 0.5 : 1,
            }}
          >
            {sending ? 'Enviando…' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}

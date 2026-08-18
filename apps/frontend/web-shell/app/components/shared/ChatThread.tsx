/* ───────────────────────────────────────────
   ChatThread — el hilo de conversación con AIRumbo
   (mensajes + composer), sin el "chrome" exterior
   (eso lo decide quien lo use: ChatWidget lo mete en
   una burbuja flotante o un panel inline; la página
   /learning/ai-rumbo lo mete en un panel de página
   completa junto a la lista de conversaciones).
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { api, getErrorMessage } from '@/lib/api';
import type { ChatMessage } from '@/lib/types';
import { APP_ICONS } from '@/lib/icons';
import { AiRumboIcon } from './AiRumboIcon';

/* Keyframes compartidos — un solo <style> por instancia, no uno por burbuja. */
const CHAT_KEYFRAMES = `
  @keyframes rumbo-typing-dot {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-2px); }
  }
  @keyframes rumbo-msg-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes rumbo-panel-in {
    from { opacity: 0; transform: translateY(10px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

/* Solo **negritas** y listas — lo único que de verdad usa el modelo. Nada de
   dangerouslySetInnerHTML: el texto es salida de un LLM, no confiamos en él
   como HTML, así que se arma con nodos de React. */
function parseInline(line: string, keyPrefix: string): ReactNode[] {
  return line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

/* Bloque de código estilo Notion/VSCode — fondo oscuro fijo (no depende del
   tema claro/oscuro de la app: un bloque de código gris claro se lee mal). */
function CodeBlock({ lang, code }: Readonly<{ lang: string; code: string }>) {
  return (
    <div style={{ margin: '0.375rem 0', borderRadius: '0.625rem', overflow: 'hidden', background: '#1e1f22', border: '1px solid rgba(255,255,255,0.08)' }}>
      {lang && (
        <div style={{ padding: '0.3125rem 0.75rem', fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)', textTransform: 'lowercase' }}>
          {lang}
        </div>
      )}
      <pre style={{ margin: 0, padding: '0.75rem', overflowX: 'auto' }}>
        <code style={{ fontFamily: 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)', fontSize: '0.8125rem', color: '#e4e4e7', whiteSpace: 'pre', lineHeight: 1.5 }}>
          {code}
        </code>
      </pre>
    </div>
  );
}

/* Texto plano (sin bloques de código) → párrafos, listas y **negritas**. */
function FormattedTextBlock({ text }: Readonly<{ text: string }>) {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];

  const isListLine = (l: string) => /^\s*(-|\*|\d+\.)\s+/.test(l);
  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push(
      /* Viñeta dibujada a mano: globals.css resetea list-style, así que no
         se puede depender de <ul>/<li> nativos. */
      <div key={`list-${blocks.length}`} style={{ margin: '0.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.1875rem' }}>
        {listBuffer.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', paddingLeft: '0.125rem' }}>
            <span aria-hidden style={{ flexShrink: 0, opacity: 0.6 }}>•</span>
            <span>{parseInline(item.replace(/^\s*(-|\*|\d+\.)\s+/, ''), `li-${blocks.length}-${i}`)}</span>
          </div>
        ))}
      </div>,
    );
    listBuffer = [];
  };

  lines.forEach((line, i) => {
    if (isListLine(line)) {
      listBuffer.push(line);
      return;
    }
    flushList();
    if (line.trim() === '') {
      blocks.push(<div key={`br-${i}`} style={{ height: '0.375rem' }} />);
    } else {
      blocks.push(<div key={`p-${i}`}>{parseInline(line, `p-${i}`)}</div>);
    }
  });
  flushList();

  return <>{blocks}</>;
}

/* Separa ```bloques de código``` del resto del texto antes de formatear —
   dentro de un bloque no se procesan listas ni negritas, se muestra tal cual. */
const CODE_FENCE_RE = /```(\w*)\n?([\s\S]*?)```/g;

function FormattedText({ text }: Readonly<{ text: string }>) {
  const segments: { type: 'text' | 'code'; content: string; lang?: string }[] = [];
  let lastIndex = 0;
  CODE_FENCE_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = CODE_FENCE_RE.exec(text))) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'code', content: match[2].replace(/\n$/, ''), lang: match[1] });
    lastIndex = CODE_FENCE_RE.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'code'
          ? <CodeBlock key={`code-${i}`} lang={seg.lang ?? ''} code={seg.content} />
          : <FormattedTextBlock key={`text-${i}`} text={seg.content} />,
      )}
    </>
  );
}

function Avatar() {
  return (
    <span
      style={{
        width: '1.625rem', height: '1.625rem', flexShrink: 0, borderRadius: '999px',
        background: 'linear-gradient(135deg, var(--green-500), var(--green-700))', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <AiRumboIcon size={14} />
    </span>
  );
}

function Bubble({ message, onEditUser }: Readonly<{ message: ChatMessage; onEditUser: (id: string, text: string) => void }>) {
  const { id, role, content, createdAt } = message;
  const isUser = role === 'user';
  return (
    <div
      className="group"
      style={{
        display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end', gap: '0.375rem', animation: 'rumbo-msg-in 0.22s ease-out',
      }}
    >
      {!isUser && <Avatar />}
      {isUser && (
        <button
          type="button"
          onClick={() => onEditUser(id, content)}
          aria-label="Editar mensaje"
          className="opacity-0 group-hover:opacity-100"
          style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)',
            display: 'flex', padding: '0.25rem', transition: 'opacity 0.15s ease',
          }}
        >
          <Icon icon={APP_ICONS.edit} width={13} height={13} />
        </button>
      )}
      <div
        style={{
          maxWidth: '78%',
          padding: '0.625rem 0.875rem',
          /* "colita" hacia el que habló, como en apps de chat reales */
          borderRadius: isUser ? '1.125rem 1.125rem 0.25rem 1.125rem' : '1.125rem 1.125rem 1.125rem 0.25rem',
          background: isUser ? 'var(--blue-600)' : 'var(--blue-50)',
          color: isUser ? '#fff' : 'var(--ink)',
          fontSize: '0.8438rem',
          lineHeight: 1.45,
        }}
      >
        {isUser ? <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div> : <FormattedText text={content} />}
        <div style={{ fontSize: '0.625rem', marginTop: '0.25rem', opacity: 0.7 }}>
          {formatTimestamp(createdAt)}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.375rem', animation: 'rumbo-msg-in 0.22s ease-out' }}>
      <Avatar />
      <div style={{ display: 'flex', gap: '0.25rem', padding: '0.75rem 1rem', borderRadius: '1.125rem 1.125rem 1.125rem 0.25rem', background: 'var(--blue-50)' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: '0.375rem', height: '0.375rem', borderRadius: '999px', background: 'var(--ink-muted)',
              animation: 'rumbo-typing-dot 1.1s ease-in-out infinite',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export interface ChatThreadProps {
  /** Si se pasa, AIRumbo usa el contenido de esa lección como contexto — y
   *  se usa para encontrar/crear la conversación cuando no se pasa
   *  conversationId explícito. */
  lessonId?: string;
  /** Conversación exacta a mostrar. Si se omite y `autoResume` es true
   *  (default), se busca la más reciente que coincida con `lessonId`; si
   *  `autoResume` es false, siempre arranca una conversación nueva vacía. */
  conversationId?: string;
  autoResume?: boolean;
  /** Se llama con el conversationId real en cuanto se crea (primer envío de
   *  una conversación nueva) — quien liste conversaciones lo usa para
   *  refrescar su lista y seleccionar la nueva fila. */
  onConversationCreated?: (id: string) => void;
  title?: string;
  subtitle?: string;
  /** Si se pasa, muestra un botón de cerrar en el header (uso: widget flotante). */
  onClose?: () => void;
  /** 'panel' (default) = fondo verde claro en el header, para widget/página.
   *  'flush' = header sin fondo, para cuando el contenedor ya trae su propio marco. */
  headerStyle?: 'panel' | 'flush';
  /** false oculta el botón "nueva conversación" del header — la página
   *  completa ya tiene el suyo en el panel de conversaciones. Default true. */
  showNewConversationButton?: boolean;
  /** Se llama cada vez que cambia la cantidad de mensajes — la página con
   *  lista de conversaciones lo usa para refrescar el preview del último
   *  mensaje sin tener que re-pedir todo el listado. */
  onActivity?: () => void;
  /** Si se pasa, muestra un botón para abrir la vista de página completa
   *  (/learning/ai-rumbo) — se usa en el widget flotante, no en la página
   *  misma (ahí ya estás en la vista amplia). */
  expandHref?: string;
  /** Permite mandar el bloque identidad/título al extremo derecho cuando
   *  la página coloca otros controles a la izquierda del header. */
  titleAlign?: 'left' | 'right';
}

const TYPEWRITER_CHARS_PER_TICK = 2;
const TYPEWRITER_TICK_MS = 16;

export function ChatThread({
  lessonId, conversationId, autoResume = true, onConversationCreated,
  title = 'AIRumbo', subtitle, onClose, headerStyle = 'panel', showNewConversationButton = true,
  onActivity, expandHref, titleAlign = 'left',
}: Readonly<ChatThreadProps>) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(conversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typewriterTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const busy = sending || typing;

  useEffect(() => {
    let alive = true;
    setLoaded(false);

    const load = async () => {
      let cid = conversationId;
      if (!cid && autoResume) {
        try {
          const list = await api.chatConversations();
          cid = list.find((c) => (c.lessonId ?? null) === (lessonId ?? null))?.id;
        } catch {
          cid = undefined;
        }
      }
      if (!alive) return;
      setActiveConversationId(cid);
      if (cid) {
        try {
          const history = await api.chatHistory(cid);
          if (alive) setMessages(history);
        } catch {
          if (alive) setMessages([]);
        }
      } else {
        setMessages([]);
      }
    };

    load().finally(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, lessonId, autoResume]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    onActivity?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, sending]);

  /* Se limpia el intervalo del efecto de "escribiendo" si el componente se
     desmonta a medio revelar texto (ej. el alumno cambia de conversación). */
  useEffect(() => () => {
    if (typewriterTimer.current) clearInterval(typewriterTimer.current);
  }, []);

  const revealReply = (replyId: string, fullText: string) => {
    if (typewriterTimer.current) clearInterval(typewriterTimer.current);
    let shown = 0;
    setTyping(true);
    typewriterTimer.current = setInterval(() => {
      shown += TYPEWRITER_CHARS_PER_TICK;
      setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content: fullText.slice(0, shown) } : m)));
      if (shown >= fullText.length) {
        if (typewriterTimer.current) clearInterval(typewriterTimer.current);
        typewriterTimer.current = null;
        setTyping(false);
      }
    }, TYPEWRITER_TICK_MS);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setSending(true);
    setError('');

    /* Editar de verdad: borra ese mensaje y todo lo posterior (la respuesta
       vieja incluida) antes de mandar el texto editado, para que la
       respuesta se regenere en su lugar en vez de apilarse aparte. */
    if (editingId) {
      const targetId = editingId;
      try {
        await api.deleteChatMessagesFrom(targetId);
      } catch (err) {
        setSending(false);
        setError(getErrorMessage(err));
        return;
      }
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === targetId);
        return idx === -1 ? prev : prev.slice(0, idx);
      });
      setEditingId(null);
    }

    const optimistic: ChatMessage = {
      id: `pending-${Date.now()}`,
      lessonId: lessonId ?? null,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    try {
      const wasNew = !activeConversationId;
      const { reply, conversationId: newId } = await api.sendChatMessage(text, activeConversationId, lessonId);
      if (wasNew) {
        setActiveConversationId(newId);
        onConversationCreated?.(newId);
      }
      const replyId = `reply-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: replyId, lessonId: lessonId ?? null, role: 'assistant', content: '', createdAt: new Date().toISOString() },
      ]);
      revealReply(replyId, reply);
    } catch (err) {
      /* Si falla, se quita la burbuja optimista y el texto regresa al
         cuadro de entrada — el alumno puede reenviarlo tal cual (Enter) o
         editarlo antes, en vez de perderlo y tener que volver a escribirlo. */
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(text);
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const editMessage = (id: string, text: string) => {
    setEditingId(id);
    setInput(text);
    inputRef.current?.focus();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setInput('');
  };

  /* "Nueva conversación" ya NO borra nada del servidor — solo suelta el
     conversationId activo para que el próximo envío cree una fila aparte.
     Las conversaciones previas se quedan intactas (antes este método las
     pisaba porque todo vivía en el mismo bucket "general"). */
  const newConversation = () => {
    if (busy) return;
    if (typewriterTimer.current) clearInterval(typewriterTimer.current);
    setError('');
    setInput('');
    setEditingId(null);
    setActiveConversationId(undefined);
    setMessages([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <style>{CHAT_KEYFRAMES}</style>

      <div
        style={{
          padding: headerStyle === 'panel' ? '1rem 1.125rem' : '28px 18px',
          borderBottom: '1px solid var(--neutral-100)', display: 'flex', alignItems: 'center', gap: '0.625rem',
          justifyContent: titleAlign === 'right' ? 'flex-end' : 'flex-start',
          background: headerStyle === 'panel' ? 'var(--green-50)' : undefined,
          flexShrink: 0,
        }}
      >
        {(title || subtitle) && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0, flex: titleAlign === 'right' ? '0 1 auto' : 1 }}>
              <Avatar />
              <div style={{ minWidth: 0 }}>
                {title && <h3 style={{ fontSize: '0.9063rem', fontWeight: 600, color: 'var(--ink)' }}>{title}</h3>}
                {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{subtitle}</p>}
              </div>
            </div>
            {titleAlign === 'right' && <div style={{ flex: 1 }} />}
          </>
        )}
        {showNewConversationButton && (
          <button
            type="button"
            onClick={newConversation}
            disabled={busy}
            aria-label="Nueva conversación"
            title="Nueva conversación"
            style={{
              background: 'none', border: 'none', color: 'var(--ink-muted)', display: 'flex', padding: '0.25rem',
              cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.4 : 1,
            }}
          >
            <Icon icon={APP_ICONS.newChat} width={19} height={19} />
          </button>
        )}
        {expandHref && (
          <button
            type="button"
            onClick={() => router.push(expandHref)}
            aria-label="Ver en pantalla completa"
            title="Ver en pantalla completa"
            style={{ background: 'none', border: 'none', color: 'var(--ink-muted)', display: 'flex', padding: '0.25rem', cursor: 'pointer' }}
          >
            <Icon icon={APP_ICONS.chatExpand} width={17} height={17} />
          </button>
        )}
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Cerrar chat" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', display: 'flex', padding: '0.25rem' }}>
            <Icon icon={APP_ICONS.close} width={20} height={20} />
          </button>
        )}
      </div>

      <div ref={listRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.625rem', padding: '14px 16px' }}>
        {!loaded ? (
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>Cargando…</p>
        ) : messages.length === 0 ? (
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>
            {lessonId ? '¡Hola! 👋 Pregúntame algo sobre esta lección.' : '¡Hola! 👋 Soy AIRumbo, pregúntame lo que necesites.'}
          </p>
        ) : (
          messages.map((m) => <Bubble key={m.id} message={m} onEditUser={editMessage} />)
        )}
        {sending && <TypingDots />}
      </div>

      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', flexShrink: 0 }}>
        {editingId && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.375rem 0.75rem', borderRadius: '0.625rem', background: 'var(--blue-50)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--blue-700)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Icon icon={APP_ICONS.edit} width={12} height={12} /> Editando mensaje
            </span>
            <button type="button" onClick={cancelEdit} aria-label="Cancelar edición" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue-700)', display: 'flex' }}>
              <Icon icon={APP_ICONS.close} width={14} height={14} />
            </button>
          </div>
        )}
        {error && <p style={{ fontSize: '0.75rem', color: 'var(--red-600)', padding: '0 0.25rem' }}>{error}</p>}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            borderRadius: '999px', border: '1px solid var(--neutral-200)', background: 'var(--panel)',
            padding: '0.375rem 0.375rem 0.375rem 1rem',
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); } }}
            placeholder="Escribe tu pregunta…"
            disabled={busy}
            style={{
              flex: 1, fontSize: '0.8438rem', border: 'none', background: 'transparent', color: 'var(--ink)',
              fontFamily: 'var(--font-sans)', outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={() => void send()}
            disabled={busy || !input.trim()}
            aria-label="Enviar"
            style={{
              width: '2.25rem', height: '2.25rem', flexShrink: 0, borderRadius: '999px', border: 'none',
              background: 'var(--green-600)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: busy || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: busy || !input.trim() ? 0.5 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            <Icon icon={APP_ICONS.send} width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export { CHAT_KEYFRAMES };

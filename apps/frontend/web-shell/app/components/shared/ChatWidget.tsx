/* ───────────────────────────────────────────
   ChatWidget — chatbot "AIRumbo" (IA local vía Ollama)
   Dos modos:
     · floating (default) — burbuja fija abajo a la
       derecha, disponible en toda la app. Sin lessonId:
       chat general.
     · inline — panel estático, se usa junto al
       NotesPanel dentro de una lección para que AIRumbo
       responda con el contenido de esa lección como
       contexto.
   El hilo de conversación en sí (mensajes + composer)
   vive en ChatThread — este componente solo decide el
   "chrome" exterior (burbuja flotante vs panel fijo).
   Ver también /learning/ai-rumbo para la vista de
   página completa con lista de conversaciones.
   ─────────────────────────────────────────── */

'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { ChatThread } from './ChatThread';
import { APP_ICONS } from '@/lib/icons';
import { appRoutes } from '@/lib/routes';

interface ChatWidgetProps {
  /** Si se pasa, AIRumbo usa el contenido de esa lección como contexto. */
  lessonId?: string;
  variant?: 'floating' | 'inline';
}

export function ChatWidget({ lessonId, variant = 'floating' }: Readonly<ChatWidgetProps>) {
  const isInline = variant === 'inline';
  const [open, setOpen] = useState(isInline);

  if (isInline) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '26.25rem', border: '1px solid var(--neutral-100)', borderRadius: '1.25rem', background: 'var(--panel)', overflow: 'hidden', boxShadow: '0 2px 10px rgba(23,50,77,0.05)' }}>
        <ChatThread lessonId={lessonId} subtitle="Pregúntame sobre esta lección" />
      </div>
    );
  }

  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed', bottom: '10.5rem', right: '1.5rem', zIndex: 1300,
            width: '22.5rem', maxWidth: 'calc(100vw - 2rem)', height: '30rem', maxHeight: 'calc(100vh - 8rem)',
            display: 'flex', flexDirection: 'column',
            border: '1px solid var(--neutral-100)', borderRadius: '1.5rem', background: 'var(--panel)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.18)', overflow: 'hidden',
            animation: 'rumbo-panel-in 0.18s ease-out',
          }}
        >
          <ChatThread lessonId={lessonId} onClose={() => setOpen(false)} expandHref={appRoutes.aiRumbo} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar chat de AIRumbo' : 'Abrir chat de AIRumbo'}
        style={{
          position: 'fixed', bottom: '6.5rem', right: '1.5rem', zIndex: 1300,
          width: '3.375rem', height: '3.375rem', borderRadius: '999px', border: 'none',
          background: 'var(--green-600)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(31,154,75,0.35)', cursor: 'pointer',
        }}
      >
        <Icon icon={open ? APP_ICONS.close : APP_ICONS.chat} width={24} height={24} />
      </button>
    </>
  );
}

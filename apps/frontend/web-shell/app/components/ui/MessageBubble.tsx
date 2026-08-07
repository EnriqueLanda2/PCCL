/* ───────────────────────────────────────────
   MessageBubble — burbuja de chat estilo iOS.
   `sent` = mensajes propios (derecha, verde Rumbo);
   `received` = de otros participantes (izquierda,
   gris). La cola de la burbuja se dibuja con dos
   pseudo-capas en el ángulo inferior.
   ─────────────────────────────────────────── */

import { cn } from '@/lib/cn';

export interface MessageBubbleProps {
  message: string;
  variant?: 'sent' | 'received';
  /** Autor — solo se pinta en `received`, para distinguir participantes */
  author?: string;
  /** Hora corta, ej. "11:18" */
  timestamp?: string;
  className?: string;
}

export function MessageBubble({
  message,
  variant = 'received',
  author,
  timestamp,
  className,
}: Readonly<MessageBubbleProps>) {
  const sent = variant === 'sent';

  return (
    <div className={cn('flex max-w-full flex-col gap-0.5', sent ? 'items-end' : 'items-start', className)}>
      {!sent && author && (
        <span className="px-3 text-[0.6875rem] font-semibold text-[var(--ink-muted)]">{author}</span>
      )}

      <div
        className={cn(
          'relative max-w-full rounded-[1.125rem] px-3.5 py-2 text-[0.875rem] leading-snug',
          /* `break-words` evita que una URL larga desborde el panel */
          'whitespace-pre-wrap break-words',
          sent
            ? 'rounded-br-[0.375rem] bg-[var(--green-600)] text-white'
            : 'rounded-bl-[0.375rem] bg-[var(--neutral-100)] text-[var(--ink)]',
        )}
      >
        {message}
      </div>

      {timestamp && (
        <span className="px-3 text-[0.625rem] tabular-nums text-[var(--ink-muted)]">{timestamp}</span>
      )}
    </div>
  );
}

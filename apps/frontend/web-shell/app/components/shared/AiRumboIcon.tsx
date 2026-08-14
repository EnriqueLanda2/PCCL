/* ───────────────────────────────────────────
   AiRumboIcon — el ícono "fantasma" de AIRumbo.
   Mismo trazo que el ítem del sidebar; se reutiliza
   aquí para que aparezca igual junto al nombre en el
   header del chat (widget flotante y vista de página
   completa) y en el título de /learning/ai-rumbo.
   ─────────────────────────────────────────── */

export function AiRumboIcon({ size = 16, className }: Readonly<{ size?: number; className?: string }>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width={size} height={size} className={className}>
      <path
        d="M12 3a4 4 0 0 0-4 4v1a5 5 0 0 0-3 4.58V17a2 2 0 0 0 2 2h1l2 3 2-3h4l2 3 2-3h1a2 2 0 0 0 2-2v-4.42A5 5 0 0 0 16 8V7a4 4 0 0 0-4-4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

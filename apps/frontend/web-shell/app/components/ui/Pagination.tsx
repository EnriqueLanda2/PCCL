/* ───────────────────────────────────────────
   Pagination — control "← Anterior / Página X de Y / Siguiente →"
   Extraído del patrón inline usado en app/modules/audit/page.tsx
   para reutilizarlo en listas paginadas (ej. grilla de estudiantes).
   ─────────────────────────────────────────── */

import type React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    height: '36px',
    padding: '0 14px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--neutral-200)',
    background: 'var(--panel)',
    color: disabled ? 'var(--neutral-300)' : 'var(--ink)',
    fontSize: '13px',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'var(--font-sans)',
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        style={btnStyle(page === 1)}
      >
        ← Anterior
      </button>
      <span style={{ fontSize: '13px', color: 'var(--ink-muted)', padding: '0 8px' }}>
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        style={btnStyle(page === totalPages)}
      >
        Siguiente →
      </button>
    </div>
  );
}

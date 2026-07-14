/* ───────────────────────────────────────────
   StudentSummaryCard / StudentSummaryDetailPanel
   Tarjeta de alumno con avatar 3D procedural
   (PersonAvatar3D — muñeco humano casual, gira
   solo) y panel lateral con detalle (mismo
   avatar en grande, interactivo con OrbitControls).
   Vista genérica compartida entre "Progreso de
   estudiantes" (riesgo por curso) e
   "Inscripciones" (estado por curso) para no
   duplicar el layout.
   ─────────────────────────────────────────── */

'use client';

import { useEffect } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Badge, type BadgeVariant } from '@/app/components/ui/Badge';
import { ProgressBar } from '@/app/components/ui/ProgressBar';
import { PersonAvatar3D } from '@/app/components/shared/PersonAvatar3D';

export interface StudentSummaryEntry {
  key: string;
  title: string;
  subtitle?: string;
  badge?: { label: string; variant: BadgeVariant };
  pct: number;
  /** Línea de alerta real (ej. "12 días sin actividad") — solo si hay dato real que la respalde. */
  warning?: string;
}

export interface StudentCardSummary {
  userId: string;
  fullName: string;
  headerValue: string;
  /** % que llena la mini barra bajo el header (0-100) */
  headerProgressPct: number;
  /** null → no se muestra pill (reservado para cuando algo amerita atención) */
  headerBadge: { label: string; variant: BadgeVariant } | null;
  /** Banner destacado en el panel lateral, solo cuando hay algo real que reportar */
  riskBanner?: { title: string; message: string; variant: 'yellow' | 'red' };
  entries: StudentSummaryEntry[];
}

function progressColor(pct: number): 'green' | 'yellow' | undefined {
  if (pct >= 65) return 'green';
  if (pct >= 35) return 'yellow';
  return undefined;
}

/* ── Card ── */
export function StudentSummaryCard({ student, onOpen }: { student: StudentCardSummary; onOpen: (s: StudentCardSummary) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(student)}
      style={{
        padding: '10px 8px', borderRadius: 'var(--radius-lg)', border: 'none',
        background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '8px', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'center',
        transition: 'transform 150ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: 700,
            color: student.headerBadge?.variant === 'red' ? 'var(--red-600)' : student.headerBadge?.variant === 'yellow' ? 'var(--yellow-600)' : 'var(--green-600)',
          }}>
            {student.headerValue}
          </span>
          {student.headerBadge && <Badge variant={student.headerBadge.variant}>{student.headerBadge.label}</Badge>}
        </div>
        <ProgressBar value={student.headerProgressPct} color={progressColor(student.headerProgressPct)} size="sm" style={{ width: '100px' }} />
        <span style={{ fontSize: '11px', color: 'var(--neutral-300)', lineHeight: 1 }}>⌄</span>
      </div>

      <PersonAvatar3D userId={student.userId} size={92} />

      <div>
        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>{student.fullName}</div>
        <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)', marginTop: '2px' }}>
          {student.entries.length} curso{student.entries.length === 1 ? '' : 's'} · {student.entries[0]?.title}
          {student.entries.length > 1 ? ` +${student.entries.length - 1}` : ''}
        </div>
      </div>
    </button>
  );
}

/* ── Side detail panel ── */
export function StudentSummaryDetailPanel({ student, entriesLabel = 'Sus cursos', onClose }: {
  student: StudentCardSummary;
  entriesLabel?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'flex-end' }}>
      <button
        type="button"
        aria-label="Cerrar panel"
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,32,0.45)', border: 'none', cursor: 'pointer' }}
      />
      <div style={{
        position: 'relative', width: 'min(400px, 100vw)', height: '100%', background: 'var(--panel)',
        boxShadow: '-16px 0 40px rgba(23,50,77,0.18)', overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--neutral-200)', background: 'var(--panel)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)' }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--neutral-100)' }}>
          <PersonAvatar3D userId={student.userId} size={180} height={280} interactive />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '19px', color: 'var(--ink)' }}>{student.fullName}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '2px' }}>
              {student.entries.length} curso{student.entries.length === 1 ? '' : 's'} · {student.headerValue} global
            </div>
          </div>
          <p style={{ fontSize: '10.5px', color: 'var(--neutral-300)' }}>Arrastra para rotar</p>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {student.riskBanner && (
            <Card variant={student.riskBanner.variant === 'red' ? 'danger' : 'warning'} padding="tight">
              <p style={{
                fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                color: student.riskBanner.variant === 'red' ? 'var(--red-600)' : 'var(--yellow-600)', marginBottom: '4px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                ⚠ {student.riskBanner.title}
              </p>
              <p style={{ fontSize: '12.5px', color: 'var(--ink)', lineHeight: 1.5 }}>{student.riskBanner.message}</p>
            </Card>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              {entriesLabel}
            </p>
            {student.entries.map((entry) => (
              <Card key={entry.key} padding="tight">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.title}
                    </div>
                    {entry.subtitle && (
                      <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)' }}>{entry.subtitle}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {entry.badge && <Badge variant={entry.badge.variant}>{entry.badge.label}</Badge>}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: entry.pct >= 65 ? 'var(--green-600)' : entry.pct >= 35 ? 'var(--yellow-600)' : 'var(--red-600)' }}>
                      {entry.pct}%
                    </span>
                  </div>
                </div>
                <ProgressBar value={entry.pct} color={progressColor(entry.pct)} />
                {entry.warning && (
                  <p style={{ fontSize: '11.5px', color: 'var(--red-600)', marginTop: '6px' }}>⚠ {entry.warning}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   StudentSummaryCard / StudentSummaryDetailPanel

   Tarjeta de alumno y su panel lateral de detalle.
   Ambos pintan el avatar con `StudentAvatar`: en la
   tarjeta como retrato de rostro y hombros, y en el
   panel como figura de cuerpo entero, donde hay
   sitio para ver postura y ropa.

   Vista genérica compartida entre "Progreso de
   estudiantes" (riesgo por curso) e "Inscripciones"
   (estado por curso) para no duplicar el layout.
   ─────────────────────────────────────────── */

'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Badge, type BadgeVariant } from '@/app/components/ui/Badge';
import { ProgressBar } from '@/app/components/ui/ProgressBar';
import { StudentAvatar } from '@/app/components/shared/StudentAvatar';

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
  /** Avatar publicado por el alumno. Si falta, se usa el retrato de la galería. */
  avatarUrl?: string | null;
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

function AvatarStage({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return (
    <div style={{
      position: 'relative',
      width: compact ? 112 : 240,
      height: compact ? 146 : 310,
      display: 'grid',
      placeItems: 'center',
      borderRadius: compact ? 28 : 36,
      background: 'radial-gradient(circle at 50% 16%, rgba(255,255,255,0.95), rgba(229,242,226,0.72) 46%, rgba(208,225,203,0.45) 100%)',
      boxShadow: compact ? '0 18px 42px rgba(31, 66, 47, 0.11)' : '0 24px 64px rgba(31, 66, 47, 0.16)',
      border: '1px solid rgba(212, 226, 207, 0.9)',
      overflow: 'hidden',
    }}>
      <span aria-hidden="true" style={{
        position: 'absolute',
        bottom: compact ? 16 : 24,
        width: compact ? 72 : 142,
        height: compact ? 14 : 24,
        borderRadius: '50%',
        background: 'rgba(38, 54, 45, 0.13)',
        filter: 'blur(4px)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
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
        gap: '0.5rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'center',
        transition: 'transform 150ms',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{
            fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', fontWeight: 700,
            color: student.headerBadge?.variant === 'red' ? 'var(--red-600)' : student.headerBadge?.variant === 'yellow' ? 'var(--yellow-600)' : 'var(--green-600)',
          }}>
            {student.headerValue}
          </span>
          {student.headerBadge && <Badge variant={student.headerBadge.variant}>{student.headerBadge.label}</Badge>}
        </div>
        <ProgressBar value={student.headerProgressPct} color={progressColor(student.headerProgressPct)} size="sm" style={{ width: '6.25rem' }} />
        <span style={{ fontSize: '0.6875rem', color: 'var(--neutral-300)', lineHeight: 1 }}>⌄</span>
      </div>

      <AvatarStage compact>
        <StudentAvatar
          userId={student.userId}
          fullName={student.fullName}
          avatarUrl={student.avatarUrl}
          size="xl"
        />
      </AvatarStage>

      <div>
        <div style={{ fontSize: '0.8438rem', fontWeight: 600, color: 'var(--ink)' }}>{student.fullName}</div>
        <div style={{ fontSize: '0.7188rem', color: 'var(--ink-muted)', marginTop: '2px' }}>
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
            style={{ width: '1.875rem', height: '1.875rem', borderRadius: '50%', border: '1px solid var(--neutral-200)', background: 'var(--panel)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)' }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem', borderBottom: '1px solid var(--neutral-100)' }}>
          <AvatarStage>
            {/* Panel de detalle: aquí sí hay sitio para el cuerpo entero, que
                es donde se aprecian postura y ropa. */}
            <StudentAvatar
              userId={student.userId}
              fullName={student.fullName}
              avatarUrl={student.avatarUrl}
              size="2xl"
              shape="figure"
            />
          </AvatarStage>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1875rem', color: 'var(--ink)' }}>{student.fullName}</div>
            <div style={{ fontSize: '0.7813rem', color: 'var(--ink-muted)', marginTop: '2px' }}>
              {student.entries.length} curso{student.entries.length === 1 ? '' : 's'} · {student.headerValue} global
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {student.riskBanner && (
            <Card variant={student.riskBanner.variant === 'red' ? 'danger' : 'warning'} padding="tight">
              <p style={{
                fontSize: '0.7188rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                color: student.riskBanner.variant === 'red' ? 'var(--red-600)' : 'var(--yellow-600)', marginBottom: '0.25rem',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}>
                ⚠ {student.riskBanner.title}
              </p>
              <p style={{ fontSize: '0.7813rem', color: 'var(--ink)', lineHeight: 1.5 }}>{student.riskBanner.message}</p>
            </Card>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
              {entriesLabel}
            </p>
            {student.entries.map((entry) => (
              <Card key={entry.key} padding="tight">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem', gap: '0.5rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.8438rem', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.title}
                    </div>
                    {entry.subtitle && (
                      <div style={{ fontSize: '0.7188rem', color: 'var(--ink-muted)' }}>{entry.subtitle}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    {entry.badge && <Badge variant={entry.badge.variant}>{entry.badge.label}</Badge>}
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: entry.pct >= 65 ? 'var(--green-600)' : entry.pct >= 35 ? 'var(--yellow-600)' : 'var(--red-600)' }}>
                      {entry.pct}%
                    </span>
                  </div>
                </div>
                <ProgressBar value={entry.pct} color={progressColor(entry.pct)} />
                {entry.warning && (
                  <p style={{ fontSize: '0.7188rem', color: 'var(--red-600)', marginTop: '0.375rem' }}>⚠ {entry.warning}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

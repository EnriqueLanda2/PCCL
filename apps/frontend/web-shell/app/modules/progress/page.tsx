/* ───────────────────────────────────────────
   Progress Page — Progreso de estudiantes
   Grilla de tarjetas por alumno (retrato de la
   galería o su avatar publicado) · badge de riesgo ·
   paginado de 12 · panel lateral con detalle de sus
   inscripciones reales. Solo alumnos activos.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { api } from '@/lib/api';
import type { Inscription, Progress } from '@/lib/types';
import {
  assessInscription,
  assessStudent,
  riskMessage,
  type CourseRisk,
  type StudentRiskSummary,
} from '@/lib/studentRisk';
import { AppButton, AppInput, AppSelect } from '@/app/components/ui/AppControls';
import { DEFAULT_PAGE_SIZE, Pagination } from '@/app/components/ui/Pagination';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { StudentSummaryCard, StudentSummaryDetailPanel, type StudentCardSummary } from '@/app/components/shared/StudentSummaryCard';
import { APP_ICONS } from '@/lib/icons';

const PAGE_SIZE = DEFAULT_PAGE_SIZE;

interface CourseProgress {
  inscriptionId: string;
  title: string;
  category?: string;
  pct: number;
  lastAccessAt: string | null;
  /** Situación de ESTE curso, no del alumno. */
  risk: CourseRisk;
  riskReason: string | null;
}

const INACTIVITY_WARNING_DAYS = 7;

function daysSince(iso: string | null, now: number): number | null {
  if (!iso) return null;
  return Math.floor((now - new Date(iso).getTime()) / 86400000);
}

interface StudentSummary {
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
  avgProgress: number;
  risk: StudentRiskSummary;
  courses: CourseProgress[];
  /** Inscripciones crudas: las reglas de riesgo se evalúan sobre ellas. */
  inscriptions: Inscription[];
  lastAccessAt: string | null;
}

/* Solo dos estados, y ambos significan algo concreto y accionable. La escala
   anterior (bajo/medio/alto) salía del promedio de avance, que ya no es el
   criterio: un alumno con poco avance en un curso permanente no está en riesgo
   de nada. */
const RISK_META: Record<Exclude<CourseRisk, 'none'>, { label: string; variant: 'yellow' | 'red' }> = {
  'at-risk':   { label: 'EN RIESGO',  variant: 'yellow' },
  abandoned:   { label: 'ABANDONÓ',   variant: 'red'    },
};

function groupByStudent(items: Progress[], now: number): StudentSummary[] {
  const map = new Map<string, StudentSummary>();
  for (const p of items) {
    const user = p.inscription?.user;
    if (!user) continue; // sin usuario resuelto (registro huérfano) — se omite
    /* Solo alumnos con la cuenta activa. Las bajas conservan su historial de
       progreso en la base, pero no deben aparecer en el seguimiento: inflan los
       totales y no hay nada que hacer con ellos. */
    if (user.active === false) continue;
    /* El riesgo se evalúa sobre la inscripción, no sobre el registro de
       progreso: las reglas dependen del tipo de acceso y de la fecha de compra,
       que viven ahí. */
    const assessment = assessInscription(p.inscription!, now);
    const course: CourseProgress = {
      inscriptionId: p.inscription?.id ?? p.id,
      title: p.inscription?.course?.title ?? 'Curso sin título',
      category: p.inscription?.course?.category,
      // progressPercentage llega como Decimal serializado (string) desde Prisma —
      // Number() evita que el reduce de más abajo concatene strings en vez de sumar.
      pct: Number(p.progressPercentage),
      lastAccessAt: p.lastAccessAt ?? null,
      risk: assessment.risk,
      riskReason: assessment.reason,
    };
    const existing = map.get(user.id);
    if (existing) {
      existing.courses.push(course);
      existing.inscriptions.push(p.inscription!);
      if (p.lastAccessAt && (!existing.lastAccessAt || p.lastAccessAt > existing.lastAccessAt)) {
        existing.lastAccessAt = p.lastAccessAt;
      }
    } else {
      map.set(user.id, {
        userId: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl ?? null,
        courses: [course],
        inscriptions: [p.inscription!],
        lastAccessAt: p.lastAccessAt ?? null,
        avgProgress: 0,
        risk: { level: 'none', atRisk: [], abandoned: [] },
      });
    }
  }
  const list = Array.from(map.values());
  for (const s of list) {
    s.avgProgress = Math.round(s.courses.reduce((sum, c) => sum + c.pct, 0) / s.courses.length);
    s.risk = assessStudent(s.inscriptions, now);
  }
  return list;
}

/** Adapta un StudentSummary (dominio de progreso) a la vista de tarjeta genérica. */
function toCardSummary(s: StudentSummary, now: number): StudentCardSummary {
  const entries = s.courses.map((c) => {
    const inactiveDays = daysSince(c.lastAccessAt, now);
    const inactivity = inactiveDays !== null && inactiveDays >= INACTIVITY_WARNING_DAYS
      ? `${inactiveDays} días sin actividad`
      : null;
    return {
      key: c.inscriptionId,
      title: c.title,
      subtitle: c.category,
      pct: c.pct,
      /* El motivo del riesgo va en la propia fila del curso: es donde el
         profesor mira para saber en cuál intervenir. */
      badge: c.risk === 'none' ? undefined : RISK_META[c.risk],
      warning: c.riskReason ?? inactivity ?? undefined,
    };
  });

  const message = riskMessage(s.risk);
  const riskBanner: StudentCardSummary['riskBanner'] = message
    ? {
        title: s.risk.level === 'abandoned' ? 'Mensualidad dada de baja' : 'Riesgo de abandono',
        message,
        variant: s.risk.level === 'abandoned' ? 'red' : 'yellow',
      }
    : undefined;

  return {
    userId: s.userId,
    fullName: s.fullName,
    avatarUrl: s.avatarUrl,
    headerValue: `${s.avgProgress}%`,
    headerProgressPct: s.avgProgress,
    headerBadge: s.risk.level === 'none' ? null : RISK_META[s.risk.level],
    riskBanner,
    entries,
  };
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div style={{ padding: '1.125rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--neutral-100)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem' }}>
      <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', background: 'var(--neutral-100)' }} />
      <div style={{ height: '0.8125rem', width: '70%', borderRadius: '0.375rem', background: 'var(--neutral-100)' }} />
      <div style={{ height: '0.625rem', width: '50%', borderRadius: '0.375rem', background: 'var(--neutral-100)' }} />
    </div>
  );
}

export default function ProgressPage() {
  const [progressItems, setProgressItems] = useState<Progress[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [riskFilter,    setRiskFilter]    = useState<'all' | Exclude<CourseRisk, 'none'>>('all');
  const [sortBy,        setSortBy]        = useState<'progress' | 'name' | 'access'>('progress');
  const [page,          setPage]          = useState(1);
  const [selected,      setSelected]      = useState<StudentSummary | null>(null);
  const [now]           = useState(() => Date.now());

  useEffect(() => {
    let alive = true;
    api.progress()
      .then((items) => { if (alive) setProgressItems(items); })
      .catch(() => { if (alive) setProgressItems([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const students = useMemo(() => groupByStudent(progressItems, now), [progressItems, now]);

  /* ── Filtered + sorted ── */
  const filtered = useMemo(() => {
    let list = [...students];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.courses.some((c) => c.title.toLowerCase().includes(q)),
      );
    }
    if (riskFilter !== 'all') list = list.filter((s) => s.risk.level === riskFilter);
    if (sortBy === 'progress') list.sort((a, b) => b.avgProgress - a.avgProgress);
    if (sortBy === 'name')     list.sort((a, b) => a.fullName.localeCompare(b.fullName));
    if (sortBy === 'access')   list.sort((a, b) => (b.lastAccessAt ?? '').localeCompare(a.lastAccessAt ?? ''));
    return list;
  }, [students, search, riskFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const resetToPage1 = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setPage(1); };

  const RISK_CHIPS: { key: typeof riskFilter; label: string }[] = [
    { key: 'all',       label: 'Todos'        },
    { key: 'at-risk',   label: 'En riesgo'    },
    { key: 'abandoned', label: 'Abandonaron'  },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <PageHeader
        title={<>Progreso de estudiantes</>}
        subtitle={loading ? 'Cargando…' : `Seguimiento de ${students.length} alumno${students.length !== 1 ? 's' : ''}`}
      />

      {/* La fila de estadísticas se retiró a propósito: esta vista es para
          recorrer alumnos, y las cifras agregadas empujaban la rejilla fuera de
          pantalla. El seguimiento agregado vive en el Resumen. */}

      {/* ── Search + chips ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', minWidth: '15rem', maxWidth: '23.75rem' }}>
          <AppInput
            type="search"
            placeholder="Buscar alumno o curso…"
            value={search}
            onChange={(e) => resetToPage1(setSearch)(e.target.value)}
            withSearchIcon
          />
        </div>

        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {RISK_CHIPS.map((chip) => (
            <AppButton
              key={chip.key}
              type="button"
              onClick={() => resetToPage1(setRiskFilter)(chip.key)}
              variant={riskFilter === chip.key ? 'contained' : 'outlined'}
              sx={{
                bgcolor: riskFilter === chip.key ? 'var(--green-50)' : 'var(--panel)',
                color: riskFilter === chip.key ? 'var(--green-700)' : 'var(--ink-muted)',
                borderColor: riskFilter === chip.key ? 'var(--green-500)' : 'var(--neutral-200)',
                px: 2,
              }}
            >
              {chip.label}
            </AppButton>
          ))}
        </div>

        <AppSelect
          value={sortBy}
          onChange={(e) => resetToPage1(setSortBy)(e.target.value as typeof sortBy)}
          sx={{ maxWidth: 210, marginLeft: 'auto' }}
        >
          <MenuItem value="progress">Mayor avance</MenuItem>
          <MenuItem value="name">Nombre A→Z</MenuItem>
          <MenuItem value="access">Último acceso</MenuItem>
        </AppSelect>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.875rem' }}>
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={APP_ICONS.chart}
          title="Sin registros"
          description={
            search || riskFilter !== 'all'
              ? 'Ningún alumno coincide con los filtros aplicados.'
              : 'Aún no hay inscripciones con datos de progreso.'
          }
          action={
            (search || riskFilter !== 'all')
              ? { label: 'Ver todos', onClick: () => { setSearch(''); setRiskFilter('all'); setPage(1); } }
              : undefined
          }
        />
      ) : (
        <>
          <div style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>
            Mostrando <strong style={{ color: 'var(--ink)' }}>{paginated.length}</strong> de {filtered.length} alumnos
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.875rem' }}>
            {paginated.map((student) => (
              <StudentSummaryCard key={student.userId} student={toCardSummary(student, now)} onOpen={() => setSelected(student)} />
            ))}
          </div>
          <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {selected && (
        <StudentSummaryDetailPanel student={toCardSummary(selected, now)} entriesLabel="Sus cursos" onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   Progress Page — Progreso de estudiantes
   Grilla de tarjetas por alumno (avatar 3D
   NOVA Folks procedural) · badge
   de riesgo · paginado de 12 · panel lateral
   con detalle de sus inscripciones reales.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import { api } from '@/lib/api';
import type { Progress } from '@/lib/types';
import { AppButton, AppInput, AppSelect } from '@/app/components/ui/AppControls';
import { DEFAULT_PAGE_SIZE, Pagination } from '@/app/components/ui/Pagination';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { StudentSummaryCard, StudentSummaryDetailPanel, type StudentCardSummary } from '@/app/components/shared/StudentSummaryCard';
import { APP_ICONS } from '@/lib/icons';

const PAGE_SIZE = DEFAULT_PAGE_SIZE;

type RiskLevel = 'bajo' | 'medio' | 'alto';

interface CourseProgress {
  inscriptionId: string;
  title: string;
  category?: string;
  pct: number;
  lastAccessAt: string | null;
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
  riskLevel: RiskLevel;
  courses: CourseProgress[];
  lastAccessAt: string | null;
}

const RISK_META: Record<RiskLevel, { label: string; variant: 'green' | 'yellow' | 'red' }> = {
  bajo:  { label: 'BAJO',  variant: 'green'  },
  medio: { label: 'MEDIO', variant: 'yellow' },
  alto:  { label: 'ALTO',  variant: 'red'    },
};

function riskFromAvg(avg: number): RiskLevel {
  if (avg < 35) return 'alto';
  if (avg < 65) return 'medio';
  return 'bajo';
}

function groupByStudent(items: Progress[]): StudentSummary[] {
  const map = new Map<string, StudentSummary>();
  for (const p of items) {
    const user = p.inscription?.user;
    if (!user) continue; // sin usuario resuelto (registro huérfano) — se omite
    /* Solo alumnos con la cuenta activa. Las bajas conservan su historial de
       progreso en la base, pero no deben aparecer en el seguimiento: inflan los
       totales y no hay nada que hacer con ellos. */
    if (user.active === false) continue;
    const course: CourseProgress = {
      inscriptionId: p.inscription?.id ?? p.id,
      title: p.inscription?.course?.title ?? 'Curso sin título',
      category: p.inscription?.course?.category,
      // progressPercentage llega como Decimal serializado (string) desde Prisma —
      // Number() evita que el reduce de más abajo concatene strings en vez de sumar.
      pct: Number(p.progressPercentage),
      lastAccessAt: p.lastAccessAt ?? null,
    };
    const existing = map.get(user.id);
    if (existing) {
      existing.courses.push(course);
      if (p.lastAccessAt && (!existing.lastAccessAt || p.lastAccessAt > existing.lastAccessAt)) {
        existing.lastAccessAt = p.lastAccessAt;
      }
    } else {
      map.set(user.id, {
        userId: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl ?? null,
        courses: [course],
        lastAccessAt: p.lastAccessAt ?? null,
        avgProgress: 0,
        riskLevel: 'bajo',
      });
    }
  }
  const list = Array.from(map.values());
  for (const s of list) {
    s.avgProgress = Math.round(s.courses.reduce((sum, c) => sum + c.pct, 0) / s.courses.length);
    s.riskLevel = riskFromAvg(s.avgProgress);
  }
  return list;
}

/** Adapta un StudentSummary (dominio de progreso) a la vista de tarjeta genérica. */
function toCardSummary(s: StudentSummary, now: number): StudentCardSummary {
  const entries = s.courses.map((c) => {
    const inactiveDays = daysSince(c.lastAccessAt, now);
    return {
      key: c.inscriptionId,
      title: c.title,
      subtitle: c.category,
      pct: c.pct,
      inactiveDays,
      warning: inactiveDays !== null && inactiveDays >= INACTIVITY_WARNING_DAYS
        ? `${inactiveDays} días sin actividad`
        : undefined,
    };
  });

  let riskBanner: StudentCardSummary['riskBanner'];
  if (s.riskLevel === 'alto' || s.riskLevel === 'medio') {
    const worst = [...entries].sort((a, b) => a.pct - b.pct)[0];
    const variant = s.riskLevel === 'alto' ? 'red' as const : 'yellow' as const;
    const message = worst.warning
      ? `Sin actividad hace ${worst.inactiveDays} días en "${worst.title}" y avance muy bajo (${worst.pct}%). Conviene contactarlo esta semana.`
      : `Avance de ${worst.pct}% en "${worst.title}". Conviene dar seguimiento.`;
    riskBanner = { title: `Riesgo ${s.riskLevel}`, message, variant };
  }

  return {
    userId: s.userId,
    fullName: s.fullName,
    avatarUrl: s.avatarUrl,
    headerValue: `${s.avgProgress}%`,
    headerProgressPct: s.avgProgress,
    headerBadge: s.riskLevel === 'bajo' ? null : RISK_META[s.riskLevel],
    riskBanner,
    entries: entries.map(({ key, title, subtitle, pct, warning }) => ({
      key,
      title,
      subtitle,
      pct,
      warning,
    })),
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
  const [riskFilter,    setRiskFilter]    = useState<'all' | RiskLevel>('all');
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

  const students = useMemo(() => groupByStudent(progressItems), [progressItems]);

  /* ── Stats ── */
  const avg = useMemo(() =>
    students.length ? Math.round(students.reduce((s, p) => s + p.avgProgress, 0) / students.length) : 0,
  [students]);
  const completed = useMemo(() => students.filter((s) => s.avgProgress >= 100).length, [students]);
  const atRisk    = useMemo(() => students.filter((s) => s.riskLevel === 'alto').length, [students]);
  const active    = useMemo(() => students.filter((s) => s.lastAccessAt && new Date(s.lastAccessAt).getTime() > now - 7 * 86400000).length, [students, now]);

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
    if (riskFilter !== 'all') list = list.filter((s) => s.riskLevel === riskFilter);
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
    { key: 'all',   label: 'Todos' },
    { key: 'bajo',  label: 'Bajo'  },
    { key: 'medio', label: 'Medio' },
    { key: 'alto',  label: 'Alto'  },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <PageHeader
        title={<>Progreso de estudiantes</>}
        subtitle={loading ? 'Cargando…' : `Seguimiento de ${students.length} alumno${students.length !== 1 ? 's' : ''}`}
      />

      {/* ── Stat row ── */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '1rem' }}>
          <StatCard label="Promedio"     value={avg}       unit="%" icon={<Icon icon={APP_ICONS.chart} width={20} height={20} />} />
          <StatCard label="Completados"  value={completed} delta={completed > 0 ? `de ${students.length}` : undefined} deltaUp icon={<Icon icon={APP_ICONS.checkFilled} width={20} height={20} />} variant="green" />
          <StatCard label="Activos (7d)" value={active}    icon={<Icon icon={APP_ICONS.liveDot} width={20} height={20} />} variant="blue" />
          <StatCard label="En riesgo"    value={atRisk}    deltaUp={false} icon={<Icon icon={APP_ICONS.warning} width={20} height={20} />} variant="red" />
        </div>
      )}

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

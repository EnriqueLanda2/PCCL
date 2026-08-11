/* ───────────────────────────────────────────
   Inscriptions Page — Inscripciones
   Grilla de tarjetas por alumno (avatar 3D
   galería compartida) agrupando
   sus inscripciones reales · paginado de 12 ·
   panel lateral con el detalle por curso.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import { api } from '@/lib/api';
import type { Inscription } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { AppButton, AppInput, AppSelect } from '@/app/components/ui/AppControls';
import { DEFAULT_PAGE_SIZE, Pagination } from '@/app/components/ui/Pagination';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { StudentSummaryCard, StudentSummaryDetailPanel, type StudentCardSummary } from '@/app/components/shared/StudentSummaryCard';
import { inscriptionStatus, getVariant, getLabel } from '@/types/status';
import { APP_ICONS } from '@/lib/icons';

const PAGE_SIZE = DEFAULT_PAGE_SIZE;

/* Prioridad para decidir el badge "resumen" de la tarjeta cuando el alumno
   tiene varias inscripciones con estados distintos (peor estado primero). */
const STATUS_PRIORITY: Record<string, number> = { dropped: 0, 'in-progress': 1, enrolled: 2, completed: 3 };

interface StudentEnrollments {
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
  inscriptions: Inscription[];
}

function groupInscriptionsByStudent(list: Inscription[]): StudentEnrollments[] {
  const map = new Map<string, StudentEnrollments>();
  for (const ins of list) {
    if (!ins.user) continue; // sin usuario resuelto — se omite
    if (ins.user.active === false) continue; // solo cuentas activas
    const existing = map.get(ins.user.id);
    if (existing) existing.inscriptions.push(ins);
    else map.set(ins.user.id, {
      userId: ins.user.id,
      fullName: ins.user.fullName,
      avatarUrl: ins.user.avatarUrl ?? null,
      inscriptions: [ins],
    });
  }
  return Array.from(map.values());
}

function toCardSummary(s: StudentEnrollments): StudentCardSummary {
  // progressPercentage llega como Decimal serializado (string) desde Prisma —
  // hay que forzar Number() antes de sumar o "+" concatena strings en vez de sumar.
  const avgPct = Math.round(
    s.inscriptions.reduce((sum, i) => sum + Number(i.progressPercentage ?? 0), 0) / s.inscriptions.length,
  );
  const worst = [...s.inscriptions].sort(
    (a, b) => (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9),
  )[0];
  return {
    userId: s.userId,
    fullName: s.fullName,
    avatarUrl: s.avatarUrl,
    headerValue: `${avgPct}%`,
    headerProgressPct: avgPct,
    headerBadge: { label: getLabel(inscriptionStatus, worst.status), variant: getVariant(inscriptionStatus, worst.status) },
    entries: s.inscriptions.map((ins) => ({
      key: ins.id,
      title: ins.course?.title ?? 'Curso sin título',
      subtitle: ins.completedAt
        ? `Completado ${new Date(ins.completedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}`
        : undefined,
      badge: { label: getLabel(inscriptionStatus, ins.status), variant: getVariant(inscriptionStatus, ins.status) },
      pct: Number(ins.progressPercentage ?? 0),
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

const STATUSES  = inscriptionStatus.chips;
const STATUS_KEY = inscriptionStatus.chipKey!;

export default function InscriptionsPage() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [permissions,  setPermissions]  = useState<string[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [statusChip,   setStatusChip]   = useState('Todos');
  const [sortBy,       setSortBy]       = useState<'progress' | 'name' | 'status' | 'risk'>('status');
  const [page,         setPage]         = useState(1);
  const [selected,     setSelected]     = useState<StudentEnrollments | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([api.inscriptions(), api.access()])
      .then(([list, access]) => {
        if (!alive) return;
        setInscriptions(list);
        setPermissions(access.permissions);
      })
      .catch(() => { if (alive) { setInscriptions([]); setPermissions([]); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const canCreate = useMemo(() => permissions.includes('inscriptions:create'), [permissions]);

  /* ── Stats ── */
  const total      = inscriptions.length;
  const active     = useMemo(() => inscriptions.filter((i) => i.status === 'in-progress').length, [inscriptions]);
  const completed  = useMemo(() => inscriptions.filter((i) => i.status === 'completed').length,   [inscriptions]);
  const dropped    = useMemo(() => inscriptions.filter((i) => i.status === 'dropped').length,     [inscriptions]);
  /* Riesgo de abandono estimado (heurístico, no un modelo predictivo real):
     alumnos en curso con menos de 30% de avance. */
  const atRiskInscriptions = useMemo(
    () => inscriptions.filter((i) => i.status === 'in-progress' && (i.progressPercentage ?? 0) < 30),
    [inscriptions],
  );

  /* ── Filtered + sorted ── */
  const filtered = useMemo(() => {
    let list = [...inscriptions];
    if (statusChip !== 'Todos') {
      const key = STATUS_KEY[statusChip];
      list = list.filter((i) => i.status === key);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        (i.user?.fullName ?? '').toLowerCase().includes(q) ||
        (i.course?.title  ?? '').toLowerCase().includes(q)
      );
    }
    if (sortBy === 'progress') list.sort((a, b) => (b.progressPercentage ?? 0) - (a.progressPercentage ?? 0));
    if (sortBy === 'risk')     list.sort((a, b) => (a.progressPercentage ?? 0) - (b.progressPercentage ?? 0));
    if (sortBy === 'name')     list.sort((a, b) => (a.user?.fullName ?? '').localeCompare(b.user?.fullName ?? ''));
    if (sortBy === 'status')   list.sort((a, b) => a.status.localeCompare(b.status));
    return list;
  }, [inscriptions, search, statusChip, sortBy]);

  const students = useMemo(() => groupInscriptionsByStudent(filtered), [filtered]);
  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paginated = students.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const resetToPage1 = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setPage(1); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <PageHeader
        title={<>Inscripciones de alumnos</>}
        subtitle={loading ? 'Cargando…' : `${total} inscripci${total !== 1 ? 'ones' : 'ón'} registrada${total !== 1 ? 's' : ''}`}
        action={canCreate ? <Button variant="primary" size="md">+ Nueva inscripción</Button> : undefined}
      />

      {/* ── Stats ── */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '1rem' }}>
          <StatCard size="lg" label="Total"        value={total}     icon={<Icon icon={APP_ICONS.clipboard} width={22} height={22} />} />
          <StatCard size="lg" label="En progreso"  value={active}    delta={`${atRiskInscriptions.length} en riesgo`} deltaUp={false} icon={<Icon icon={APP_ICONS.chart} width={22} height={22} />} variant="blue" />
          <StatCard size="lg" label="Completados"  value={completed} deltaUp icon={<Icon icon={APP_ICONS.checkFilled} width={22} height={22} />} variant="green" />
          <StatCard size="lg" label="Abandonados"  value={dropped}   deltaUp={false} icon={<Icon icon={APP_ICONS.warning} width={22} height={22} />} variant="red" />
        </div>
      )}

      {/* ── Alerta de riesgo de abandono ── */}
      {!loading && atRiskInscriptions.length > 0 && (
        <Card variant="danger" padding="default" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
          <span style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', flexShrink: 0,
            background: '#F7C7B9', color: 'var(--red-600)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon icon={APP_ICONS.warning} width={20} height={20} />
          </span>
          <div style={{ flex: 1, minWidth: '13.75rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)' }}>
              {atRiskInscriptions.length} alumno{atRiskInscriptions.length === 1 ? '' : 's'} con riesgo estimado de abandono
            </p>
            <p style={{ fontSize: '0.7813rem', color: 'var(--ink-muted)' }}>
              En curso con menos de 30% de avance — vale la pena dar seguimiento.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => { resetToPage1(setStatusChip)('En progreso'); setSortBy('risk'); }}
          >
            Ver alumnos en riesgo
          </Button>
        </Card>
      )}

      {/* ── Search + chips + sort ── */}
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
          {STATUSES.map((chip) => (
            <AppButton
              key={chip}
              type="button"
              onClick={() => resetToPage1(setStatusChip)(chip)}
              variant={statusChip === chip ? 'contained' : 'outlined'}
              sx={{
                borderColor: statusChip === chip ? 'var(--blue-500)' : 'var(--neutral-200)',
                bgcolor: statusChip === chip ? 'var(--blue-50)' : 'var(--panel)',
                color: statusChip === chip ? 'var(--blue-700)' : 'var(--ink-muted)',
                px: 1.7,
              }}
            >
              {chip}
            </AppButton>
          ))}
        </div>
        <AppSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          sx={{ maxWidth: 220, marginLeft: 'auto' }}
        >
          <MenuItem value="status">Por estado</MenuItem>
          <MenuItem value="progress">Mayor avance</MenuItem>
          <MenuItem value="risk">Menor avance (riesgo)</MenuItem>
          <MenuItem value="name">Nombre A→Z</MenuItem>
        </AppSelect>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.875rem' }}>
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          icon={APP_ICONS.clipboard}
          title="Sin inscripciones"
          description={
            search || statusChip !== 'Todos'
              ? 'Ninguna inscripción coincide con los filtros.'
              : canCreate
              ? 'Aún no hay inscripciones. ¡Crea la primera!'
              : 'No hay inscripciones en el sistema.'
          }
          action={
            (search || statusChip !== 'Todos')
              ? { label: 'Ver todas', onClick: () => { resetToPage1(setSearch)(''); setStatusChip('Todos'); } }
              : undefined
          }
        />
      ) : (
        <>
          <div style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>
            Mostrando <strong style={{ color: 'var(--ink)' }}>{paginated.length}</strong> de {students.length} alumnos
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.875rem' }}>
            {paginated.map((student) => (
              <StudentSummaryCard key={student.userId} student={toCardSummary(student)} onOpen={() => setSelected(student)} />
            ))}
          </div>
          <Pagination page={pageSafe} totalPages={totalPages} onChange={setPage} />
        </>
      )}

      {selected && (
        <StudentSummaryDetailPanel student={toCardSummary(selected)} entriesLabel="Sus inscripciones" onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

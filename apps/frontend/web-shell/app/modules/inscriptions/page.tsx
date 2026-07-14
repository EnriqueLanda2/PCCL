/* ───────────────────────────────────────────
   Inscriptions Page — Inscripciones
   Grilla de tarjetas por alumno (avatar Ready
   Player Me + fallback de iniciales) agrupando
   sus inscripciones reales · paginado de 12 ·
   panel lateral con el detalle por curso.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { Inscription } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Pagination } from '@/app/components/ui/Pagination';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { StudentSummaryCard, StudentSummaryDetailPanel, type StudentCardSummary } from '@/app/components/shared/StudentSummaryCard';
import { inscriptionStatus, getVariant, getLabel } from '@/types/status';
import { APP_ICONS } from '@/lib/icons';

const PAGE_SIZE = 12;

/* Prioridad para decidir el badge "resumen" de la tarjeta cuando el alumno
   tiene varias inscripciones con estados distintos (peor estado primero). */
const STATUS_PRIORITY: Record<string, number> = { dropped: 0, 'in-progress': 1, enrolled: 2, completed: 3 };

interface StudentEnrollments {
  userId: string;
  fullName: string;
  inscriptions: Inscription[];
}

function groupInscriptionsByStudent(list: Inscription[]): StudentEnrollments[] {
  const map = new Map<string, StudentEnrollments>();
  for (const ins of list) {
    if (!ins.user) continue; // sin usuario resuelto — se omite
    const existing = map.get(ins.user.id);
    if (existing) existing.inscriptions.push(ins);
    else map.set(ins.user.id, { userId: ins.user.id, fullName: ins.user.fullName, inscriptions: [ins] });
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
    <div style={{ padding: '18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--neutral-100)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--neutral-100)' }} />
      <div style={{ height: '13px', width: '70%', borderRadius: '6px', background: 'var(--neutral-100)' }} />
      <div style={{ height: '10px', width: '50%', borderRadius: '6px', background: 'var(--neutral-100)' }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
            Inscripciones <em style={{ color: 'var(--blue-600)', fontStyle: 'italic' }}>de alumnos</em>
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
            {loading ? 'Cargando…' : `${total} inscripci${total !== 1 ? 'ones' : 'ón'} registrada${total !== 1 ? 's' : ''}`}
          </p>
        </div>
        {canCreate && (
          <Button variant="primary" size="md">+ Nueva inscripción</Button>
        )}
      </div>

      {/* ── Stats ── */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard size="lg" label="Total"        value={total}     icon={<Icon icon={APP_ICONS.clipboard} width={22} height={22} />} />
          <StatCard size="lg" label="En progreso"  value={active}    delta={`${atRiskInscriptions.length} en riesgo`} deltaUp={false} icon={<Icon icon={APP_ICONS.chart} width={22} height={22} />} variant="blue" />
          <StatCard size="lg" label="Completados"  value={completed} deltaUp icon={<Icon icon={APP_ICONS.checkFilled} width={22} height={22} />} variant="green" />
          <StatCard size="lg" label="Abandonados"  value={dropped}   deltaUp={false} icon={<Icon icon={APP_ICONS.warning} width={22} height={22} />} variant="red" />
        </div>
      )}

      {/* ── Alerta de riesgo de abandono ── */}
      {!loading && atRiskInscriptions.length > 0 && (
        <Card variant="danger" padding="default" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span style={{
            width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
            background: '#F7C7B9', color: 'var(--red-600)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon icon={APP_ICONS.warning} width={20} height={20} />
          </span>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
              {atRiskInscriptions.length} alumno{atRiskInscriptions.length === 1 ? '' : 's'} con riesgo estimado de abandono
            </p>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-muted)' }}>
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
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '320px' }}>
          <Icon icon={APP_ICONS.search} width={16} height={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)', pointerEvents: 'none' }} />
          <input
            type="search"
            placeholder="Buscar alumno o curso…"
            value={search}
            onChange={(e) => resetToPage1(setSearch)(e.target.value)}
            style={{
              width: '100%', height: '40px', paddingLeft: '40px', paddingRight: '12px',
              borderRadius: 'var(--radius-md)', border: '1.5px solid var(--neutral-200)',
              background: 'var(--blue-50)', fontSize: '13.5px', color: 'var(--ink)',
              fontFamily: 'var(--font-sans)', outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUSES.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => resetToPage1(setStatusChip)(chip)}
              style={{
                border: statusChip === chip ? '1.5px solid var(--blue-600)' : '1.5px solid var(--neutral-200)',
                background: statusChip === chip ? 'var(--blue-50)' : 'var(--panel)',
                color: statusChip === chip ? 'var(--blue-700)' : 'var(--ink-muted)',
                borderRadius: 'var(--radius-full)', padding: '5px 13px',
                fontSize: '12.5px', fontWeight: statusChip === chip ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          style={{
            height: '40px', padding: '0 12px', borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--neutral-200)', background: 'var(--panel)',
            color: 'var(--ink)', fontSize: '13.5px', fontFamily: 'var(--font-sans)',
            cursor: 'pointer', outline: 'none', marginLeft: 'auto',
          }}
        >
          <option value="status">Por estado</option>
          <option value="progress">Mayor avance</option>
          <option value="risk">Menor avance (riesgo)</option>
          <option value="name">Nombre A→Z</option>
        </select>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '14px' }}>
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
          <div style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
            Mostrando <strong style={{ color: 'var(--ink)' }}>{paginated.length}</strong> de {students.length} alumnos
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '14px' }}>
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

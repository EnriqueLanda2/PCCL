/* ───────────────────────────────────────────
   Progress Page — Progreso académico
   Stats · Listado de inscripciones con avance
   ProgressBar por alumno/curso
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Progress } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Avatar, getInitials } from '@/components/ui/Avatar';

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid var(--neutral-100)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--neutral-100)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '14px', borderRadius: '6px', background: 'var(--neutral-100)', width: '55%' }} />
        <div style={{ height: '8px', borderRadius: '4px', background: 'var(--neutral-100)', width: '80%' }} />
      </div>
      <div style={{ width: '60px', height: '22px', borderRadius: '999px', background: 'var(--neutral-100)' }} />
    </div>
  );
}

/* ── Progress row ── */
function ProgressRow({ item, isLast }: { item: Progress; isLast: boolean }) {
  const pct      = item.progressPercentage;
  const color    = pct >= 80 ? 'green' : pct >= 40 ? 'blue' : 'yellow';
  const student  = item.inscription?.user?.fullName ?? 'Alumno desconocido';
  const course   = item.inscription?.course?.title  ?? 'Curso sin título';
  const lastAccess = item.lastAccessAt
    ? new Date(item.lastAccessAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '14px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--neutral-100)',
    }}>
      <Avatar initials={getInitials(student)} size="md" />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '8px' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {student}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {course}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {lastAccess && (
              <span style={{ fontSize: '11.5px', color: 'var(--ink-muted)' }}>{lastAccess}</span>
            )}
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 600, color: pct >= 80 ? 'var(--green-600)' : pct >= 40 ? 'var(--blue-600)' : 'var(--yellow-600)', minWidth: '44px', textAlign: 'right' }}>
              {pct}%
            </span>
          </div>
        </div>
        <ProgressBar value={pct} color={color} />
        <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '11.5px', color: 'var(--ink-muted)' }}>
          <span>📖 {item.lessonsCompleted} lecciones</span>
          <span>📝 {item.evaluationsCompleted} evaluaciones</span>
          {item.averageScore > 0 && <span>⭐ {item.averageScore.toFixed(1)} promedio</span>}
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [progressItems, setProgressItems] = useState<Progress[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [rangeFilter,   setRangeFilter]   = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [sortBy,        setSortBy]        = useState<'progress' | 'name' | 'access'>('progress');

  useEffect(() => {
    let alive = true;
    api.progress()
      .then((items) => { if (alive) setProgressItems(items); })
      .catch(() => { if (alive) setProgressItems([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  /* ── Stats ── */
  const avg = useMemo(() =>
    progressItems.length
      ? Math.round(progressItems.reduce((s, p) => s + p.progressPercentage, 0) / progressItems.length)
      : 0,
  [progressItems]);

  const completed = useMemo(() => progressItems.filter((p) => p.progressPercentage >= 100).length, [progressItems]);
  const atRisk    = useMemo(() => progressItems.filter((p) => p.progressPercentage < 20).length, [progressItems]);
  const active    = useMemo(() => progressItems.filter((p) => p.lastAccessAt && new Date(p.lastAccessAt) > new Date(Date.now() - 7 * 86400000)).length, [progressItems]);

  /* ── Filtered + sorted ── */
  const filtered = useMemo(() => {
    let list = [...progressItems];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        (p.inscription?.user?.fullName ?? '').toLowerCase().includes(q) ||
        (p.inscription?.course?.title  ?? '').toLowerCase().includes(q)
      );
    }

    if (rangeFilter === 'low')  list = list.filter((p) => p.progressPercentage < 40);
    if (rangeFilter === 'mid')  list = list.filter((p) => p.progressPercentage >= 40 && p.progressPercentage < 80);
    if (rangeFilter === 'high') list = list.filter((p) => p.progressPercentage >= 80);

    if (sortBy === 'progress') list.sort((a, b) => b.progressPercentage - a.progressPercentage);
    if (sortBy === 'name')     list.sort((a, b) => (a.inscription?.user?.fullName ?? '').localeCompare(b.inscription?.user?.fullName ?? ''));
    if (sortBy === 'access')   list.sort((a, b) => (b.lastAccessAt ?? '').localeCompare(a.lastAccessAt ?? ''));

    return list;
  }, [progressItems, search, rangeFilter, sortBy]);

  const RANGE_CHIPS: { key: typeof rangeFilter; label: string }[] = [
    { key: 'all',  label: 'Todos'   },
    { key: 'low',  label: '< 40%'   },
    { key: 'mid',  label: '40–80%'  },
    { key: 'high', label: '> 80%'   },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
          Progreso <em style={{ color: 'var(--green-500)', fontStyle: 'italic' }}>académico</em>
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
          {loading ? 'Cargando…' : `Seguimiento de ${progressItems.length} inscripci${progressItems.length !== 1 ? 'ones' : 'ón'}`}
        </p>
      </div>

      {/* ── Stat row ── */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Promedio"     value={avg}       unit="%" />
          <StatCard label="Completados"  value={completed} delta={completed > 0 ? `de ${progressItems.length}` : undefined} deltaUp />
          <StatCard label="Activos (7d)" value={active}    />
          <StatCard label="En riesgo"    value={atRisk}    deltaUp={false} />
        </div>
      )}

      {/* ── Hero avg bar ── */}
      {!loading && progressItems.length > 0 && (
        <Card variant="dark" padding="default">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--blue-300)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Avance promedio del grupo
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', color: 'var(--panel)' }}>
              {avg}<small style={{ fontSize: '18px', color: 'var(--blue-300)', marginLeft: '2px' }}>%</small>
            </span>
          </div>
          <ProgressBar value={avg} color={avg >= 70 ? 'green' : 'blue'} />
          <div style={{ display: 'flex', gap: '24px', marginTop: '12px', fontSize: '12.5px', color: 'var(--blue-300)' }}>
            <span>✅ {completed} completados al 100%</span>
            <span>⚠️ {atRisk} en riesgo ({'<'}20%)</span>
            <span>🟢 {active} activos esta semana</span>
          </div>
        </Card>
      )}

      {/* ── Search + chips ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '320px' }}>
          <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: 'var(--ink-muted)', pointerEvents: 'none' }}>🔍</span>
          <input
            type="search"
            placeholder="Buscar alumno o curso…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', height: '40px', paddingLeft: '40px', paddingRight: '12px',
              borderRadius: 'var(--radius-md)', border: '1.5px solid var(--neutral-200)',
              background: 'var(--blue-50)', fontSize: '13.5px', color: 'var(--ink)',
              fontFamily: 'var(--font-sans)', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {RANGE_CHIPS.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setRangeFilter(chip.key)}
              style={{
                border: rangeFilter === chip.key ? '1.5px solid var(--green-500)' : '1.5px solid var(--neutral-200)',
                background: rangeFilter === chip.key ? 'var(--green-50)' : 'var(--panel)',
                color: rangeFilter === chip.key ? 'var(--green-700)' : 'var(--ink-muted)',
                borderRadius: 'var(--radius-full)', padding: '6px 16px',
                fontSize: '13px', fontWeight: rangeFilter === chip.key ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {chip.label}
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
          <option value="progress">Mayor avance</option>
          <option value="name">Nombre A→Z</option>
          <option value="access">Último acceso</option>
        </select>
      </div>

      {/* ── List ── */}
      {loading ? (
        <Card padding="default">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📊"
          title="Sin registros"
          description={
            search || rangeFilter !== 'all'
              ? 'Ningún registro coincide con los filtros aplicados.'
              : 'Aún no hay inscripciones con datos de progreso.'
          }
          action={
            (search || rangeFilter !== 'all')
              ? { label: 'Ver todos', onClick: () => { setSearch(''); setRangeFilter('all'); } }
              : undefined
          }
        />
      ) : (
        <Card padding="default">
          <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
            Mostrando <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> de {progressItems.length} registros
          </div>
          {filtered.map((item, i) => (
            <ProgressRow key={item.id} item={item} isLast={i === filtered.length - 1} />
          ))}
        </Card>
      )}
    </div>
  );
}

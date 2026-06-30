/* ───────────────────────────────────────────
   Inscriptions Page — Inscripciones
   Tabla con alumno, curso, estado, progreso
   ProgressBar inline · filtro por estado
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Inscription } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar, getInitials } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { inscriptionStatus, getVariant, getLabel } from '@/types/status';

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
      {[44, 52, 20, 70, 22].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div style={{ height: '13px', borderRadius: '5px', background: 'var(--neutral-100)', width: `${w}%` }} />
        </td>
      ))}
    </tr>
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
  const [sortBy,       setSortBy]       = useState<'progress' | 'name' | 'status'>('status');

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
    if (sortBy === 'name')     list.sort((a, b) => (a.user?.fullName ?? '').localeCompare(b.user?.fullName ?? ''));
    if (sortBy === 'status')   list.sort((a, b) => a.status.localeCompare(b.status));
    return list;
  }, [inscriptions, search, statusChip, sortBy]);

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
          <StatCard label="Total"        value={total}     />
          <StatCard label="En progreso"  value={active}    />
          <StatCard label="Completados"  value={completed} deltaUp />
          <StatCard label="Abandonados"  value={dropped}   deltaUp={false} />
        </div>
      )}

      {/* ── Search + chips + sort ── */}
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
          {STATUSES.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setStatusChip(chip)}
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
          <option value="name">Nombre A→Z</option>
        </select>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <Card padding="tight">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>{Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
          </table>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📋"
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
              ? { label: 'Ver todas', onClick: () => { setSearch(''); setStatusChip('Todos'); } }
              : undefined
          }
        />
      ) : (
        <Card padding="tight" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                {['Alumno', 'Curso', 'Estado', 'Progreso', 'Completado'].map((h) => (
                  <th key={h} style={{
                    padding: '11px 16px', textAlign: 'left',
                    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                    fontWeight: 600, color: 'var(--ink-muted)', background: 'var(--blue-50)',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ins, i) => {
                const pct = ins.progressPercentage ?? 0;
                return (
                  <tr key={ins.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--neutral-100)' : 'none' }}>
                    {/* Alumno */}
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <Avatar initials={getInitials(ins.user?.fullName ?? 'A')} size="sm" />
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                          {ins.user?.fullName ?? '—'}
                        </span>
                      </div>
                    </td>
                    {/* Curso */}
                    <td style={{ padding: '13px 16px', fontSize: '13.5px', color: 'var(--ink)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ins.course?.title ?? '—'}
                    </td>
                    {/* Estado */}
                    <td style={{ padding: '13px 16px' }}>
                      <Badge variant={getVariant(inscriptionStatus, ins.status)}>
                        {getLabel(inscriptionStatus, ins.status)}
                      </Badge>
                    </td>
                    {/* Progreso */}
                    <td style={{ padding: '13px 16px', minWidth: '140px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ProgressBar
                          value={pct}
                          color={pct >= 100 ? 'green' : pct >= 50 ? 'blue' : 'yellow'}
                          style={{ flex: 1 }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--ink-muted)', minWidth: '34px', textAlign: 'right' }}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                    {/* Completado */}
                    <td style={{ padding: '13px 16px', fontSize: '12.5px', color: 'var(--ink-muted)' }}>
                      {ins.completedAt
                        ? new Date(ins.completedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
                        : <span style={{ color: 'var(--neutral-300)' }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   Audit Page — Bitácora del sistema
   Tabla cronológica · badge por método HTTP
   Filtro por método · búsqueda endpoint/actor
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { AuditLog } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { AppButton, AppInput } from '@/app/components/ui/AppControls';
import { DEFAULT_PAGE_SIZE, Pagination } from '@/app/components/ui/Pagination';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { httpMethod, getVariant } from '@/types/status';
import { APP_ICONS } from '@/lib/icons';

/* ── Status code color ── */
function statusColor(code: number | null) {
  if (!code) return 'var(--ink-muted)';
  if (code < 300) return 'var(--green-600)';
  if (code < 400) return 'var(--blue-600)';
  if (code < 500) return 'var(--yellow-600)';
  return 'var(--red-600)';
}

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
      {[50, 70, 35, 45, 22, 40].map((w, i) => (
        <td key={i} style={{ padding: '12px 14px' }}>
          <div style={{ height: '0.8125rem', borderRadius: '0.3125rem', background: 'var(--neutral-100)', width: `${w}%` }} />
        </td>
      ))}
    </tr>
  );
}

const METHODS = ['Todos', ...httpMethod.chips];

export default function AuditPage() {
  const [logs,        setLogs]        = useState<AuditLog[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [methodChip,  setMethodChip]  = useState('Todos');
  const [page,        setPage]        = useState(1);

  useEffect(() => {
    let alive = true;
    api.audit()
      .then((auditLogs) => { if (alive) setLogs(auditLogs); })
      .catch(() => { if (alive) setLogs([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  /* ── Filtered ── */
  const filtered = useMemo(() => {
    let list = [...logs];
    if (methodChip !== 'Todos') list = list.filter((l) => l.method === methodChip);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) =>
        l.endpoint.toLowerCase().includes(q) ||
        (l.actorIdentifier ?? '').toLowerCase().includes(q) ||
        (l.description ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [logs, search, methodChip]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / DEFAULT_PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paginated  = filtered.slice((pageSafe - 1) * DEFAULT_PAGE_SIZE, pageSafe * DEFAULT_PAGE_SIZE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <PageHeader
        title={<>Bitácora del sistema</>}
        subtitle={loading ? 'Cargando…' : `${logs.length} evento${logs.length !== 1 ? 's' : ''} registrado${logs.length !== 1 ? 's' : ''}`}
      />

      {/* ── Search + method chips ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', minWidth: '15rem', maxWidth: '26.25rem' }}>
          <AppInput
            type="search"
            placeholder="Buscar endpoint, actor o descripción…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            withSearchIcon
          />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {METHODS.map((m) => (
            <AppButton
              key={m}
              type="button"
              onClick={() => { setMethodChip(m); setPage(1); }}
              variant={methodChip === m ? 'contained' : 'outlined'}
              sx={{
                border: methodChip === m ? `1.5px solid ${m === 'DELETE' ? 'var(--red-400)' : m === 'POST' ? 'var(--green-400)' : 'var(--blue-400)'}` : '1.5px solid var(--neutral-200)',
                bgcolor: methodChip === m ? (m === 'DELETE' ? 'var(--red-50)' : m === 'POST' ? 'var(--green-50)' : 'var(--blue-50)') : 'var(--panel)',
                color: methodChip === m ? (m === 'DELETE' ? 'var(--red-700)' : m === 'POST' ? 'var(--green-700)' : 'var(--blue-700)') : 'var(--ink-muted)',
                fontFamily: 'var(--font-mono)',
                px: 1.8,
              }}
            >
              {m}
            </AppButton>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>
          {filtered.length} evento{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <Card padding="tight">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>{Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
          </table>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={APP_ICONS.clipboard}
          title="Sin registros"
          description={search || methodChip !== 'Todos' ? 'Ningún evento coincide con los filtros.' : 'La bitácora está vacía.'}
          action={(search || methodChip !== 'Todos') ? { label: 'Ver todos', onClick: () => { setSearch(''); setMethodChip('Todos'); setPage(1); } } : undefined}
        />
      ) : (
        <>
          <Card padding="tight" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '43.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                  {['Método', 'Endpoint', 'Estado', 'Actor', 'Código', 'Fecha'].map((h) => (
                    <th key={h} style={{
                      padding: '10px 14px', textAlign: 'left',
                      fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                      fontWeight: 600, color: 'var(--ink-muted)', background: 'var(--blue-50)',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((log, i) => (
                  <tr
                    key={log.id}
                    style={{ borderBottom: i < paginated.length - 1 ? '1px solid var(--neutral-100)' : 'none' }}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <Badge variant={getVariant(httpMethod, log.method, 'dark')}>{log.method}</Badge>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.7813rem', color: 'var(--ink)', maxWidth: '16.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.endpoint}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.7813rem', color: 'var(--ink-muted)', maxWidth: '11.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.description || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8125rem', color: 'var(--ink)' }}>
                      {log.actorIdentifier ?? <span style={{ color: 'var(--ink-muted)' }}>{log.actorScope}</span>}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 600, color: statusColor(log.statusCode) }}>
                      {log.statusCode ?? '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Pagination page={pageSafe} totalItems={filtered.length} onChange={setPage} label="eventos" />
        </>
      )}
    </div>
  );
}

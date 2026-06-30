/* ───────────────────────────────────────────
   Audit Page — Bitácora del sistema
   Tabla cronológica · badge por método HTTP
   Filtro por método · búsqueda endpoint/actor
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { AuditLog } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { httpMethod, getVariant } from '@/types/status';

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
          <div style={{ height: '13px', borderRadius: '5px', background: 'var(--neutral-100)', width: `${w}%` }} />
        </td>
      ))}
    </tr>
  );
}

const METHODS = ['Todos', ...httpMethod.chips];

export default function AuditPage() {
  const [logs,        setLogs]        = useState<AuditLog[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [methodChip,  setMethodChip]  = useState('Todos');
  const [page,        setPage]        = useState(1);
  const PAGE_SIZE = 25;

  useEffect(() => {
    let alive = true;
    Promise.all([api.audit(), api.access()])
      .then(([auditLogs, access]) => {
        if (!alive) return;
        setLogs(auditLogs);
        setPermissions(access.permissions);
      })
      .catch(() => { if (alive) { setLogs([]); setPermissions([]); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const canRead = useMemo(
    () => permissions.includes('reports:audit') || permissions.includes('audit:read'),
    [permissions],
  );

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Permission guard */
  if (!loading && !canRead) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
            Bitácora <em style={{ color: 'var(--blue-600)', fontStyle: 'italic' }}>del sistema</em>
          </h1>
        </div>
        <EmptyState
          icon="🔒"
          title="Acceso restringido"
          description="No tienes permisos para ver el registro de auditoría."
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
          Bitácora <em style={{ color: 'var(--blue-600)', fontStyle: 'italic' }}>del sistema</em>
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
          {loading ? 'Cargando…' : `${logs.length} evento${logs.length !== 1 ? 's' : ''} registrado${logs.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* ── Search + method chips ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '380px' }}>
          <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: 'var(--ink-muted)', pointerEvents: 'none' }}>🔍</span>
          <input
            type="search"
            placeholder="Buscar endpoint, actor o descripción…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              width: '100%', height: '40px', paddingLeft: '40px', paddingRight: '12px',
              borderRadius: 'var(--radius-md)', border: '1.5px solid var(--neutral-200)',
              background: 'var(--blue-50)', fontSize: '13.5px', color: 'var(--ink)',
              fontFamily: 'var(--font-sans)', outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMethodChip(m); setPage(1); }}
              style={{
                border: methodChip === m ? `1.5px solid ${m === 'DELETE' ? 'var(--red-400)' : m === 'POST' ? 'var(--green-400)' : 'var(--blue-400)'}` : '1.5px solid var(--neutral-200)',
                background: methodChip === m ? (m === 'DELETE' ? 'var(--red-50)' : m === 'POST' ? 'var(--green-50)' : 'var(--blue-50)') : 'var(--panel)',
                color: methodChip === m ? (m === 'DELETE' ? 'var(--red-700)' : m === 'POST' ? 'var(--green-700)' : 'var(--blue-700)') : 'var(--ink-muted)',
                borderRadius: 'var(--radius-full)', padding: '5px 14px',
                fontSize: '12.5px', fontWeight: methodChip === m ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--ink-muted)' }}>
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
          icon="📋"
          title="Sin registros"
          description={search || methodChip !== 'Todos' ? 'Ningún evento coincide con los filtros.' : 'La bitácora está vacía.'}
          action={(search || methodChip !== 'Todos') ? { label: 'Ver todos', onClick: () => { setSearch(''); setMethodChip('Todos'); } } : undefined}
        />
      ) : (
        <>
          <Card padding="tight" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                  {['Método', 'Endpoint', 'Estado', 'Actor', 'Código', 'Fecha'].map((h) => (
                    <th key={h} style={{
                      padding: '10px 14px', textAlign: 'left',
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
                {paginated.map((log, i) => (
                  <tr
                    key={log.id}
                    style={{ borderBottom: i < paginated.length - 1 ? '1px solid var(--neutral-100)' : 'none' }}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <Badge variant={getVariant(httpMethod, log.method, 'dark')}>{log.method}</Badge>
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--ink)', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.endpoint}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12.5px', color: 'var(--ink-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.description || '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--ink)' }}>
                      {log.actorIdentifier ?? <span style={{ color: 'var(--ink-muted)' }}>{log.actorScope}</span>}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: statusColor(log.statusCode) }}>
                      {log.statusCode ?? '—'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                style={{ height: '36px', padding: '0 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--neutral-200)', background: 'var(--panel)', color: page === 1 ? 'var(--neutral-300)' : 'var(--ink)', fontSize: '13px', cursor: page === 1 ? 'default' : 'pointer', fontFamily: 'var(--font-sans)' }}>
                ← Anterior
              </button>
              <span style={{ fontSize: '13px', color: 'var(--ink-muted)', padding: '0 8px' }}>
                Página {page} de {totalPages}
              </span>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ height: '36px', padding: '0 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--neutral-200)', background: 'var(--panel)', color: page === totalPages ? 'var(--neutral-300)' : 'var(--ink)', fontSize: '13px', cursor: page === totalPages ? 'default' : 'pointer', fontFamily: 'var(--font-sans)' }}>
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

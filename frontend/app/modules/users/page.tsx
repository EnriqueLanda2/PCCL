/* ───────────────────────────────────────────
   Users Page — Gestión de usuarios
   Tabla con Avatar, badge activo/inactivo,
   búsqueda, filtro de estado, permiso crear
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar, getInitials } from '@/components/ui/Avatar';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
      {[48, 40, 40, 22].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div style={{ height: '14px', borderRadius: '6px', background: 'var(--neutral-100)', width: `${w}%` }} />
        </td>
      ))}
      <td style={{ padding: '14px 16px' }}>
        <div style={{ height: '22px', borderRadius: '999px', background: 'var(--neutral-100)', width: '70px' }} />
      </td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ height: '32px', borderRadius: '8px', background: 'var(--neutral-100)', width: '72px' }} />
      </td>
    </tr>
  );
}

export default function UsersPage() {
  const [users,       setUsers]       = useState<User[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    let alive = true;
    Promise.all([api.users(), api.access()])
      .then(([userList, access]) => {
        if (!alive) return;
        setUsers(userList);
        setPermissions(access.permissions);
      })
      .catch(() => { if (alive) { setUsers([]); setPermissions([]); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const canCreate = useMemo(() => permissions.includes('users:create'), [permissions]);
  const canEdit   = useMemo(() => permissions.includes('users:update'), [permissions]);

  /* ── Stats ── */
  const active   = useMemo(() => users.filter((u) => u.active).length,  [users]);
  const inactive = useMemo(() => users.filter((u) => !u.active).length, [users]);

  /* ── Filtered ── */
  const filtered = useMemo(() => {
    let list = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter === 'active')   list = list.filter((u) => u.active);
    if (statusFilter === 'inactive') list = list.filter((u) => !u.active);
    return list;
  }, [users, search, statusFilter]);

  const STATUS_CHIPS: { key: typeof statusFilter; label: string }[] = [
    { key: 'all',      label: 'Todos'     },
    { key: 'active',   label: 'Activos'   },
    { key: 'inactive', label: 'Inactivos' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
            Gestión de <em style={{ color: 'var(--blue-600)', fontStyle: 'italic' }}>usuarios</em>
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
            {loading ? 'Cargando…' : `${users.length} cuenta${users.length !== 1 ? 's' : ''} registrada${users.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {canCreate && (
          <Button variant="primary" size="md">+ Nuevo usuario</Button>
        )}
      </div>

      {/* ── Stats ── */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <StatCard label="Total"     value={users.length} />
          <StatCard label="Activos"   value={active}   deltaUp />
          <StatCard label="Inactivos" value={inactive}  deltaUp={false} />
        </div>
      )}

      {/* ── Search + chips ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '360px' }}>
          <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: 'var(--ink-muted)', pointerEvents: 'none' }}>🔍</span>
          <input
            type="search"
            placeholder="Buscar por nombre o correo…"
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
        <div style={{ display: 'flex', gap: '6px' }}>
          {STATUS_CHIPS.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setStatusFilter(chip.key)}
              style={{
                border: statusFilter === chip.key ? '1.5px solid var(--blue-600)' : '1.5px solid var(--neutral-200)',
                background: statusFilter === chip.key ? 'var(--blue-50)' : 'var(--panel)',
                color: statusFilter === chip.key ? 'var(--blue-700)' : 'var(--ink-muted)',
                borderRadius: 'var(--radius-full)', padding: '6px 16px',
                fontSize: '13px', fontWeight: statusFilter === chip.key ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--ink-muted)' }}>
          {filtered.length} de {users.length}
        </span>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <Card padding="tight">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
          </table>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Sin usuarios"
          description={
            search || statusFilter !== 'all'
              ? 'Ningún usuario coincide con la búsqueda.'
              : canCreate
              ? 'Aún no hay usuarios. ¡Agrega el primero!'
              : 'No hay usuarios registrados en el sistema.'
          }
          action={
            (search || statusFilter !== 'all')
              ? { label: 'Ver todos', onClick: () => { setSearch(''); setStatusFilter('all'); } }
              : undefined
          }
        />
      ) : (
        <Card padding="tight">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                {['Usuario', 'Correo', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
                    fontWeight: 600, color: 'var(--ink-muted)', background: 'var(--blue-50)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr
                  key={user.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--neutral-100)' : 'none' }}
                >
                  {/* Name + avatar */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Avatar initials={getInitials(user.fullName)} size="sm" />
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{user.fullName}</span>
                    </div>
                  </td>
                  {/* Email */}
                  <td style={{ padding: '14px 16px', fontSize: '13.5px', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                    {user.email}
                  </td>
                  {/* Status badge */}
                  <td style={{ padding: '14px 16px' }}>
                    <Badge variant={user.active ? 'green' : 'yellow'}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '14px 16px' }}>
                    {canEdit && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Button variant="ghost" size="sm">Editar</Button>
                        <Button variant="danger" size="sm">{user.active ? 'Desactivar' : 'Activar'}</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

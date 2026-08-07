/* ───────────────────────────────────────────
   Users Page — Gestión de usuarios
   Tabla con Avatar, badge activo/inactivo,
   búsqueda, filtro de estado, permiso crear
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { AppButton, AppInput } from '@/app/components/ui/AppControls';
import { StudentAvatar } from '@/app/components/shared/StudentAvatar';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { APP_ICONS } from '@/lib/icons';

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
      {[48, 40, 40, 22].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div style={{ height: '0.875rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: `${w}%` }} />
        </td>
      ))}
      <td style={{ padding: '14px 16px' }}>
        <div style={{ height: '1.375rem', borderRadius: '999px', background: 'var(--neutral-100)', width: '4.375rem' }} />
      </td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ height: '2rem', borderRadius: '0.5rem', background: 'var(--neutral-100)', width: '4.5rem' }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <PageHeader
        title={<>Gestión de usuarios</>}
        subtitle={loading ? 'Cargando…' : `${users.length} cuenta${users.length !== 1 ? 's' : ''} registrada${users.length !== 1 ? 's' : ''}`}
        action={canCreate ? <Button variant="primary" size="md">+ Nuevo usuario</Button> : undefined}
      />

      {/* ── Stats ── */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '1rem' }}>
          <StatCard label="Total"     value={users.length} icon={<Icon icon={APP_ICONS.users} width={20} height={20} />} />
          <StatCard label="Activos"   value={active}   deltaUp icon={<Icon icon={APP_ICONS.checkFilled} width={20} height={20} />} variant="green" />
          <StatCard label="Inactivos" value={inactive}  deltaUp={false} icon={<Icon icon={APP_ICONS.lock} width={20} height={20} />} variant="yellow" />
        </div>
      )}

      {/* ── Search + chips ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', minWidth: '15rem', maxWidth: '26.25rem' }}>
          <AppInput
            type="search"
            placeholder="Buscar por nombre o correo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            withSearchIcon
          />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {STATUS_CHIPS.map((chip) => (
            <AppButton
              key={chip.key}
              type="button"
              onClick={() => setStatusFilter(chip.key)}
              variant={statusFilter === chip.key ? 'contained' : 'outlined'}
              sx={{
                borderColor: statusFilter === chip.key ? 'var(--blue-500)' : 'var(--neutral-200)',
                bgcolor: statusFilter === chip.key ? 'var(--blue-50)' : 'var(--panel)',
                color: statusFilter === chip.key ? 'var(--blue-700)' : 'var(--ink-muted)',
                px: 2,
              }}
            >
              {chip.label}
            </AppButton>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>
          {filtered.length} de {users.length}
        </span>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <Card padding="tight" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '38rem' }}>
            <tbody>{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</tbody>
          </table>
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={APP_ICONS.users}
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
        <Card padding="tight" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '38rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                {['Usuario', 'Correo', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em',
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <StudentAvatar
                        userId={user.id}
                        fullName={user.fullName}
                        avatarUrl={user.avatarUrl}
                        size="sm"
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>{user.fullName}</span>
                    </div>
                  </td>
                  {/* Email */}
                  <td style={{ padding: '14px 16px', fontSize: '0.8438rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
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
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
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

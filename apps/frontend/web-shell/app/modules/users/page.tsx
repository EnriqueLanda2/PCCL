/* ───────────────────────────────────────────
   Users Page — Gestión de usuarios
   Tabla con avatar, edición real y switch
   para activar/desactivar cuentas.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import { api } from '@/lib/api';
import type { RbacRole, User } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { Modal } from '@/app/components/ui/Modal';
import { AppButton, AppInput, AppSelect } from '@/app/components/ui/AppControls';
import { StudentAvatar } from '@/app/components/shared/StudentAvatar';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { APP_ICONS } from '@/lib/icons';

type StatusFilter = 'all' | 'active' | 'inactive';

type EditFormState = {
  fullName: string;
  email: string;
  roleIds: string[];
};

type CreateFormState = EditFormState & {
  password: string;
};

function userRoleIds(user: User): string[] {
  return user.userRoles
    ?.map((userRole) => userRole.role?.id)
    .filter((roleId): roleId is string => Boolean(roleId)) ?? [];
}

function userRoleLabel(user: User): string {
  const names = user.userRoles
    ?.map((userRole) => userRole.role?.name)
    .filter((name): name is string => Boolean(name)) ?? [];
  return names.length > 0 ? names.join(', ') : 'Sin rol';
}

/* ── Skeleton row ── */
function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
      {[48, 34, 24, 22].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div style={{ height: '0.875rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: `${w}%` }} />
        </td>
      ))}
      <td style={{ padding: '14px 16px' }}>
        <div style={{ height: '2rem', borderRadius: '999px', background: 'var(--neutral-100)', width: '4.25rem' }} />
      </td>
    </tr>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [rolesCatalog, setRolesCatalog] = useState<RbacRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({ fullName: '', email: '', roleIds: [] });
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFormState>({
    fullName: '',
    email: '',
    password: '',
    roleIds: [],
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [activeChangeUserId, setActiveChangeUserId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([api.users(), api.access(), api.rbacCatalogs()])
      .then(([userList, access, catalogs]) => {
        if (!alive) return;
        setUsers(userList);
        setPermissions(access.permissions);
        setRolesCatalog(catalogs.roles.filter((role) => role.active));
      })
      .catch(() => {
        if (!alive) return;
        setUsers([]);
        setPermissions([]);
        setRolesCatalog([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const canCreate = useMemo(() => permissions.includes('users:create'), [permissions]);
  const canEdit = useMemo(() => permissions.includes('users:update'), [permissions]);

  const active = useMemo(() => users.filter((user) => user.active).length, [users]);
  const inactive = useMemo(() => users.filter((user) => !user.active).length, [users]);

  const filtered = useMemo(() => {
    let list = [...users];
    if (search.trim()) {
      const query = search.toLowerCase();
      list = list.filter((user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
      );
    }
    if (statusFilter === 'active') list = list.filter((user) => user.active);
    if (statusFilter === 'inactive') list = list.filter((user) => !user.active);
    return list;
  }, [users, search, statusFilter]);

  const statusChips: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'active', label: 'Activos' },
    { key: 'inactive', label: 'Inactivos' },
  ];

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName,
      email: user.email,
      roleIds: userRoleIds(user),
    });
  };

  const closeEditModal = () => {
    if (savingEdit) return;
    setEditingUser(null);
    setEditForm({ fullName: '', email: '', roleIds: [] });
  };

  const closeCreateModal = () => {
    if (creatingUser) return;
    setCreateOpen(false);
    setCreateForm({
      fullName: '',
      email: '',
      password: '',
      roleIds: [],
    });
  };

  const patchUserInList = (updatedUser: User) => {
    setUsers((current) =>
      current.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );
  };

  const addUserToList = (createdUser: User) => {
    setUsers((current) => [createdUser, ...current]);
  };

  const handleToggleActive = async (user: User, nextActive: boolean) => {
    setActiveChangeUserId(user.id);
    try {
      const updatedUser = await api.updateUser(user.id, { active: nextActive });
      patchUserInList(updatedUser);
      if (editingUser?.id === updatedUser.id) {
        setEditingUser(updatedUser);
      }
    } finally {
      setActiveChangeUserId(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    setSavingEdit(true);
    try {
      const updatedUser = await api.updateUser(editingUser.id, {
        fullName: editForm.fullName.trim(),
        email: editForm.email.trim(),
        roleIds: editForm.roleIds,
      });
      patchUserInList(updatedUser);
      closeEditModal();
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCreateUser = async () => {
    setCreatingUser(true);
    try {
      const createdUser = await api.createUser({
        fullName: createForm.fullName.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        roleIds: createForm.roleIds,
      });
      addUserToList(createdUser);
      closeCreateModal();
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <PageHeader
          title={<>Gestión de usuarios</>}
          subtitle={loading ? 'Cargando…' : `${users.length} cuenta${users.length !== 1 ? 's' : ''} registrada${users.length !== 1 ? 's' : ''}`}
          action={canCreate ? <Button variant="primary" size="md" onClick={() => setCreateOpen(true)}>+ Nuevo usuario</Button> : undefined}
        />

        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '1rem' }}>
            <StatCard label="Total" value={users.length} icon={<Icon icon={APP_ICONS.users} width={20} height={20} />} />
            <StatCard label="Activos" value={active} deltaUp icon={<Icon icon={APP_ICONS.checkFilled} width={20} height={20} />} variant="green" />
            <StatCard label="Inactivos" value={inactive} deltaUp={false} icon={<Icon icon={APP_ICONS.lock} width={20} height={20} />} variant="yellow" />
          </div>
        )}

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
            {statusChips.map((chip) => (
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

        {loading ? (
          <Card padding="tight" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '44rem' }}>
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
              search || statusFilter !== 'all'
                ? { label: 'Ver todos', onClick: () => { setSearch(''); setStatusFilter('all'); } }
                : undefined
            }
          />
        ) : (
          <Card padding="tight" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '44rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                  {['Usuario', 'Correo', 'Rol', 'Estado', 'Acciones'].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 600,
                        color: 'var(--ink-muted)',
                        background: 'var(--blue-50)',
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, index) => (
                  <tr
                    key={user.id}
                    style={{ borderBottom: index < filtered.length - 1 ? '1px solid var(--neutral-100)' : 'none' }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <StudentAvatar userId={user.id} fullName={user.fullName} avatarUrl={user.avatarUrl} size="sm" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>{user.fullName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8438rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>
                      {userRoleLabel(user)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Badge variant={user.active ? 'green' : 'yellow'}>
                          {user.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                        {canEdit && (
                          <Switch
                            checked={user.active}
                            onChange={(_, checked) => { void handleToggleActive(user, checked); }}
                            disabled={activeChangeUserId === user.id}
                            size="small"
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--green-500)' },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--green-400)' },
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<Icon icon={APP_ICONS.edit} width={14} height={14} />}
                          onClick={() => openEditModal(user)}
                        >
                          Editar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <Modal
        open={editingUser !== null}
        onClose={closeEditModal}
        title={editingUser ? `Editar a ${editingUser.fullName}` : 'Editar usuario'}
        description="Actualiza nombre, correo y rol del usuario."
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          <AppInput
            label="Nombre completo"
            value={editForm.fullName}
            onChange={(e) => setEditForm((current) => ({ ...current, fullName: e.target.value }))}
          />
          <AppInput
            type="email"
            label="Correo electrónico"
            value={editForm.email}
            onChange={(e) => setEditForm((current) => ({ ...current, email: e.target.value }))}
          />
          <AppSelect
            multiple
            value={editForm.roleIds}
            onChange={(e) => {
              const value = e.target.value;
              setEditForm((current) => ({
                ...current,
                roleIds: typeof value === 'string' ? value.split(',').filter(Boolean) : value as string[],
              }));
            }}
            renderValue={(selected) => {
              const values = Array.isArray(selected) ? selected : [];
              const labels = rolesCatalog
                .filter((role) => values.includes(role.id))
                .map((role) => role.name);
              return labels.length > 0 ? labels.join(', ') : 'Selecciona roles';
            }}
            displayEmpty
          >
            {rolesCatalog.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </AppSelect>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" type="button" onClick={closeEditModal} disabled={savingEdit}>
              Cancelar
            </Button>
            <Button variant="primary" type="button" onClick={() => { void handleSaveEdit(); }} loading={savingEdit}>
              Guardar cambios
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={createOpen}
        onClose={closeCreateModal}
        title="Nuevo usuario"
        description="Crea una cuenta y asígnale uno o más roles."
      >
        <div style={{ display: 'grid', gap: '1rem' }}>
          <AppInput
            label="Nombre completo"
            value={createForm.fullName}
            onChange={(e) => setCreateForm((current) => ({ ...current, fullName: e.target.value }))}
          />
          <AppInput
            type="email"
            label="Correo electrónico"
            value={createForm.email}
            onChange={(e) => setCreateForm((current) => ({ ...current, email: e.target.value }))}
          />
          <AppInput
            type="password"
            label="Contraseña temporal"
            value={createForm.password}
            onChange={(e) => setCreateForm((current) => ({ ...current, password: e.target.value }))}
          />
          <AppSelect
            multiple
            value={createForm.roleIds}
            onChange={(e) => {
              const value = e.target.value;
              setCreateForm((current) => ({
                ...current,
                roleIds: typeof value === 'string' ? value.split(',').filter(Boolean) : value as string[],
              }));
            }}
            renderValue={(selected) => {
              const values = Array.isArray(selected) ? selected : [];
              const labels = rolesCatalog
                .filter((role) => values.includes(role.id))
                .map((role) => role.name);
              return labels.length > 0 ? labels.join(', ') : 'Selecciona roles';
            }}
            displayEmpty
          >
            {rolesCatalog.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </AppSelect>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.625rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" type="button" onClick={closeCreateModal} disabled={creatingUser}>
              Cancelar
            </Button>
            <Button variant="primary" type="button" onClick={() => { void handleCreateUser(); }} loading={creatingUser}>
              Crear usuario
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

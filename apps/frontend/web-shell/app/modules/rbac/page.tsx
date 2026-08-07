/* ───────────────────────────────────────────
   RBAC Page — Roles, módulos y privilegios
   3 paneles: Roles · Módulos · Privilegios
   Búsqueda y badge por módulo/estado
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { RbacCatalogs, RbacRole, RbacModule, RbacPrivilege } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { AppInput } from '@/app/components/ui/AppControls';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { APP_ICONS } from '@/lib/icons';

/* ── Section panel ── */
function Section({ title, icon, count, children }: { title: string; icon: string; count: number; children: React.ReactNode }) {
  return (
    <Card padding="default" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: 'var(--blue-50)', color: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon={icon} width={18} height={18} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--ink)' }}>{title}</h2>
        </div>
        <span style={{ fontSize: '0.75rem', background: 'var(--blue-50)', color: 'var(--blue-600)', padding: '3px 10px', borderRadius: '999px', fontWeight: 600 }}>
          {count}
        </span>
      </div>
      {children}
    </Card>
  );
}

/* ── Role row ── */
function RoleRow({ role, last }: { role: RbacRole; last: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--neutral-100)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: role.active ? 'var(--green-400)' : 'var(--neutral-300)' }} />
        <span style={{ fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>{role.name}</span>
      </div>
      <Badge variant={role.active ? 'green' : 'yellow'}>{role.active ? 'Activo' : 'Inactivo'}</Badge>
    </div>
  );
}

/* ── Module row ── */
function ModuleRow({ mod, last }: { mod: RbacModule; last: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--neutral-100)' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500 }}>{mod.name}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--blue-600)', background: 'var(--blue-50)', padding: '3px 8px', borderRadius: '0.375rem' }}>
        {mod.key}
      </span>
    </div>
  );
}

/* ── Privilege row ── */
function PrivilegeRow({ priv, last }: { priv: RbacPrivilege; last: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--neutral-100)', gap: '0.625rem' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--ink)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7813rem', color: 'var(--blue-700)' }}>{priv.code}</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginTop: '2px' }}>{priv.action}</div>
      </div>
      <Badge variant="dark">{priv.module.name}</Badge>
    </div>
  );
}

/* ── Skeleton section ── */
function SkeletonSection() {
  return (
    <Card padding="default">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
        <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: 'var(--neutral-100)' }} />
        <div style={{ height: '1.125rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: '5rem' }} />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ height: '0.875rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', marginBottom: '0.875rem', width: `${60 + i * 8}%` }} />
      ))}
    </Card>
  );
}

export default function RbacPage() {
  const [catalogs, setCatalogs] = useState<RbacCatalogs | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    let alive = true;
    api.rbacCatalogs()
      .then((data) => { if (alive) setCatalogs(data); })
      .catch(() => { if (alive) setCatalogs(null); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  /* Filtered */
  const filteredRoles = useMemo(() => {
    if (!catalogs) return [];
    const q = search.toLowerCase();
    return catalogs.roles.filter((r) => r.name.toLowerCase().includes(q));
  }, [catalogs, search]);

  const filteredModules = useMemo(() => {
    if (!catalogs) return [];
    const q = search.toLowerCase();
    return catalogs.modules.filter((m) => m.name.toLowerCase().includes(q) || m.key.toLowerCase().includes(q));
  }, [catalogs, search]);

  const filteredPrivileges = useMemo(() => {
    if (!catalogs) return [];
    const q = search.toLowerCase();
    return catalogs.privileges.filter((p) =>
      p.code.toLowerCase().includes(q) ||
      p.action.toLowerCase().includes(q) ||
      p.module.name.toLowerCase().includes(q)
    );
  }, [catalogs, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <PageHeader
        title={<>Control de acceso (RBAC)</>}
        subtitle="Catálogos de roles, módulos y privilegios del sistema."
      />

      {/* ── Stats ── */}
      {!loading && catalogs && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '1rem' }}>
          <StatCard label="Roles"       value={catalogs.roles.length}      icon={<Icon icon={APP_ICONS.users} width={20} height={20} />} />
          <StatCard label="Módulos"     value={catalogs.modules.length}    icon={<Icon icon={APP_ICONS.folder} width={20} height={20} />} variant="blue" />
          <StatCard label="Privilegios" value={catalogs.privileges.length} icon={<Icon icon={APP_ICONS.key} width={20} height={20} />} variant="purple" />
        </div>
      )}

      {/* ── Search ── */}
      <div style={{ maxWidth: '26.25rem' }}>
        <AppInput
          type="search"
          placeholder="Filtrar roles, módulos o privilegios…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          withSearchIcon
        />
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))', gap: '1.25rem' }}>
          <SkeletonSection />
          <SkeletonSection />
          <SkeletonSection />
        </div>
      ) : !catalogs ? (
        <EmptyState
          icon={APP_ICONS.settings}
          title="Error al cargar"
          description="No se pudieron cargar los catálogos RBAC. Verifica tu conexión al backend."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
          {/* Roles */}
          <Section title="Roles" icon={APP_ICONS.users} count={filteredRoles.length}>
            {filteredRoles.length === 0 ? (
              <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', padding: '8px 0' }}>Sin coincidencias</p>
            ) : (
              filteredRoles.map((role, i) => (
                <RoleRow key={role.id} role={role} last={i === filteredRoles.length - 1} />
              ))
            )}
          </Section>

          {/* Modules */}
          <Section title="Módulos" icon={APP_ICONS.folder} count={filteredModules.length}>
            {filteredModules.length === 0 ? (
              <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', padding: '8px 0' }}>Sin coincidencias</p>
            ) : (
              filteredModules.map((mod, i) => (
                <ModuleRow key={mod.id} mod={mod} last={i === filteredModules.length - 1} />
              ))
            )}
          </Section>

          {/* Privileges */}
          <Section title="Privilegios" icon={APP_ICONS.key} count={filteredPrivileges.length}>
            {filteredPrivileges.length === 0 ? (
              <p style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', padding: '8px 0' }}>Sin coincidencias</p>
            ) : (
              filteredPrivileges.map((priv, i) => (
                <PrivilegeRow key={priv.id} priv={priv} last={i === filteredPrivileges.length - 1} />
              ))
            )}
          </Section>
        </div>
      )}
    </div>
  );
}

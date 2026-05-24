/* ───────────────────────────────────────────
   RBAC Page — Roles, módulos y privilegios
   3 paneles: Roles · Módulos · Privilegios
   Búsqueda y badge por módulo/estado
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { RbacCatalogs, RbacRole, RbacModule, RbacPrivilege } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';

/* ── Section panel ── */
function Section({ title, icon, count, children }: { title: string; icon: string; count: number; children: React.ReactNode }) {
  return (
    <Card padding="default" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            {icon}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--ink)' }}>{title}</h2>
        </div>
        <span style={{ fontSize: '12px', background: 'var(--blue-50)', color: 'var(--blue-600)', padding: '3px 10px', borderRadius: '999px', fontWeight: 600 }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: role.active ? 'var(--green-400)' : 'var(--neutral-300)' }} />
        <span style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: 500 }}>{role.name}</span>
      </div>
      <Badge variant={role.active ? 'green' : 'yellow'}>{role.active ? 'Activo' : 'Inactivo'}</Badge>
    </div>
  );
}

/* ── Module row ── */
function ModuleRow({ mod, last }: { mod: RbacModule; last: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--neutral-100)' }}>
      <span style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: 500 }}>{mod.name}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--blue-600)', background: 'var(--blue-50)', padding: '3px 8px', borderRadius: '6px' }}>
        {mod.key}
      </span>
    </div>
  );
}

/* ── Privilege row ── */
function PrivilegeRow({ priv, last }: { priv: RbacPrivilege; last: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: last ? 'none' : '1px solid var(--neutral-100)', gap: '10px' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--blue-700)' }}>{priv.code}</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '2px' }}>{priv.action}</div>
      </div>
      <Badge variant="dark">{priv.module.name}</Badge>
    </div>
  );
}

/* ── Skeleton section ── */
function SkeletonSection() {
  return (
    <Card padding="default">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--neutral-100)' }} />
        <div style={{ height: '18px', borderRadius: '6px', background: 'var(--neutral-100)', width: '80px' }} />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ height: '14px', borderRadius: '6px', background: 'var(--neutral-100)', marginBottom: '14px', width: `${60 + i * 8}%` }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
          Control de <em style={{ color: 'var(--blue-600)', fontStyle: 'italic' }}>acceso (RBAC)</em>
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
          Catálogos de roles, módulos y privilegios del sistema.
        </p>
      </div>

      {/* ── Stats ── */}
      {!loading && catalogs && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <StatCard label="Roles"       value={catalogs.roles.length}      />
          <StatCard label="Módulos"     value={catalogs.modules.length}    />
          <StatCard label="Privilegios" value={catalogs.privileges.length} />
        </div>
      )}

      {/* ── Search ── */}
      <div style={{ position: 'relative', maxWidth: '380px' }}>
        <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: 'var(--ink-muted)', pointerEvents: 'none' }}>🔍</span>
        <input
          type="search"
          placeholder="Filtrar roles, módulos o privilegios…"
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

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <SkeletonSection />
          <SkeletonSection />
          <SkeletonSection />
        </div>
      ) : !catalogs ? (
        <EmptyState
          icon="⚙️"
          title="Error al cargar"
          description="No se pudieron cargar los catálogos RBAC. Verifica tu conexión al backend."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {/* Roles */}
          <Section title="Roles" icon="🎭" count={filteredRoles.length}>
            {filteredRoles.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', padding: '8px 0' }}>Sin coincidencias</p>
            ) : (
              filteredRoles.map((role, i) => (
                <RoleRow key={role.id} role={role} last={i === filteredRoles.length - 1} />
              ))
            )}
          </Section>

          {/* Modules */}
          <Section title="Módulos" icon="🗂️" count={filteredModules.length}>
            {filteredModules.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', padding: '8px 0' }}>Sin coincidencias</p>
            ) : (
              filteredModules.map((mod, i) => (
                <ModuleRow key={mod.id} mod={mod} last={i === filteredModules.length - 1} />
              ))
            )}
          </Section>

          {/* Privileges */}
          <Section title="Privilegios" icon="🔑" count={filteredPrivileges.length}>
            {filteredPrivileges.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', padding: '8px 0' }}>Sin coincidencias</p>
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

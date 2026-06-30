/* ───────────────────────────────────────────
   Certificates Page — Constancias
   Listado con CertificateRow · Stats row
   Filtro por estado · Descarga si tiene permiso
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Certificate } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { CertificateRow } from '@/components/shared/CertificateRow';
import { certificateStatus, getVariant, getLabel } from '@/types/status';

/* ── Skeleton ── */
function SkeletonCertRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 0', borderBottom: '1px solid var(--neutral-100)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--neutral-100)', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '14px', borderRadius: '6px', background: 'var(--neutral-100)', width: '50%' }} />
        <div style={{ height: '12px', borderRadius: '6px', background: 'var(--neutral-100)', width: '35%' }} />
      </div>
      <div style={{ width: '80px', height: '22px', borderRadius: '999px', background: 'var(--neutral-100)' }} />
      <div style={{ width: '90px', height: '36px', borderRadius: '8px', background: 'var(--neutral-100)' }} />
    </div>
  );
}

/* Chips: 'all' + las chips del mapa (Vigentes, Expirados, Revocados) */
const STATUS_CHIPS = [
  { key: 'all', label: 'Todos' },
  ...certificateStatus.chips.slice(1).map((label) => ({
    key:   certificateStatus.chipKey![label] as string,
    label,
  })),
];

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [permissions,  setPermissions]  = useState<string[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [statusChip,   setStatusChip]   = useState('all');
  const [search,       setSearch]       = useState('');

  useEffect(() => {
    let alive = true;
    Promise.all([api.certificates(), api.access()])
      .then(([list, access]) => {
        if (!alive) return;
        setCertificates(list);
        setPermissions(access.permissions);
      })
      .catch(() => { if (alive) { setCertificates([]); setPermissions([]); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const canDownload = useMemo(() => permissions.includes('certificates:download'), [permissions]);

  /* ── Stats ── */
  const valid   = useMemo(() => certificates.filter((c) => c.status === 'valid').length,   [certificates]);
  const expired = useMemo(() => certificates.filter((c) => c.status === 'expired').length, [certificates]);
  const revoked = useMemo(() => certificates.filter((c) => c.status === 'revoked').length, [certificates]);

  /* ── Filtered ── */
  const filtered = useMemo(() => {
    let list = [...certificates];
    if (statusChip !== 'all') list = list.filter((c) => c.status === statusChip);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.certificateNumber.toLowerCase().includes(q) ||
        (c.inscription?.course?.title ?? '').toLowerCase().includes(q) ||
        (c.inscription?.user?.fullName ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [certificates, statusChip, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
          Constancias <em style={{ color: 'var(--green-500)', fontStyle: 'italic' }}>y certificados</em>
        </h1>
        <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
          {loading ? 'Cargando…' : `${certificates.length} constancia${certificates.length !== 1 ? 's' : ''} emitidas`}
        </p>
      </div>

      {/* ── Stat row ── */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Total"     value={certificates.length} />
          <StatCard label="Vigentes"  value={valid}   deltaUp />
          <StatCard label="Expirados" value={expired}  deltaUp={false} />
          <StatCard label="Revocados" value={revoked}  deltaUp={false} />
        </div>
      )}

      {/* ── Featured: latest cert ── */}
      {!loading && valid > 0 && (() => {
        const latest = [...certificates]
          .filter((c) => c.status === 'valid')
          .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))[0];
        if (!latest) return null;
        return (
          <Card variant="dark" padding="default">
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              {/* Seal */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '18px', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px', boxShadow: '0 6px 20px rgba(12,29,92,0.4)',
              }}>
                🎓
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: 'var(--blue-300)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, marginBottom: '4px' }}>
                  Última constancia emitida
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--panel)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {latest.inscription?.course?.title ?? 'Curso completado'}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--blue-300)' }}>
                  Folio: <strong style={{ color: 'var(--panel)', fontFamily: 'var(--font-mono)' }}>{latest.certificateNumber}</strong>
                  {' · '} Emitida el {new Date(latest.issuedAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
              {canDownload && (
                <Button variant="secondary" size="md" style={{ flexShrink: 0 }}>
                  ↓ Descargar PDF
                </Button>
              )}
            </div>
          </Card>
        );
      })()}

      {/* ── Search + chips ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '320px' }}>
          <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: 'var(--ink-muted)', pointerEvents: 'none' }}>🔍</span>
          <input
            type="search"
            placeholder="Buscar folio, curso o alumno…"
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
          {STATUS_CHIPS.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => setStatusChip(chip.key)}
              style={{
                border: statusChip === chip.key ? '1.5px solid var(--green-500)' : '1.5px solid var(--neutral-200)',
                background: statusChip === chip.key ? 'var(--green-50)' : 'var(--panel)',
                color: statusChip === chip.key ? 'var(--green-700)' : 'var(--ink-muted)',
                borderRadius: 'var(--radius-full)', padding: '6px 16px',
                fontSize: '13px', fontWeight: statusChip === chip.key ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      {loading ? (
        <Card padding="default">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCertRow key={i} />)}
        </Card>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🎓"
          title="Sin constancias"
          description={
            search || statusChip !== 'all'
              ? 'Ninguna constancia coincide con tu búsqueda.'
              : 'Aún no se han emitido constancias en el sistema.'
          }
          action={
            (search || statusChip !== 'all')
              ? { label: 'Ver todas', onClick: () => { setSearch(''); setStatusChip('all'); } }
              : undefined
          }
        />
      ) : (
        <Card padding="default">
          <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
            Mostrando <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> de {certificates.length}
          </div>
          {filtered.map((cert, i) => (
            <div
              key={cert.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px 0',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--neutral-100)' : 'none',
              }}
            >
              {/* Seal icon */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px',
              }}>
                🎓
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cert.inscription?.course?.title ?? 'Curso completado'}
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--ink-muted)', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{cert.certificateNumber}</span>
                  <span>Emitida: {new Date(cert.issuedAt).toLocaleDateString('es-MX')}</span>
                  {cert.expiresAt && (
                    <span>Vence: {new Date(cert.expiresAt).toLocaleDateString('es-MX')}</span>
                  )}
                  {cert.inscription?.user?.fullName && (
                    <span>· {cert.inscription.user.fullName}</span>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <Badge variant={getVariant(certificateStatus, cert.status)}>
                {getLabel(certificateStatus, cert.status)}
              </Badge>

              {/* Download */}
              {canDownload && cert.status === 'valid' && (
                <Button variant="ghost" size="sm">↓ PDF</Button>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   Certificates Page — Certificaciones
   Grid de CertificateHoloCard (tilt holográfico
   + flip 3D con QR de verificación pública)
   Stats · búsqueda · filtro por estado
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import { api } from '@/lib/api';
import { toCardData } from '@/lib/certificates';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { AppButton, AppInput, AppSelect } from '@/app/components/ui/AppControls';
import { DEFAULT_PAGE_SIZE, Pagination } from '@/app/components/ui/Pagination';
import { PageLoader } from '@/app/components/ui/WaveSpinner';
import { CertificateHoloCard, type CertificateCardData } from '@/app/components/ui/CertificateHoloCard';
import { APP_ICONS } from '@/lib/icons';

const STATUS_LABEL: Record<string, string> = {
  valid: 'Emitidos',
  pending: 'Pendientes',
  expired: 'Expirados',
  revoked: 'Revocados',
};

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateCardData[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [failed,       setFailed]       = useState(false);
  const [statusChip,   setStatusChip]   = useState<'all' | CertificateCardData['status']>('all');
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(1);

  useEffect(() => {
    let alive = true;
    /* Nada de datos de muestra: la lista llega ya acotada al usuario por el
       gateway, y rellenar una lista vacía con ejemplos mostraba nombres de
       otras personas como si fueran certificados propios. */
    api.certificates()
      .then((list) => { if (alive) setCertificates(list.map(toCardData)); })
      .catch(() => { if (alive) setFailed(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const issued  = useMemo(() => certificates.filter((c) => c.status === 'valid').length,   [certificates]);
  const pending = useMemo(() => certificates.filter((c) => c.status === 'pending').length, [certificates]);
  const rate    = certificates.length > 0 ? Math.round((issued / certificates.length) * 100) : 0;
  const statusOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const cert of certificates) counts.set(cert.status, (counts.get(cert.status) ?? 0) + 1);
    return Array.from(counts.entries()).map(([value, count]) => ({ value, label: STATUS_LABEL[value] ?? value, count }));
  }, [certificates]);

  const filtered = useMemo(() => {
    let list = [...certificates];
    if (statusChip !== 'all') list = list.filter((c) => c.status === statusChip);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.folio.toLowerCase().includes(q) ||
        c.courseTitle.toLowerCase().includes(q) ||
        c.studentName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [certificates, statusChip, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / DEFAULT_PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * DEFAULT_PAGE_SIZE, pageSafe * DEFAULT_PAGE_SIZE);

  const clearFilters = () => {
    setSearch('');
    setStatusChip('all');
    setPage(1);
  };

  if (loading) return <PageLoader label="Cargando certificaciones…" />;

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── Header ── */}
      <PageHeader title="Certificaciones" subtitle="Emite y aprueba certificados de tus cursos" />

      <div className="rounded-[1.375rem] border border-[var(--neutral-100)] bg-white/85 p-3 shadow-[0_10px_28px_rgba(23,50,77,0.06)]">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[15rem] flex-1">
            <AppInput
              type="search"
              placeholder="Buscar folio, curso o estudiante…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              withSearchIcon
            />
          </div>
          <div className="min-w-[13.75rem]">
            <label className="mb-1.5 block text-[0.8125rem] font-bold text-[var(--ink)]">Estado</label>
              <AppSelect
                value={statusChip}
                onChange={(e: SelectChangeEvent) => { setStatusChip(e.target.value as typeof statusChip); setPage(1); }}
              >
                <MenuItem value="all">Todos los estados</MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label} ({option.count})</MenuItem>
                ))}
              </AppSelect>
          </div>
          {(search || statusChip !== 'all') && (
              <div>
                <AppButton variant="outlined" onClick={clearFilters}>
                  Limpiar filtros
                </AppButton>
              </div>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Emitidos"              value={issued}  deltaUp icon={<Icon icon={APP_ICONS.diplomaVerified} width={20} height={20} />} variant="green" />
        <StatCard label="Pendientes de aprobar" value={pending} icon={<Icon icon={APP_ICONS.clock} width={20} height={20} />} variant="yellow" />
        <StatCard label="Tasa de aprobación"    value={`${rate}%`} deltaUp icon={<Icon icon={APP_ICONS.chart} width={20} height={20} />} variant="blue" />
      </div>

      {/* ── Grid de holo cards ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={APP_ICONS.diploma}
          title={failed ? 'No se pudo cargar' : 'Sin certificados'}
          description={
            failed
              ? 'El servicio de certificación no respondió. Vuelve a intentarlo en unos momentos.'
              : search || statusChip !== 'all'
                ? 'Ningún certificado coincide con tu búsqueda.'
                : 'Todavía no tienes certificados. Aparecerán aquí en cuanto completes un curso.'
          }
          action={
            (search || statusChip !== 'all')
              ? { label: 'Ver todos', onClick: clearFilters }
              : undefined
          }
        />
      ) : (
        <>
          <p className="text-[0.8125rem] text-[var(--ink-muted)]">
            Mostrando <strong className="text-[var(--ink)]">{paginated.length}</strong> de {filtered.length} —
            gira cada tarjeta para ver los datos y el QR de verificación.
          </p>
          <div className="grid gap-7 md:grid-cols-2 2xl:grid-cols-3">
            {paginated.map((cert) => (
              <CertificateHoloCard key={cert.folio} data={cert} showSparkles />
            ))}
          </div>
          <Pagination page={pageSafe} totalItems={filtered.length} onChange={setPage} label="certificados" />
        </>
      )}
    </div>
  );
}

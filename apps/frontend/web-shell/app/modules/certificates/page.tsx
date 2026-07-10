/* ───────────────────────────────────────────
   Certificates Page — Certificaciones
   Grid de CertificateHoloCard (tilt holográfico
   + flip 3D con QR de verificación pública)
   Stats · búsqueda · filtro por estado
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import { DEMO_CERTIFICATES, toCardData } from '@/lib/certificates';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageLoader } from '@/app/components/ui/WaveSpinner';
import { CertificateHoloCard, type CertificateCardData } from '@/app/components/ui/CertificateHoloCard';
import { APP_ICONS } from '@/lib/icons';

const STATUS_CHIPS: { key: 'all' | CertificateCardData['status']; label: string }[] = [
  { key: 'all',     label: 'Todos' },
  { key: 'valid',   label: 'Emitidos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'expired', label: 'Expirados' },
  { key: 'revoked', label: 'Revocados' },
];

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateCardData[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [statusChip,   setStatusChip]   = useState<'all' | CertificateCardData['status']>('all');
  const [search,       setSearch]       = useState('');

  useEffect(() => {
    let alive = true;
    api.certificates()
      .then((list) => {
        if (!alive) return;
        setCertificates(list.length > 0 ? list.map(toCardData) : DEMO_CERTIFICATES);
      })
      .catch(() => { if (alive) setCertificates(DEMO_CERTIFICATES); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const issued  = useMemo(() => certificates.filter((c) => c.status === 'valid').length,   [certificates]);
  const pending = useMemo(() => certificates.filter((c) => c.status === 'pending').length, [certificates]);
  const rate    = certificates.length > 0 ? Math.round((issued / certificates.length) * 100) : 0;

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

  if (loading) return <PageLoader label="Cargando certificaciones…" />;

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[clamp(28px,3vw,42px)] font-extrabold tracking-tight text-[var(--ink)]">
            Certificaciones
          </h1>
          <p className="mt-1 text-[15px] text-[var(--ink-muted)]">
            Emite y aprueba certificados de tus cursos
          </p>
        </div>

        <div className="relative w-full max-w-[340px]">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" strokeLinecap="round" /></svg>
          </span>
          <input
            type="search"
            placeholder="Buscar folio, curso o estudiante…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-2xl border border-[#E4EBDD] bg-white pl-10 pr-4 text-[13.5px] text-[var(--ink)] shadow-sm outline-none focus:border-[var(--green-400)]"
          />
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Emitidos"              value={issued}  deltaUp icon={<Icon icon={APP_ICONS.diplomaVerified} width={20} height={20} />} variant="green" />
        <StatCard label="Pendientes de aprobar" value={pending} icon={<Icon icon={APP_ICONS.clock} width={20} height={20} />} variant="yellow" />
        <StatCard label="Tasa de aprobación"    value={`${rate}%`} deltaUp icon={<Icon icon={APP_ICONS.chart} width={20} height={20} />} variant="blue" />
      </div>

      {/* ── Chips de estado ── */}
      <div className="flex flex-wrap gap-1.5">
        {STATUS_CHIPS.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => setStatusChip(chip.key)}
            className={
              statusChip === chip.key
                ? 'rounded-full border-[1.5px] border-[var(--green-500)] bg-[var(--green-50)] px-4 py-1.5 text-[13px] font-semibold text-[var(--green-700)] cursor-pointer'
                : 'rounded-full border-[1.5px] border-[#E4EBDD] bg-white px-4 py-1.5 text-[13px] text-[var(--ink-muted)] cursor-pointer hover:border-[var(--green-300)]'
            }
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* ── Grid de holo cards ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={APP_ICONS.diploma}
          title="Sin certificados"
          description={
            search || statusChip !== 'all'
              ? 'Ningún certificado coincide con tu búsqueda.'
              : 'Aún no se han emitido certificados en el sistema.'
          }
          action={
            (search || statusChip !== 'all')
              ? { label: 'Ver todos', onClick: () => { setSearch(''); setStatusChip('all'); } }
              : undefined
          }
        />
      ) : (
        <>
          <p className="text-[13px] text-[var(--ink-muted)]">
            Mostrando <strong className="text-[var(--ink)]">{filtered.length}</strong> de {certificates.length} —
            gira cada tarjeta para ver los datos y el QR de verificación.
          </p>
          <div className="grid gap-7 md:grid-cols-2 2xl:grid-cols-3">
            {filtered.map((cert) => (
              <CertificateHoloCard key={cert.folio} data={cert} showSparkles />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   Earnings Page — ganancias por curso
   Vista completa para profesores/admin, separada
   de "Mis cursos" para no saturar el catálogo.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import { api } from '@/lib/api';
import type { CourseEarnings } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { APP_ICONS } from '@/lib/icons';

function formatMoney(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('es', { style: 'currency', currency }).format(amount);
}

function StatCard({ label, value, helper, icon }: Readonly<{ label: string; value: string; helper: string; icon: string }>) {
  return (
    <Card padding="default" style={{ borderRadius: '1.375rem', background: 'rgba(255,255,255,0.86)' }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--green-700)]">{label}</p>
          <p className="mt-3 text-[clamp(26px,3vw,34px)] font-extrabold leading-none text-[var(--ink)]">{value}</p>
          <p className="mt-3 text-[0.7813rem] font-semibold text-[var(--ink-muted)]">{helper}</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--green-50)] text-[var(--green-700)]">
          <Icon icon={icon} width={21} height={21} />
        </span>
      </div>
    </Card>
  );
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<CourseEarnings[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    api.courseEarnings()
      .then((rows) => { if (alive) setEarnings(rows); })
      .catch(() => { if (alive) setFailed(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const summary = useMemo(() => {
    const totalRevenue = earnings.reduce((sum, item) => sum + item.grossRevenue, 0);
    const totalSales = earnings.reduce((sum, item) => sum + item.salesCount, 0);
    const currency = earnings[0]?.currency ?? 'USD';
    const maxRevenue = Math.max(...earnings.map((item) => item.grossRevenue), 1);
    return { totalRevenue, totalSales, currency, maxRevenue };
  }, [earnings]);

  if (loading) {
    return (
      <div className="flex min-h-[22.5rem] items-center justify-center">
        <WaveSpinner size="md" label="Calculando ganancias…" />
      </div>
    );
  }

  if (failed) {
    return (
      <EmptyState
        icon={APP_ICONS.warning}
        title="No pudimos cargar las ganancias"
        description="El servicio de pagos no respondió. Intenta de nuevo en unos momentos."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader
        title={<>Ganancias por curso</>}
        subtitle="Ventas confirmadas por Stripe y órdenes pagadas, separadas del catálogo para revisar con calma."
        action={<Chip
          label="Actualizado hoy"
          icon={<Icon icon={APP_ICONS.check} width={15} height={15} />}
          sx={{
            borderRadius: '999px',
            bgcolor: 'var(--green-50)',
            color: 'var(--green-700)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            px: 0.7,
          }}
        />}
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard label="Ingresos" value={formatMoney(summary.totalRevenue, summary.currency)} helper="+ ventas pagadas" icon={APP_ICONS.chart} />
        <StatCard label="Ventas" value={String(summary.totalSales)} helper="inscripciones compradas" icon={APP_ICONS.users} />
        <StatCard label="Cursos vendidos" value={String(earnings.length)} helper={earnings[0]?.courseTitle ?? 'Sin ventas aún'} icon={APP_ICONS.book} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
        <Card padding="default" style={{ borderRadius: '1.5rem', background: 'rgba(255,255,255,0.9)' }}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[1.125rem] font-extrabold text-[var(--ink)]">Ingresos por curso</h2>
              <p className="mt-1 text-[0.8125rem] text-[var(--ink-muted)]">Comparativo proporcional de ventas confirmadas.</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--blue-50)] text-[var(--blue-600)]">
              <Icon icon={APP_ICONS.chart} width={20} height={20} />
            </span>
          </div>

          {earnings.length === 0 ? (
            <EmptyState
              icon={APP_ICONS.empty}
              title="Aún no hay ventas"
              description="Cuando un alumno compre un curso, aparecerá aquí con sus ingresos."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {earnings.map((item) => (
                <div key={`${item.courseId}-${item.currency}`} className="rounded-2xl border border-[var(--neutral-100)] bg-[#F8FBF5] p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[0.875rem] font-bold text-[var(--ink)]">{item.courseTitle}</p>
                      <p className="mt-0.5 text-[0.75rem] text-[var(--ink-muted)]">{item.salesCount} venta{item.salesCount !== 1 ? 's' : ''}</p>
                    </div>
                    <strong className="text-[0.875rem] text-[var(--green-700)]">{formatMoney(item.grossRevenue, item.currency)}</strong>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={(item.grossRevenue / summary.maxRevenue) * 100}
                    sx={{
                      height: 9,
                      borderRadius: '999px',
                      bgcolor: 'var(--green-100)',
                      '& .MuiLinearProgress-bar': { borderRadius: '999px', bgcolor: 'var(--green-600)' },
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padding="default" style={{ borderRadius: '1.5rem', background: 'rgba(255,255,255,0.9)' }}>
          <h2 className="text-[1.125rem] font-extrabold text-[var(--ink)]">Detalle de ventas</h2>
          <p className="mt-1 text-[0.8125rem] text-[var(--ink-muted)]">Resumen compacto por curso.</p>
          <div className="mt-5 flex flex-col gap-3">
            {(earnings.length ? earnings : [{ courseId: 'empty', courseTitle: 'Sin ventas todavía', salesCount: 0, grossRevenue: 0, currency: summary.currency, instructorEmail: null }]).map((item) => (
              <div key={`${item.courseId}-${item.currency}`} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-[#F8FBF5] px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-[0.8125rem] font-bold text-[var(--ink)]">{item.courseTitle}</p>
                  <p className="mt-0.5 text-[0.75rem] text-[var(--ink-muted)]">{item.salesCount} venta{item.salesCount !== 1 ? 's' : ''}</p>
                </div>
                <strong className="text-[0.8125rem] text-[var(--ink)]">{formatMoney(item.grossRevenue, item.currency)}</strong>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

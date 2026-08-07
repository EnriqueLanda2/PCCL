/* ───────────────────────────────────────────
   Califications Page — Evaluaciones
   Tarjetas de quiz/tarea/examen con tipo,
   puntos, intentos. Permiso crear evaluación.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { Calification } from '@/lib/types';
import { Button } from '@/app/components/ui/Button';
import { AppButton, AppInput } from '@/app/components/ui/AppControls';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { CourseHoloCard, type CardCarouselItem } from '@/app/components/shared/CardCarousel';
import { calificationType, getIcon, getLabel } from '@/types/status';
import { APP_ICONS } from '@/lib/icons';

const COVER_CLASSES = ['cover-1', 'cover-2', 'cover-3', 'cover-4', 'cover-5', 'cover-6'];

function calificationIcon(iconName: string) {
  return <Icon icon={iconName} width={40} height={40} style={{ color: 'rgba(255,255,255,0.9)' }} />;
}

function toCarouselItem(cal: Calification, i: number): CardCarouselItem {
  const label = getLabel(calificationType, cal.type);
  const icon  = getIcon(calificationType, cal.type, APP_ICONS.file);
  return {
    id: cal.id,
    title: cal.title,
    description: cal.lesson?.title
      ? `${cal.totalPoints} puntos · ${cal.maxAttempts} intentos · Lección: ${cal.lesson.title}`
      : `${cal.totalPoints} puntos · ${cal.maxAttempts} intentos`,
    eyebrow: label,
    coverClass: COVER_CLASSES[i % COVER_CLASSES.length],
    icon: calificationIcon(icon),
  };
}

/* ── Skeleton card — mismo alto (420px) que CourseHoloCard, para que el grid no salte al cargar ── */
function SkeletonCalCard() {
  return (
    <div style={{ height: '26.25rem', borderRadius: '1.25rem', border: '1px solid #E4EBDD', overflow: 'hidden', background: 'var(--panel)', animation: 'pulse 1.4s ease-in-out infinite' }}>
      <div style={{ height: '9.375rem', background: 'var(--neutral-100)' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div style={{ height: '0.75rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: '35%' }} />
        <div style={{ height: '1.125rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: '80%' }} />
        <div style={{ height: '0.8125rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: '60%' }} />
      </div>
    </div>
  );
}

const TYPE_CHIPS = calificationType.chips;
const TYPE_MAP   = calificationType.chipKey;

export default function CalificationsPage() {
  const [califications, setCalifications] = useState<Calification[]>([]);
  const [permissions,   setPermissions]   = useState<string[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [typeChip,      setTypeChip]      = useState('Todos');
  const [search,        setSearch]        = useState('');

  useEffect(() => {
    let alive = true;
    Promise.all([api.califications(), api.access()])
      .then(([list, access]) => {
        if (!alive) return;
        setCalifications(list);
        setPermissions(access.permissions);
      })
      .catch(() => { if (alive) { setCalifications([]); setPermissions([]); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const canCreate = useMemo(() => permissions.includes('califications:create'), [permissions]);

  /* ── Stats ── */
  const total  = califications.length;
  const quizzes = califications.filter((c) => c.type === 'quiz').length;
  const tasks   = califications.filter((c) => c.type === 'task').length;
  const exams   = califications.filter((c) => c.type === 'exam').length;

  /* ── Filtered ── */
  const filtered = useMemo(() => {
    let list = [...califications];
    if (typeChip !== 'Todos') list = list.filter((c) => c.type === TYPE_MAP[typeChip]);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q));
    }
    return list;
  }, [califications, typeChip, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ── */}
      <PageHeader
        title={<>Evaluaciones y calificaciones</>}
        subtitle={loading ? 'Cargando…' : `${total} evaluaci${total !== 1 ? 'ones' : 'ón'} registradas`}
        action={canCreate ? <Button variant="primary" size="md">+ Nueva evaluación</Button> : undefined}
      />

      {/* ── Stat row ── */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '1rem' }}>
          <StatCard label="Total"    value={total}   icon={<Icon icon={APP_ICONS.chart} width={20} height={20} />} />
          <StatCard label="Quizzes"  value={quizzes} icon={<Icon icon={APP_ICONS.trophy} width={20} height={20} />} variant="blue" />
          <StatCard label="Tareas"   value={tasks}   icon={<Icon icon={APP_ICONS.folder} width={20} height={20} />} variant="yellow" />
          <StatCard label="Exámenes" value={exams}   icon={<Icon icon={APP_ICONS.diplomaVerified} width={20} height={20} />} variant="purple" />
        </div>
      )}

      {/* ── Search + chips ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 240px', minWidth: '15rem', maxWidth: '23.75rem' }}>
          <AppInput
            type="search"
            placeholder="Buscar evaluación…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            withSearchIcon
          />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {TYPE_CHIPS.map((chip) => (
            <AppButton
              key={chip}
              type="button"
              onClick={() => setTypeChip(chip)}
              variant={typeChip === chip ? 'contained' : 'outlined'}
              sx={{
                borderColor: typeChip === chip ? 'var(--blue-500)' : 'var(--neutral-200)',
                bgcolor: typeChip === chip ? 'var(--blue-50)' : 'var(--panel)',
                color: typeChip === chip ? 'var(--blue-700)' : 'var(--ink-muted)',
                px: 2,
              }}
            >
              {chip}
            </AppButton>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCalCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={APP_ICONS.quiz}
          title="Sin evaluaciones"
          description={
            search || typeChip !== 'Todos'
              ? 'Ninguna evaluación coincide con tu búsqueda.'
              : canCreate
              ? 'Aún no hay evaluaciones. ¡Crea la primera!'
              : 'No hay evaluaciones registradas en el sistema.'
          }
          action={
            (search || typeChip !== 'Todos')
              ? { label: 'Ver todas', onClick: () => { setSearch(''); setTypeChip('Todos'); } }
              : undefined
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((cal, i) => (
            <div key={cal.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <CourseHoloCard item={toCarouselItem(cal, i)} fluid />
              {canCreate && (
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <Button variant="ghost" size="sm" style={{ flex: 1 }} leftIcon={<Icon icon={APP_ICONS.edit} width={14} height={14} />}>Editar</Button>
                  <Button variant="danger" size="sm" style={{ flex: 1 }} leftIcon={<Icon icon={APP_ICONS.trash} width={14} height={14} />}>Eliminar</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

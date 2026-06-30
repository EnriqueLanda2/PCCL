/* ───────────────────────────────────────────
   Califications Page — Evaluaciones
   Tarjetas de quiz/tarea/examen con tipo,
   puntos, intentos. Permiso crear evaluación.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Calification } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { calificationType, getIcon, getLabel, getVariant } from '@/types/status';

function CalificationCard({ cal, canCreate }: { cal: Calification; canCreate: boolean }) {
  const icon    = getIcon(calificationType,    cal.type, '📄');
  const label   = getLabel(calificationType,   cal.type);
  const variant = getVariant(calificationType, cal.type);

  return (
    <Card padding="default" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0,
          background: 'var(--blue-50)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '22px',
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--ink)', lineHeight: 1.3, marginBottom: '4px' }}>
            {cal.title}
          </div>
          {cal.lesson?.title && (
            <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Lección: {cal.lesson.title}
            </div>
          )}
        </div>
        <Badge variant={variant}>{label}</Badge>
      </div>

      {/* Meta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{ background: 'var(--blue-50)', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--blue-700)' }}>{cal.totalPoints}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Puntos</div>
        </div>
        <div style={{ background: 'var(--green-50)', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--green-700)' }}>{cal.maxAttempts}</div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Intentos</div>
        </div>
      </div>

      {/* Action */}
      {canCreate && (
        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--neutral-100)', paddingTop: '12px' }}>
          <Button variant="ghost" size="sm" style={{ flex: 1 }}>Editar</Button>
          <Button variant="danger" size="sm" style={{ flex: 1 }}>Eliminar</Button>
        </div>
      )}
    </Card>
  );
}

/* ── Skeleton card ── */
function SkeletonCalCard() {
  return (
    <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--neutral-100)', padding: '20px', background: 'var(--panel)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'var(--neutral-100)', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '16px', borderRadius: '6px', background: 'var(--neutral-100)', width: '70%' }} />
          <div style={{ height: '12px', borderRadius: '6px', background: 'var(--neutral-100)', width: '45%' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div style={{ height: '60px', borderRadius: '10px', background: 'var(--neutral-100)' }} />
        <div style={{ height: '60px', borderRadius: '10px', background: 'var(--neutral-100)' }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
            Evaluaciones <em style={{ color: 'var(--blue-600)', fontStyle: 'italic' }}>y calificaciones</em>
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
            {loading ? 'Cargando…' : `${total} evaluaci${total !== 1 ? 'ones' : 'ón'} registradas`}
          </p>
        </div>
        {canCreate && (
          <Button variant="primary" size="md">+ Nueva evaluación</Button>
        )}
      </div>

      {/* ── Stat row ── */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <StatCard label="Total"    value={total}   />
          <StatCard label="Quizzes"  value={quizzes} />
          <StatCard label="Tareas"   value={tasks}   />
          <StatCard label="Exámenes" value={exams}   />
        </div>
      )}

      {/* ── Search + chips ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '320px' }}>
          <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: 'var(--ink-muted)', pointerEvents: 'none' }}>🔍</span>
          <input
            type="search"
            placeholder="Buscar evaluación…"
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
          {TYPE_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setTypeChip(chip)}
              style={{
                border: typeChip === chip ? '1.5px solid var(--blue-600)' : '1.5px solid var(--neutral-200)',
                background: typeChip === chip ? 'var(--blue-50)' : 'var(--panel)',
                color: typeChip === chip ? 'var(--blue-700)' : 'var(--ink-muted)',
                borderRadius: 'var(--radius-full)', padding: '6px 16px',
                fontSize: '13px', fontWeight: typeChip === chip ? 600 : 400,
                cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCalCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📝"
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filtered.map((cal) => (
            <CalificationCard key={cal.id} cal={cal} canCreate={canCreate} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   GamificationPanel — nivel, puntos, racha e
   insignias del alumno.

   Todo viene calculado de GET /gamification/me: no
   hay tablas de puntos, se deriva de la actividad
   ya registrada. Por eso el panel no escribe nada
   ni necesita refrescarse tras una acción — basta
   con volver a pedirlo.

   Solo tiene sentido para alumnos. Un instructor no
   completa lecciones, así que su resumen saldría en
   cero: quien lo monta decide si mostrarlo.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { Badge as BadgeType, GamificationSummary } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { ProgressBar } from '@/app/components/ui/ProgressBar';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

/** Icono por insignia. Las no conseguidas se pintan apagadas, no se ocultan:
    ver lo que falta es justamente lo que empuja a conseguirlo. */
const BADGE_ICONS: Record<string, string> = {
  'first-lesson':     'solar:flag-2-bold-duotone',
  'ten-lessons':      'solar:book-bookmark-bold-duotone',
  'fifty-lessons':    'solar:medal-ribbons-star-bold-duotone',
  'first-evaluation': 'solar:check-circle-bold-duotone',
  'five-evaluations': 'solar:diploma-verified-bold-duotone',
  'first-course':     'solar:cup-star-bold-duotone',
  'three-courses':    'solar:crown-bold-duotone',
  'streak-3':         'solar:fire-bold-duotone',
  'streak-7':         'solar:fire-square-bold-duotone',
};

function badgeIcon(id: string) {
  return BADGE_ICONS[id] ?? 'solar:star-bold-duotone';
}

function StreakFlame({ days }: Readonly<{ days: number }>) {
  const alive = days > 0;
  return (
    <div className="flex items-center gap-2.5">
      <Icon
        icon="solar:fire-bold-duotone"
        width={30}
        height={30}
        className={alive ? 'text-[#E8763A]' : 'text-[var(--neutral-300)]'}
      />
      <div>
        <p className="text-[1.375rem] font-extrabold leading-none text-[var(--ink)]">
          {days}
        </p>
        <p className="mt-0.5 text-[0.75rem] font-semibold text-[var(--ink-muted)]">
          {days === 1 ? 'día seguido' : 'días seguidos'}
        </p>
      </div>
    </div>
  );
}

function BadgeTile({ badge }: Readonly<{ badge: BadgeType }>) {
  return (
    <div
      className={[
        'flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors',
        badge.earned
          ? 'border-[var(--green-400,#7ACB9B)] bg-[var(--green-50,#E6F8EA)]'
          : 'border-[var(--neutral-100)] bg-[var(--neutral-50,#F7F9F6)]',
      ].join(' ')}
      title={badge.description}
    >
      <Icon
        icon={badgeIcon(badge.id)}
        width={26}
        height={26}
        className={badge.earned ? 'text-[var(--green-600)]' : 'text-[var(--neutral-300)]'}
      />
      <span
        className={[
          'text-[0.6875rem] font-bold leading-tight',
          badge.earned ? 'text-[var(--green-700)]' : 'text-[var(--ink-muted)]',
        ].join(' ')}
      >
        {badge.label}
      </span>
      {!badge.earned && (
        <span className="text-[0.625rem] font-semibold tabular-nums text-[var(--neutral-300)]">
          {badge.progress}/{badge.target}
        </span>
      )}
    </div>
  );
}

export function GamificationPanel() {
  const [data, setData] = useState<GamificationSummary | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => {
      api.gamification()
        .then((summary) => { if (alive) setData(summary); })
        .catch(() => { if (alive) setFailed(true); });
    }, 0);
    return () => { alive = false; window.clearTimeout(timer); };
  }, []);

  /* El panel es accesorio: si falla, desaparece en vez de romper el tablero. */
  if (failed) return null;

  if (!data) {
    return (
      <Card className="flex min-h-[11rem] items-center justify-center p-4">
        <WaveSpinner size="sm" />
      </Card>
    );
  }

  const levelPct = data.pointsForNextLevel > 0
    ? Math.round((data.pointsIntoLevel / data.pointsForNextLevel) * 100)
    : 0;

  return (
    <Card className="dashboard-card-in flex flex-col gap-4 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.8125rem] font-bold text-[var(--ink)]">Tu progreso</p>
          <p className="mt-0.5 text-[0.75rem] text-[var(--ink-muted)]">
            Nivel {data.level} · {data.points.toLocaleString('es-MX')} puntos
          </p>
        </div>
        <StreakFlame days={data.currentStreak} />
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between text-[0.75rem]">
          <span className="font-semibold text-[var(--blue-600)]">
            Nivel {data.level}
          </span>
          <span className="font-semibold tabular-nums text-[var(--ink-muted)]">
            {data.pointsIntoLevel}/{data.pointsForNextLevel} para el nivel {data.level + 1}
          </span>
        </div>
        <ProgressBar value={levelPct} color="green" />
      </div>

      <div className="grid grid-cols-3 gap-2 border-y border-[var(--neutral-100)] py-3 text-center">
        <div>
          <p className="text-[1.125rem] font-extrabold tabular-nums text-[var(--ink)]">
            {data.totals.lessonsCompleted}
          </p>
          <p className="text-[0.6875rem] font-semibold text-[var(--ink-muted)]">Lecciones</p>
        </div>
        <div>
          <p className="text-[1.125rem] font-extrabold tabular-nums text-[var(--ink)]">
            {data.totals.evaluationsPassed}
          </p>
          <p className="text-[0.6875rem] font-semibold text-[var(--ink-muted)]">Exámenes</p>
        </div>
        <div>
          <p className="text-[1.125rem] font-extrabold tabular-nums text-[var(--ink)]">
            {data.totals.coursesCompleted}
          </p>
          <p className="text-[0.6875rem] font-semibold text-[var(--ink-muted)]">Cursos</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <p className="text-[0.8125rem] font-bold text-[var(--ink)]">Insignias</p>
          <span className="text-[0.75rem] font-semibold tabular-nums text-[var(--ink-muted)]">
            {data.badgesEarned} de {data.badges.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-5">
          {data.badges.map((badge) => (
            <BadgeTile key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      {data.longestStreak > data.currentStreak && (
        <p className="text-[0.6875rem] text-[var(--ink-muted)]">
          Tu mejor racha fue de {data.longestStreak}{' '}
          {data.longestStreak === 1 ? 'día' : 'días'}.
        </p>
      )}
    </Card>
  );
}

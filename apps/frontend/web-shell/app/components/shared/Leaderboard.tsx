/* ───────────────────────────────────────────
   Leaderboard — tabla de posiciones por puntos.

   El backend ya resuelve el nombre y marca cuál
   fila es la del usuario (`isMe`), así que este
   componente no necesita conocer el id de la sesión
   para resaltarse a sí mismo.

   Nunca llega el correo de nadie: la tabla la ve
   toda la clase y un nombre basta para reconocer a
   un compañero.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { LeaderboardEntry } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

/** Color del podio. Del cuarto en adelante, el número va en gris. */
const PODIUM: Record<number, string> = {
  1: 'text-[#C9971B]',
  2: 'text-[#8C9BA8]',
  3: 'text-[#B07440]',
};

interface LeaderboardProps {
  /** Acota la tabla a los inscritos en un curso. Sin él, es global. */
  courseId?: string;
  title?: string;
  description?: string;
}

export function Leaderboard({
  courseId,
  title = 'Tabla de posiciones',
  description = 'Por puntos acumulados',
}: Readonly<LeaderboardProps>) {
  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => {
      api.leaderboard(courseId)
        .then((data) => { if (alive) setRows(data); })
        .catch(() => { if (alive) setFailed(true); });
    }, 0);
    return () => { alive = false; window.clearTimeout(timer); };
  }, [courseId]);

  if (failed) return null;

  if (!rows) {
    return (
      <Card className="flex min-h-[11rem] items-center justify-center p-4">
        <WaveSpinner size="sm" />
      </Card>
    );
  }

  return (
    <Card className="dashboard-card-in flex flex-col gap-3 p-4">
      <div>
        <p className="text-[0.8125rem] font-bold text-[var(--ink)]">{title}</p>
        <p className="mt-0.5 text-[0.75rem] text-[var(--ink-muted)]">{description}</p>
      </div>

      {rows.length === 0 ? (
        <p className="py-6 text-center text-[0.8125rem] text-[var(--ink-muted)]">
          Todavía no hay actividad suficiente para armar la tabla.
        </p>
      ) : (
        <ol className="flex flex-col gap-1">
          {rows.map((row) => (
            <li
              key={row.userId}
              className={[
                'flex items-center gap-3 rounded-xl px-2.5 py-2',
                row.isMe
                  ? 'bg-[var(--green-50,#E6F8EA)] ring-1 ring-[var(--green-400,#7ACB9B)]'
                  : 'hover:bg-[var(--neutral-50,#F7F9F6)]',
              ].join(' ')}
            >
              <span
                className={[
                  'w-5 flex-shrink-0 text-right text-[0.875rem] font-extrabold tabular-nums',
                  PODIUM[row.position] ?? 'text-[var(--neutral-300)]',
                ].join(' ')}
              >
                {row.position}
              </span>

              {row.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row.avatarUrl}
                  alt=""
                  className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--neutral-100)] text-[0.6875rem] font-extrabold text-[var(--ink-muted)]">
                  {row.fullName.charAt(0).toUpperCase()}
                </span>
              )}

              <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-semibold text-[var(--ink)]">
                {row.fullName}
                {row.isMe && (
                  <span className="ml-1.5 text-[0.6875rem] font-bold text-[var(--green-700)]">
                    tú
                  </span>
                )}
              </span>

              {row.currentStreak > 0 && (
                <span className="flex flex-shrink-0 items-center gap-0.5 text-[0.6875rem] font-bold text-[#E8763A]">
                  <Icon icon="solar:fire-bold-duotone" width={14} height={14} />
                  {row.currentStreak}
                </span>
              )}

              <span className="flex-shrink-0 text-[0.8125rem] font-extrabold tabular-nums text-[var(--ink)]">
                {row.points.toLocaleString('es-MX')}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

/* ───────────────────────────────────────────
   HeroInteractive — carrusel 3D + tarjetas de
   curso sincronizadas. Al girar el anillo, la
   tarjeta lateral cambia de curso y el fondo
   ambiental se tiñe con la paleta de la portada.
   ─────────────────────────────────────────── */

'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Carousel3DRing, type Carousel3DItem } from '@/app/components/shared/Carousel3DRing';
import { appRoutes } from '@/lib/routes';
import { APP_ICONS } from '@/lib/icons';
import type { LiveSession } from '@/lib/types';

/** Mismos tonos que .cover-N en globals.css, en rgb para poder mezclarlos con alpha */
const COVER_GLOW: Record<string, [string, string]> = {
  'cover-1': ['23,50,77', '30,79,162'],
  'cover-2': ['23,108,56', '51,199,199'],
  'cover-3': ['179,77,36', '255,139,0'],
  'cover-4': ['255,139,0', '23,108,56'],
  'cover-5': ['23,50,77', '255,139,0'],
  'cover-6': ['90,74,178', '51,199,199'],
};
const DEFAULT_GLOW: [string, string] = COVER_GLOW['cover-1'];

interface HeroInteractiveProps {
  courses: Carousel3DItem[];
  nextLiveSession: LiveSession | null;
}

function liveSessionStatusLabel(session: LiveSession): string {
  const scheduledAt = new Date(session.scheduledAt).getTime();
  const now = Date.now();
  const endsAt = scheduledAt + session.durationMinutes * 60_000;

  if (session.status === 'live' || (now >= scheduledAt && now < endsAt)) {
    return 'en vivo ahora';
  }

  const diffMs = scheduledAt - now;
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin < 60) return `en ${Math.max(diffMin, 1)} min`;
  const diffH = Math.round(diffMin / 60);
  return `en ${diffH} h`;
}

export function HeroInteractive({ courses, nextLiveSession }: Readonly<HeroInteractiveProps>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCourse = courses[activeIndex] ?? courses[0] ?? null;

  const [glowA, glowB] = useMemo(
    () => (activeCourse ? COVER_GLOW[activeCourse.coverClass] ?? DEFAULT_GLOW : DEFAULT_GLOW),
    [activeCourse],
  );

  return (
    <div
      className="hero-interactive"
      style={{
        '--glow-a': glowA,
        '--glow-b': glowB,
      } as CSSProperties}
    >
      {/* Fondo ambiental — se tiñe con la paleta del curso activo */}
      <div className="hero-ambient-glow" aria-hidden="true" />

      {/* Carrusel a pantalla completa, difuminado — es el fondo, no compite con el contenido */}
      <Carousel3DRing items={courses} activeIndex={activeIndex} onSelect={setActiveIndex} />

      <div className="hero-float-scene" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {/* Card curso — sincronizada con el carrusel, degradado menta + patrón geométrico */}
        <div
          key={activeCourse?.id ?? 'empty'}
          className="hero-float-card hero-course-card cover-pattern-tint"
          style={{
            boxShadow: '0 20px 44px rgba(23,50,77,0.12)', borderRadius: '1.25rem', overflow: 'hidden',
            background: 'linear-gradient(160deg, #DFF6E6 0%, #EEFAF1 55%, #F8FDF6 100%)',
            border: '1px solid #CDEFD9',
          } as CSSProperties}
        >
          <div
            className={activeCourse?.coverImageUrl ? undefined : activeCourse?.coverClass}
            style={{
              height: '8.75rem',
              background: activeCourse?.coverImageUrl
                ? `url(${activeCourse.coverImageUrl}) center/cover`
                : undefined,
              color: 'var(--panel)', padding: '0.875rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.625rem', background: 'rgba(255,255,255,0.15)', padding: '3px 9px', borderRadius: '999px', alignSelf: 'flex-start', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              {activeCourse?.category ?? 'CURSO'}
            </span>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.0625rem', lineHeight: 1.15, fontWeight: 700, textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>
              {activeCourse?.title ?? 'Explora nuestro catálogo'}
            </div>
          </div>
          <Link
            href={activeCourse?.href ?? appRoutes.courses}
            className="relative z-[1]"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', textDecoration: 'none' }}
          >
            <span style={{ fontSize: '0.7813rem', color: 'var(--ink-soft)', fontWeight: 500 }}>Ver temario del curso</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--green-700)', fontWeight: 700 }}>→</span>
          </Link>

          {/* Puntos de paginación — junto a la tarjeta, visibles (no al fondo de toda la sección) */}
          {courses.length > 1 && (
            <div className="relative z-[1]" style={{ display: 'flex', gap: '0.375rem', padding: '0 16px 14px' }}>
              {courses.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`Ir a ${c.title}`}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    height: '0.375rem', borderRadius: '999px', border: 'none', padding: 0, cursor: 'pointer',
                    width: i === activeIndex ? '1.375rem' : '0.375rem',
                    background: i === activeIndex ? 'var(--green-600)' : 'var(--green-100)',
                    transition: 'all 200ms ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Panel de acciones rápidas — definido y adyacente, ya no flotando */}
        <div
          className="hero-float-card"
          style={{
            borderRadius: '1.25rem', background: 'var(--panel)', border: '1px solid #E4EBDD',
            boxShadow: '0 14px 32px rgba(23,50,77,0.07)', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
          }}
        >
          <span style={{ fontSize: '0.6563rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--green-600)', padding: '0 4px 6px' }}>
            Acciones rápidas
          </span>

          {/* Certificado — sin datos personales: solo invita a validar */}
          <Link
            href={appRoutes.scan}
            style={{
              display: 'flex', gap: '0.6875rem', alignItems: 'center', padding: '8px 4px', borderRadius: '0.875rem',
              textDecoration: 'none', transition: 'background 160ms',
            }}
          >
            <div style={{ width: '2.375rem', height: '2.375rem', borderRadius: '0.6875rem', background: 'linear-gradient(135deg, var(--green-700), var(--green-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--panel)', flexShrink: 0 }}>
              <Icon icon={APP_ICONS.diploma} width={18} height={18} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8438rem', lineHeight: 1.2, fontWeight: 700, color: 'var(--ink)' }}>Certificados verificables</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--blue-600)', marginTop: '2px', fontWeight: 600 }}>Abrir escáner →</div>
            </div>
          </Link>

          {/* Live — datos reales de learning-service */}
          <div style={{ display: 'flex', gap: '0.6875rem', alignItems: 'center', padding: '8px 4px' }}>
            {nextLiveSession ? (
              <>
                <div style={{ width: '2.375rem', height: '2.375rem', borderRadius: '0.6875rem', background: 'var(--bg-dark)', color: 'var(--green-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.75rem', flexShrink: 0 }}>
                  {nextLiveSession.hostName.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.7813rem', fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nextLiveSession.title}</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: '0.3125rem' }}>
                    <span className="live-dot" style={{ width: '0.375rem', height: '0.375rem', background: 'var(--red-500)', borderRadius: '50%' }} />
                    {nextLiveSession.hostName} · {liveSessionStatusLabel(nextLiveSession)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: '2.375rem', height: '2.375rem', borderRadius: '0.6875rem', background: '#F1F6EB', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon icon={APP_ICONS.clock} width={17} height={17} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7813rem', fontWeight: 700, color: 'var(--ink)' }}>Sin clases en vivo</div>
                  <Link href={appRoutes.liveClasses} style={{ fontSize: '0.6875rem', color: 'var(--blue-600)', textDecoration: 'none', fontWeight: 600 }}>
                    Consulta el calendario →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

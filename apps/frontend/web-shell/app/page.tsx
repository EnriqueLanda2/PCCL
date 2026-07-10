/* ───────────────────────────────────────────
  Landing Page — Rumbo Profesores
   Hero · Cursos disponibles (anillo 3D) · CTA
   ─────────────────────────────────────────── */

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Topbar } from '@/app/components/layout/Topbar';
import { Footer } from '@/app/components/layout/Footer';
import { BookIntro } from '@/app/components/shared/BookIntro';
import { Reveal } from '@/app/components/shared/Reveal';
import { Carousel3DRing, type Carousel3DItem } from '@/app/components/shared/Carousel3DRing';
import { appRoutes } from '@/lib/routes';
import { APP_ICONS } from '@/lib/icons';
import type { LiveSession } from '@/lib/types';

const STATS = [
  { value: '12.4k', label: 'Estudiantes activos' },
  { value: '218',   label: 'Cursos publicados'   },
  { value: '94%',   label: 'Tasa de finalización' },
];

/* Fallback si el backend no responde — mismos cursos sembrados en learning-service (ver apps/backend/apps/learning-service/prisma/seed.js) */
const FALLBACK_COURSES: Carousel3DItem[] = [
  { id: 'apis-rest',        title: 'APIs REST con Node.js y Express',        category: 'Backend',     coverClass: 'cover-1', href: appRoutes.courses },
  { id: 'postgres',         title: 'Bases de datos con PostgreSQL',          category: 'Backend',     coverClass: 'cover-6', href: appRoutes.courses },
  { id: 'data-viz',         title: 'Fundamentos de visualización de datos',  category: 'Datos',       coverClass: 'cover-2', href: appRoutes.courses },
  { id: 'accessible-ui',    title: 'Interfaces accesibles para todos',       category: 'Diseño',      coverClass: 'cover-3', href: appRoutes.courses },
  { id: 'critical-thinking', title: 'Pensamiento crítico para investigación', category: 'Pensamiento', coverClass: 'cover-4', href: appRoutes.courses },
];

const COVER_CLASSES = ['cover-1', 'cover-2', 'cover-3', 'cover-4', 'cover-6', 'cover-5'];
const LEVEL_LABELS: Record<string, string> = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

interface PublishedCourse {
  id: string;
  title: string;
  level: string;
  coverImageUrl?: string | null;
}

/** Cursos publicados en vivo desde learning-service, vía la ruta pública del gateway. */
async function fetchAvailableCourses(): Promise<Carousel3DItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3010';
    const res = await fetch(`${baseUrl}/courses/public`, { next: { revalidate: 60 } });
    if (!res.ok) return FALLBACK_COURSES;

    const courses: PublishedCourse[] = await res.json();
    if (courses.length === 0) return FALLBACK_COURSES;

    return courses.map((course, i) => ({
      id: course.id,
      title: course.title,
      category: LEVEL_LABELS[course.level] ?? course.level,
      coverClass: COVER_CLASSES[i % COVER_CLASSES.length],
      coverImageUrl: course.coverImageUrl ?? undefined,
      href: appRoutes.courses,
    }));
  } catch {
    return FALLBACK_COURSES;
  }
}

/** Próxima clase en vivo (o en curso) desde learning-service, vía la ruta pública del gateway. */
async function fetchNextLiveSession(): Promise<LiveSession | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3010';
    const res = await fetch(`${baseUrl}/live-sessions/public`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Etiqueta relativa calculada en el servidor a partir de scheduledAt/status — sin timer en cliente. */
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

export default async function HomePage() {
  const [availableCourses, nextLiveSession] = await Promise.all([
    fetchAvailableCourses(),
    fetchNextLiveSession(),
  ]);

  return (
    <>
      {/* Intro: libro abriéndose que se va al fondo */}
      <BookIntro />

      <Topbar />

      {/* ── Hero + carrusel: una sola sección continua ── */}
      <section style={{ padding: 'clamp(32px, 5vw, 80px) clamp(20px, 4vw, 48px) clamp(40px, 5vw, 64px)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr 1.05fr',
          gap: 'clamp(20px, 3vw, 40px)',
          alignItems: 'center',
        }}>
        <div>
          <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, color: 'var(--green-700)', display: 'inline-flex', alignItems: 'center', gap: '7px', marginBottom: '18px', padding: '6px 12px 6px 9px', borderRadius: '999px', background: 'rgba(255,255,255,0.82)', border: '1px solid rgba(31,154,75,0.12)', boxShadow: '0 8px 16px rgba(23,50,77,0.04)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green-500)', display: 'inline-block', boxShadow: '0 0 0 3px rgba(37,166,86,0.16)' }} />
            Nueva cohorte · junio 2026
          </span>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(32px, 4.2vw, 56px)', lineHeight: 1.06, letterSpacing: '-0.04em', marginBottom: '18px', maxWidth: '13ch', fontWeight: 800 }}>
            Aprende algo<br />que <span style={{ color: 'var(--green-600)' }}>importe.</span>
          </h1>
          <p style={{ fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '44ch', marginBottom: '26px' }}>
            Una plataforma serena para impartir, cursar y certificar conocimiento. Clases, evaluaciones y constancias verificables, todo en un solo lugar.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '38px', flexWrap: 'wrap' }}>
            <Link href={appRoutes.courses} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', height: '44px', padding: '0 24px', borderRadius: '999px', background: 'linear-gradient(120deg, var(--green-700), var(--green-500))', color: 'var(--panel)', fontSize: '14px', fontWeight: 700, boxShadow: '0 10px 20px -8px rgba(31,154,75,0.45)', transition: 'box-shadow 160ms' }}>
              Explorar catálogo <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
            </Link>
            <Link href={appRoutes.login} style={{ display: 'inline-flex', alignItems: 'center', height: '44px', padding: '0 22px', borderRadius: '999px', background: 'rgba(255,255,255,0.86)', border: '1px solid rgba(23,50,77,0.08)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
              Soy instructor
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '27px', color: 'var(--ink)', lineHeight: 1, fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginTop: '5px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel 3D — centrado entre el texto y las tarjetas flotantes */}
        <Reveal index={0}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Carousel3DRing items={availableCourses} />
          </div>
        </Reveal>

        {/* Visual card collage — tarjetas flotando en 3D, sin blob de fondo */}
        <div className="hero-float-scene" style={{ position: 'relative', height: '400px' }}>
          {/* Card curso */}
          <div
            className="hero-float-card"
            style={{
              position: 'absolute', top: 0, right: 0, width: '236px',
              boxShadow: '0 18px 36px rgba(23,50,77,0.10)', borderRadius: '18px', overflow: 'hidden',
              background: 'var(--panel)', border: '1px solid rgba(23,50,77,0.06)',
              '--float-rot': '2.5deg', '--float-lift': '-26px', '--float-drift': '9px', '--float-duration': '4.6s', '--float-delay': '0s',
            } as React.CSSProperties}
          >
            <div style={{ height: '126px', background: 'linear-gradient(135deg, var(--green-700), var(--green-500))', color: 'var(--panel)', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.15)', padding: '3px 9px', borderRadius: '999px', alignSelf: 'flex-start', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>CURSO</span>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', lineHeight: 1.15, fontWeight: 700 }}>Fundamentos de visualización de datos</div>
            </div>
            <div style={{ padding: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '7px' }}>
                <span>Lección 5 de 18</span><span style={{ color: 'var(--blue-700)', fontWeight: 600 }}>64%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--neutral-100)', borderRadius: '999px', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: '64%', background: 'var(--blue-600)', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
          {/* Card certificado — sin datos personales: solo invita a validar */}
          <Link
            href={appRoutes.scan}
            className="hero-float-card"
            style={{
              position: 'absolute', bottom: 0, right: 0, width: '218px',
              boxShadow: '0 18px 36px rgba(23,50,77,0.10)', borderRadius: '18px', background: 'var(--panel)',
              padding: '14px', border: '1px solid rgba(23,50,77,0.06)', display: 'flex', gap: '11px', alignItems: 'center',
              textDecoration: 'none', cursor: 'pointer',
              '--float-rot': '-3deg', '--float-lift': '-30px', '--float-drift': '-11px', '--float-duration': '5.4s', '--float-delay': '1.1s',
            } as React.CSSProperties}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'linear-gradient(135deg, var(--green-700), var(--green-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--panel)', flexShrink: 0 }}>
              <Icon icon={APP_ICONS.diploma} width={20} height={20} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '3px' }}>Certificados verificables</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', lineHeight: 1.2, fontWeight: 700, color: 'var(--ink)' }}>Escanea para validar uno</div>
              <div style={{ fontSize: '11px', color: 'var(--blue-600)', marginTop: '3px', fontWeight: 600 }}>Abrir escáner →</div>
            </div>
          </Link>
          {/* Card live — datos reales de learning-service, sin ticking timer (server component) */}
          <div
            className="hero-float-card"
            style={{
              position: 'absolute', top: '216px', left: '40%', width: '204px',
              boxShadow: '0 18px 36px rgba(23,50,77,0.12)', borderRadius: '18px', background: 'var(--bg-dark)',
              padding: '14px 17px', display: 'flex', gap: '10px', alignItems: 'center',
              '--float-rot': '-1.5deg', '--float-lift': '-22px', '--float-drift': '7px', '--float-duration': '4.0s', '--float-delay': '2.3s',
            } as React.CSSProperties}
          >
            {nextLiveSession ? (
              <>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--green-300)', color: 'var(--green-900)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '11px', flexShrink: 0 }}>
                  {nextLiveSession.hostName.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--panel)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nextLiveSession.title}</div>
                  <div style={{ fontSize: '10px', color: 'var(--blue-400)' }}>{nextLiveSession.hostName} · {liveSessionStatusLabel(nextLiveSession)}</div>
                </div>
                <span className="live-dot" style={{ width: '7px', height: '7px', background: 'var(--red-500)', borderRadius: '50%' }} />
              </>
            ) : (
              <>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--neutral-200)', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon icon={APP_ICONS.clock} width={16} height={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--panel)' }}>Sin clases en vivo</div>
                  <Link href={appRoutes.liveClasses} style={{ fontSize: '10px', color: 'var(--blue-400)', textDecoration: 'none' }}>
                    Consulta el calendario →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <Reveal index={0}>
      <section style={{
        margin: '52px clamp(20px, 4vw, 48px)',
        padding: 'clamp(32px, 4.5vw, 68px)',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, var(--green-700), var(--blue-900))',
        color: 'var(--panel)',
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '36px',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-100px', top: '-100px', width: '360px', height: '360px', background: 'radial-gradient(circle, rgba(255,255,255,0.16), transparent 60%)' }} />
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 600, color: 'var(--blue-300)' }}>Comienza hoy</span>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(22px,2.6vw,34px)', color: 'var(--panel)', margin: '10px 0 13px', fontWeight: 800 }}>
            Tu próxima cohorte te <span style={{ color: 'var(--green-300)' }}>está esperando.</span>
          </h2>
          <p style={{ opacity: 0.7, marginBottom: '22px', fontSize: '14.5px' }}>Crea tu cuenta gratis. Sin tarjeta. Sin pelusa.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href={appRoutes.login} style={{ display: 'inline-flex', alignItems: 'center', height: '44px', padding: '0 24px', borderRadius: '999px', background: 'var(--green-300)', color: 'var(--green-900)', fontSize: '14px', fontWeight: 500 }}>
              Crear cuenta
            </Link>
            <Link href={appRoutes.courses} style={{ display: 'inline-flex', alignItems: 'center', height: '44px', padding: '0 24px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--panel)', fontSize: '14px' }}>
              Ver catálogo
            </Link>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel)', borderRadius: '14px', padding: '19px', transform: 'rotate(-2deg)', boxShadow: 'var(--sh-3)', width: '236px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '13px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 600, color: 'var(--blue-600)' }}>Hoy</span>
              <span style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>10:42</span>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', lineHeight: 1.3, marginBottom: '13px', color: 'var(--ink)' }}>
              &ldquo;Camila terminó su quiz con 95 puntos.&rdquo;
            </div>
            <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
              <div style={{ width: '27px', height: '27px', borderRadius: '50%', background: 'var(--green-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10.5px', fontWeight: 600, color: 'var(--green-900)' }}>CR</div>
              <div style={{ fontSize: '11.5px', color: 'var(--ink-muted)' }}>Camila Ríos · Visualización de datos</div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Footer />
    </>
  );
}

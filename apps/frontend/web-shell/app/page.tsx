/* ───────────────────────────────────────────
  Landing / Dashboard — Rumbo Profesores
   Sección "2a" del handoff de diseño (ver
   RumboHero2a.tsx) · CTA final · Footer
   ─────────────────────────────────────────── */

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Footer } from '@/app/components/layout/Footer';
import { BookIntro } from '@/app/components/shared/BookIntro';
import { Reveal } from '@/app/components/shared/Reveal';
import { RumboHero2a, type FeaturedSlideItem } from '@/app/components/shared/RumboHero2a';
import { type CardCarouselItem } from '@/app/components/shared/CardCarousel';
import { appRoutes } from '@/lib/routes';
import { COURSE_COVER_ICONS } from '@/lib/icons';

/** Fallback si el backend no responde */
const FALLBACK_STATS = { activeStudents: 0, publishedCourses: 0, completionRate: 0 };

interface PublicStats {
  activeStudents: number;
  publishedCourses: number;
  completionRate: number;
}

interface PublicCourse {
  id: string;
  title: string;
  category: string;
  coverImageUrl?: string;
  href: string;
}

const PASTELS = ['#dcefe3', '#e7f0dc', '#dceaef', '#efe9dc', '#e3dcef'];
const COVER_CLASSES = ['cover-1', 'cover-2', 'cover-3', 'cover-4', 'cover-6', 'cover-5'];

/* Fallback si el backend no responde — mismos cursos sembrados en learning-service (ver apps/backend/apps/learning-service/prisma/seed.js) */
const FALLBACK_COURSES: PublicCourse[] = [
  { id: 'apis-rest',        title: 'APIs REST con Node.js y Express',        category: 'Backend',     href: appRoutes.courses },
  { id: 'postgres',         title: 'Bases de datos con PostgreSQL',          category: 'Backend',     href: appRoutes.courses },
  { id: 'data-viz',         title: 'Fundamentos de visualización de datos',  category: 'Datos',       href: appRoutes.courses },
  { id: 'accessible-ui',    title: 'Interfaces accesibles para todos',       category: 'Diseño',      href: appRoutes.courses },
  { id: 'critical-thinking', title: 'Pensamiento crítico para investigación', category: 'Pensamiento', href: appRoutes.courses },
];

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
async function fetchAvailableCourses(): Promise<PublicCourse[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3010';
    const res = await fetch(`${baseUrl}/courses/public`, { next: { revalidate: 60 } });
    if (!res.ok) return FALLBACK_COURSES;

    const courses: PublishedCourse[] = await res.json();
    if (courses.length === 0) return FALLBACK_COURSES;

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      category: LEVEL_LABELS[course.level] ?? course.level,
      coverImageUrl: course.coverImageUrl ?? undefined,
      href: appRoutes.courses,
    }));
  } catch {
    return FALLBACK_COURSES;
  }
}

/** Estadísticas públicas reales (estudiantes activos, cursos publicados, tasa de finalización). */
async function fetchPublicStats(): Promise<PublicStats> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3010';
    const res = await fetch(`${baseUrl}/stats/public`, { next: { revalidate: 120 } });
    if (!res.ok) return FALLBACK_STATS;
    return await res.json();
  } catch {
    return FALLBACK_STATS;
  }
}

export default async function HomePage() {
  const [availableCourses, stats] = await Promise.all([
    fetchAvailableCourses(),
    fetchPublicStats(),
  ]);

  /* "Continúa aprendiendo" / catálogo — reusa el CardCarousel/CourseHoloCard compartido
     (mismo componente que el dashboard), con hasta 5 cursos reales. Sin barra de
     progreso: nadie tiene sesión iniciada en esta vista pública, así que no hay
     avance real que mostrar. */
  const heroCourses: CardCarouselItem[] = availableCourses.slice(0, 5).map((c, i) => ({
    id: c.id,
    title: c.title,
    eyebrow: c.category,
    description: 'Certificado verificable incluido. Explora el temario y comienza cuando quieras.',
    coverClass: c.coverImageUrl ? undefined : COVER_CLASSES[i % COVER_CLASSES.length],
    coverImageUrl: c.coverImageUrl,
    icon: <Icon icon={COURSE_COVER_ICONS[i % COURSE_COVER_ICONS.length]} width={40} height={40} style={{ color: 'rgba(255,255,255,0.9)' }} />,
    href: c.href,
    linkLabel: 'Ver curso',
  }));

  /* Carrusel de destacados del hero — 2 cursos reales + la propuesta de certificados */
  const destacados: FeaturedSlideItem[] = [
    ...availableCourses.slice(0, 2).map((c, i) => ({
      id: c.id,
      titulo: c.title,
      nivel: c.category,
      tono: PASTELS[i % PASTELS.length],
      desc: 'Explora este curso a tu propio ritmo, con evaluaciones y certificado verificable.',
      href: c.href,
    })),
    {
      id: 'certificados-feature',
      titulo: 'Certificados verificables',
      nivel: 'PLATAFORMA',
      tono: '#e3dcef',
      desc: 'Emite constancias que cualquier empleador puede validar con un escaneo.',
      href: appRoutes.scan,
    },
  ];

  return (
    <>
      {/* Intro: libro abriéndose que se va al fondo */}
      <BookIntro />

      {/* sesionActiva se detecta dentro del componente: este page es estático
          y el servidor no puede leer la cookie httpOnly sin volverlo dinámico. */}
      <RumboHero2a
        courses={heroCourses}
        destacados={destacados}
        stats={{ est: stats.activeStudents, cur: stats.publishedCourses, fin: stats.completionRate }}
      />

      {/* ── Final CTA ── */}
      <Reveal index={0}>
      <section style={{
        margin: '52px clamp(20px, 4vw, 48px)',
        padding: 'clamp(32px, 4.5vw, 68px)',
        borderRadius: '1.5rem',
        background: 'linear-gradient(135deg, var(--green-700), var(--blue-900))',
        color: 'var(--panel)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 22rem), 1fr))',
        gap: '2.25rem',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-100px', top: '-100px', width: '22.5rem', height: '22.5rem', background: 'radial-gradient(circle, rgba(255,255,255,0.16), transparent 60%)' }} />
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: '0.6563rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 600, color: 'var(--blue-300)' }}>Comienza hoy</span>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(22px,2.6vw,34px)', color: 'var(--panel)', margin: '10px 0 13px', fontWeight: 800 }}>
            Tu próxima cohorte te <span style={{ color: 'var(--green-300)' }}>está esperando.</span>
          </h2>
          <p style={{ opacity: 0.7, marginBottom: '1.375rem', fontSize: '0.9063rem' }}>Crea tu cuenta gratis. Sin tarjeta. Sin pelusa.</p>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            <Link href={appRoutes.register} style={{ display: 'inline-flex', alignItems: 'center', height: '2.75rem', padding: '0 24px', borderRadius: '999px', background: 'var(--green-300)', color: 'var(--green-900)', fontSize: '0.875rem', fontWeight: 500 }}>
              Crear cuenta
            </Link>
            <Link href={appRoutes.courses} style={{ display: 'inline-flex', alignItems: 'center', height: '2.75rem', padding: '0 24px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--panel)', fontSize: '0.875rem' }}>
              Ver catálogo
            </Link>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'var(--panel)', borderRadius: '0.875rem', padding: '1.1875rem', transform: 'rotate(-2deg)', boxShadow: 'var(--sh-3)', width: '14.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8125rem' }}>
              <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 600, color: 'var(--blue-600)' }}>Hoy</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--ink-muted)' }}>10:42</span>
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', lineHeight: 1.3, marginBottom: '0.8125rem', color: 'var(--ink)' }}>
              &ldquo;Camila terminó su quiz con 95 puntos.&rdquo;
            </div>
            <div style={{ display: 'flex', gap: '0.4375rem', alignItems: 'center' }}>
              <div style={{ width: '1.6875rem', height: '1.6875rem', borderRadius: '50%', background: 'var(--green-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6563rem', fontWeight: 600, color: 'var(--green-900)' }}>CR</div>
              <div style={{ fontSize: '0.7188rem', color: 'var(--ink-muted)' }}>Camila Ríos · Visualización de datos</div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      <Footer />
    </>
  );
}

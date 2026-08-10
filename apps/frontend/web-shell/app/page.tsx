/* ───────────────────────────────────────────
  Landing / Dashboard — Rumbo Profesores
   Sección "2a" del handoff de diseño (ver
   RumboHero2a.tsx) · CTA final · Footer
   ─────────────────────────────────────────── */

import { Icon } from '@iconify/react';
import { Footer } from '@/app/components/layout/Footer';
import { BookIntro } from '@/app/components/shared/BookIntro';
import { ExpandingCta } from '@/app/components/shared/ExpandingCta';
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

      {/* ── Final CTA — crece a pantalla completa con el scroll (ver ExpandingCta) ── */}
      <ExpandingCta />

      <Footer />
    </>
  );
}

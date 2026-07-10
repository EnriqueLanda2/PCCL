'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import { appRoutes } from '@/lib/routes';
import type { AccessProfile, Course, Inscription, Certificate } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { ProgressBar } from '@/app/components/ui/ProgressBar';
import { Badge } from '@/app/components/ui/Badge';
import { StatCard } from '@/app/components/shared/StatCard';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { CardCarousel, type CardCarouselItem } from '@/app/components/shared/CardCarousel';
import { Reveal } from '@/app/components/shared/Reveal';
import { RevealWords, RevealLetters, OpeningBook } from '@/app/components/shared/DashboardFx';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { certificateStatus, getVariant, getLabel } from '@/types/status';
import { APP_ICONS, COURSE_COVER_ICONS } from '@/lib/icons';

const COVER_CLASSES = ['cover-1', 'cover-2', 'cover-3', 'cover-4', 'cover-5', 'cover-6'];

function getCached<T>(key: string): T | null {
  try { return JSON.parse(sessionStorage.getItem(key) ?? 'null') as T; }
  catch { return null; }
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

function courseIcon(iconName: string) {
  return <Icon icon={iconName} width={40} height={40} style={{ color: 'rgba(255,255,255,0.9)' }} />;
}

function buildCarouselItems(inscriptions: Inscription[], courses: Course[]): CardCarouselItem[] {
  if (inscriptions.length > 0) {
    return inscriptions.slice(0, 6).map((ins, i) => ({
      id: ins.id,
      title: ins.course?.title ?? 'Curso',
      eyebrow: ins.course?.category ?? 'Curso',
      description: ins.course?.description || 'Continúa avanzando en este curso a tu propio ritmo.',
      progress: ins.progressPercentage ?? 0,
      coverClass: COVER_CLASSES[i % COVER_CLASSES.length],
      coverImageUrl: ins.course?.coverImageUrl ?? undefined,
      icon: courseIcon(COURSE_COVER_ICONS[i % COURSE_COVER_ICONS.length]),
      href: appRoutes.lessons,
      linkLabel: ins.status === 'completed' ? 'Repasar' : 'Continuar',
    }));
  }
  return courses
    .filter((c) => c.status === 'published')
    .slice(0, 6)
    .map((c, i) => ({
      id: c.id,
      title: c.title,
      eyebrow: c.category ?? 'Curso',
      description: c.description || 'Explora este curso y comienza cuando quieras.',
      coverClass: COVER_CLASSES[i % COVER_CLASSES.length],
      coverImageUrl: c.coverImageUrl ?? undefined,
      icon: courseIcon(COURSE_COVER_ICONS[i % COURSE_COVER_ICONS.length]),
      href: appRoutes.courses,
      linkLabel: 'Ver curso',
    }));
}

export default function DashboardPage() {
  /* Arrancan en null/[] en ambos lados (servidor y primer render del cliente) —
     sessionStorage no existe en el servidor, así que su lectura vive solo
     dentro del useEffect, nunca en el valor inicial de useState. */
  const [access,       setAccess]       = useState<AccessProfile | null>(null);
  const [courses,      setCourses]      = useState<Course[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [cachedUser,   setCachedUser]   = useState<{ fullName: string } | null>(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    let alive = true;
    const cachedAccess = getCached<AccessProfile>('pccl_access');
    const cachedUserData = getCached<{ fullName: string }>('pccl_user');
    if (cachedAccess) setAccess(cachedAccess);
    if (cachedUserData) setCachedUser(cachedUserData);

    const fetchAccess = cachedAccess ? Promise.resolve(cachedAccess) : api.access();
    Promise.allSettled([fetchAccess, api.courses(), api.inscriptions(), api.certificates()])
      .then(([aR, cR, iR, certR]) => {
        if (!alive) return;
        if (aR.status     === 'fulfilled') setAccess(aR.value);
        if (cR.status     === 'fulfilled') setCourses(cR.value);
        if (iR.status     === 'fulfilled') setInscriptions(iR.value);
        if (certR.status  === 'fulfilled') setCertificates(certR.value);
        if (!cachedUserData) api.me().then((u) => { if (alive) setCachedUser({ fullName: u.email }); }).catch(() => {});
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  const firstName   = (cachedUser?.fullName ?? 'Usuario').split(' ')[0];
  const canAdmin    = access?.permissions.some((p) => p.startsWith('users:') || p.startsWith('rbac:')) ?? false;
  const published   = courses.filter((c) => c.status === 'published').length;
  const drafts      = courses.filter((c) => c.status === 'draft').length;
  const activeInsc  = inscriptions.filter((i) => i.status === 'in-progress');
  const completed   = inscriptions.filter((i) => i.status === 'completed').length;
  const validCerts  = certificates.filter((c) => c.status === 'valid').length;
  const activeCourse = [...activeInsc].sort((a, b) => (b.progressPercentage ?? 0) - (a.progressPercentage ?? 0))[0] ?? null;
  const recentCerts  = [...certificates].sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)).slice(0, 3);
  const carouselItems = buildCarouselItems(inscriptions, courses);

  const quickLinks = [
    { label: 'Catálogo', desc: 'Explora cursos', href: appRoutes.courses,      show: true },
    { label: 'Lecciones', desc: 'Tu contenido',  href: appRoutes.lessons,      show: true },
    { label: 'Progreso', desc: 'Tu avance',       href: appRoutes.progress,     show: true },
    { label: 'Constancias', desc: 'Certificados', href: appRoutes.certificates, show: true },
    { label: 'Usuarios', desc: 'Gestión',         href: appRoutes.users,        show: canAdmin },
    { label: 'Bitácora', desc: 'Actividad',       href: appRoutes.audit,        show: canAdmin },
  ].filter((l) => l.show).slice(0, 4);

  return (
    <div className="flex flex-col gap-7">
      {/* ── Hero ── */}
      <Reveal index={0} as="section">
      <Card variant="dark" padding="default" className="relative overflow-hidden !py-3">
        <div className="absolute -right-20 -top-16 w-56 h-56 rounded-full bg-primary-400/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-16 w-44 h-44 rounded-full bg-neutral-400/5 blur-3xl pointer-events-none" />

        {/* Marca de agua gigante letra por letra */}
        <span className="hero-watermark !text-[6vw] !opacity-30" aria-hidden>
          <RevealLetters text="Rumbo" startDelay={0.4} />
        </span>

        <div className="grid gap-4 items-center relative grid-cols-1 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-primary-300/80">
              <span className="blinking-dot" aria-hidden />
              {greeting()}, {firstName}
            </span>
            <h1 className="font-serif text-lg lg:text-xl text-white/90 mt-1.5 mb-1 leading-snug">
              {activeCourse
                ? <>
                    <RevealWords text="Continúa" />
                    <em className="text-primary-200 not-italic">
                      <RevealWords text={activeCourse.course?.title ?? 'tu curso activo'} startDelay={0.15} />
                    </em>
                  </>
                : <>
                    <RevealWords text="Bienvenido a tu" />
                    <em className="text-primary-200 not-italic">
                      <RevealWords text="plataforma de aprendizaje" startDelay={0.3} />
                    </em>
                  </>}
            </h1>
            <p className="text-xs text-primary-300/70 mb-3">
              {activeCourse ? `${activeCourse.progressPercentage ?? 0}% completado` : 'Explora los cursos disponibles.'}
            </p>
            <div className="flex gap-2.5 flex-wrap">
              <Link href={activeCourse ? appRoutes.lessons : appRoutes.courses} data-cursor-expand
                className="inline-flex items-center h-8 px-4 rounded-full bg-neutral-100 hover:bg-white text-neutral-900 font-semibold text-xs no-underline transition-all hover:-translate-y-0.5">
                {activeCourse ? '▸ Continuar' : 'Explorar cursos'}
              </Link>
              <Link href={appRoutes.inscriptions} data-cursor-expand
                className="inline-flex items-center h-8 px-4 rounded-full border border-white/15 text-white/80 hover:bg-white/10 text-xs no-underline transition-all hover:-translate-y-0.5">
                Mis inscripciones
              </Link>
            </div>
          </div>

          {/* Libro abriéndose + avance */}
          <div className="relative hidden lg:flex flex-col justify-center scale-[0.55] origin-center -my-10">
            <OpeningBook />
            {activeCourse && (
              <div className="bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/10 mt-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-300/70">Tu avance</p>
                  <p className="font-serif text-2xl text-white/90 leading-none">
                    {activeCourse.progressPercentage ?? 0}<small className="text-sm text-primary-300/70 ml-0.5">%</small>
                  </p>
                </div>
                <ProgressBar value={activeCourse.progressPercentage ?? 0} color="green" className="mt-2" />
                <p className="text-[11px] text-primary-300/70 mt-1.5 truncate">{activeCourse.course?.title}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
      </Reveal>

      {/* ── Carrusel de cursos — foco principal del dashboard ── */}
      <Reveal index={1}>
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--green-600)]">
              Tu contenido
            </span>
            <h2 className="font-serif text-2xl text-[var(--ink)] mt-1">
              {inscriptions.length > 0 ? 'Tus cursos' : 'Cursos disponibles'}
            </h2>
          </div>
          <Link href={inscriptions.length > 0 ? appRoutes.inscriptions : appRoutes.courses}
            className="text-xs font-medium text-primary-500 hover:text-primary-700 no-underline flex-shrink-0">
            Ver todos →
          </Link>
        </div>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center rounded-[24px] border border-[#E4EBDD] bg-white">
            <WaveSpinner size="md" />
          </div>
        ) : carouselItems.length > 0 ? (
          <CardCarousel items={carouselItems} />
        ) : (
          <Card>
            <EmptyState icon={APP_ICONS.book} title="Sin contenido aún" description="No hay cursos disponibles." />
          </Card>
        )}
      </Reveal>

      {/* ── Todo lo demás: al fondo, discreto ── */}
      <div className="mt-8 scale-[0.97] origin-top opacity-55 grayscale-[0.4] transition-all duration-300 hover:scale-100 hover:opacity-100 hover:grayscale-0">
        {/* Stats compactos */}
        <Reveal index={2}>
        {loading
          ? <div className="flex h-16 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50/60"><WaveSpinner size="sm" /></div>
          : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {canAdmin ? (
                <>
                  <StatCard label="Cursos"      value={courses.length} className="p-3 rounded-xl shadow-none border-neutral-100 bg-neutral-50/70" />
                  <StatCard label="Publicados"  value={published} className="p-3 rounded-xl shadow-none border-neutral-100 bg-neutral-50/70" />
                  <StatCard label="Borradores"  value={drafts} className="p-3 rounded-xl shadow-none border-neutral-100 bg-neutral-50/70" />
                  <StatCard label="Constancias" value={validCerts} className="p-3 rounded-xl shadow-none border-neutral-100 bg-neutral-50/70" />
                </>
              ) : (
                <>
                  <StatCard label="Inscripciones" value={inscriptions.length} className="p-3 rounded-xl shadow-none border-neutral-100 bg-neutral-50/70" />
                  <StatCard label="En progreso"   value={activeInsc.length} className="p-3 rounded-xl shadow-none border-neutral-100 bg-neutral-50/70" />
                  <StatCard label="Completados"   value={completed} className="p-3 rounded-xl shadow-none border-neutral-100 bg-neutral-50/70" />
                  <StatCard label="Constancias"   value={validCerts} className="p-3 rounded-xl shadow-none border-neutral-100 bg-neutral-50/70" />
                </>
              )}
            </div>
          )}
        </Reveal>

        {/* Two columns, más pequeñas y discretas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
          {/* Quick links */}
          <Reveal index={3}>
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
            <h2 className="text-sm font-semibold text-neutral-600 mb-3">Accesos rápidos</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((item) => (
                <Link key={item.label} href={item.href}
                  className="flex flex-col gap-0.5 p-2.5 rounded-lg bg-white/70 border border-neutral-100 no-underline hover:border-primary-200 hover:bg-primary-50/60 transition-colors group">
                  <strong className="text-xs text-neutral-600 group-hover:text-primary-700">{item.label}</strong>
                  <span className="text-[11px] text-neutral-400">{item.desc}</span>
                </Link>
              ))}
            </div>
          </div>
          </Reveal>

          {/* Certificados recientes */}
          <Reveal index={4}>
          <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-neutral-600">Certificados recientes</h2>
              <Link href={appRoutes.certificates} className="text-[11px] font-medium text-primary-400 hover:text-primary-600 no-underline">
                Ver todos →
              </Link>
            </div>
            {loading ? (
              <div className="flex h-20 items-center justify-center"><WaveSpinner size="sm" /></div>
            ) : recentCerts.length > 0 ? (
              <div className="flex flex-col divide-y divide-neutral-100">
                {recentCerts.map((cert) => (
                  <div key={cert.id} className="flex items-center gap-2.5 py-2">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white text-neutral-400">
                      <Icon icon={APP_ICONS.diploma} width={15} height={15} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-600 truncate">
                        {cert.inscription?.course?.title ?? 'Curso completado'}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono">{cert.certificateNumber}</p>
                    </div>
                    <Badge variant={getVariant(certificateStatus, cert.status)}>
                      {getLabel(certificateStatus, cert.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={APP_ICONS.diploma} title="Sin certificados aún" description="Termina un curso para obtener tu primera constancia." />
            )}
          </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

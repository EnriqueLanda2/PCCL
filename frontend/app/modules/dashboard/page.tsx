'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { appRoutes } from '@/lib/routes';
import type { AccessProfile, Course, Inscription, Certificate } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';

function getCached<T>(key: string): T | null {
  try { return JSON.parse(sessionStorage.getItem(key) ?? 'null') as T; }
  catch { return null; }
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

function SkeletonCard() {
  return <div className="bg-neutral-200 rounded-lg h-28 animate-pulse" />;
}

export default function DashboardPage() {
  const [access,       setAccess]       = useState<AccessProfile | null>(getCached('pccl_access'));
  const [courses,      setCourses]      = useState<Course[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [cachedUser,   setCachedUser]   = useState<{ fullName: string } | null>(getCached('pccl_user'));
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchAccess = access ? Promise.resolve(access) : api.access();
    Promise.allSettled([fetchAccess, api.courses(), api.inscriptions(), api.certificates()])
      .then(([aR, cR, iR, certR]) => {
        if (!alive) return;
        if (aR.status     === 'fulfilled') setAccess(aR.value);
        if (cR.status     === 'fulfilled') setCourses(cR.value);
        if (iR.status     === 'fulfilled') setInscriptions(iR.value);
        if (certR.status  === 'fulfilled') setCertificates(certR.value);
        if (!cachedUser) api.me().then((u) => { if (alive) setCachedUser({ fullName: u.email }); }).catch(() => {});
        setLoading(false);
      });
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName   = (cachedUser?.fullName ?? 'Usuario').split(' ')[0];
  const canAdmin    = access?.permissions.some((p) => p.startsWith('users:') || p.startsWith('rbac:')) ?? false;
  const published   = courses.filter((c) => c.status === 'published').length;
  const drafts      = courses.filter((c) => c.status === 'draft').length;
  const activeInsc  = inscriptions.filter((i) => i.status === 'in-progress');
  const completed   = inscriptions.filter((i) => i.status === 'completed').length;
  const validCerts  = certificates.filter((c) => c.status === 'valid').length;
  const activeCourse = [...activeInsc].sort((a, b) => (b.progressPercentage ?? 0) - (a.progressPercentage ?? 0))[0] ?? null;

  const quickLinks = [
    { label: 'Catálogo', desc: 'Explora cursos', href: appRoutes.courses,      show: true },
    { label: 'Lecciones', desc: 'Tu contenido',  href: appRoutes.lessons,      show: true },
    { label: 'Progreso', desc: 'Tu avance',       href: appRoutes.progress,     show: true },
    { label: 'Constancias', desc: 'Certificados', href: appRoutes.certificates, show: true },
    { label: 'Usuarios', desc: 'Gestión',         href: appRoutes.users,        show: canAdmin },
    { label: 'Bitácora', desc: 'Actividad',       href: appRoutes.audit,        show: canAdmin },
  ].filter((l) => l.show).slice(0, 4);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Hero ── */}
      <Card variant="dark" padding="default" className="relative overflow-hidden">
        <div className="absolute -right-20 -top-16 w-72 h-72 rounded-full bg-primary-400/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-16 w-56 h-56 rounded-full bg-warning-500/10 blur-3xl pointer-events-none" />

        <div className={`grid gap-8 items-center relative ${activeCourse ? 'grid-cols-[1.4fr_1fr]' : 'grid-cols-1'}`}>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-300">
              {greeting()}, {firstName}
            </span>
            <h1 className="font-serif text-2xl lg:text-4xl text-white mt-3 mb-2 leading-snug">
              {activeCourse
                ? <><span>Continúa </span><em className="text-warning-300 not-italic">{activeCourse.course?.title ?? 'tu curso activo'}</em></>
                : <><span>Bienvenido a tu </span><em className="text-warning-300 not-italic">plataforma de aprendizaje</em></>}
            </h1>
            <p className="text-sm text-primary-200 mb-6">
              {activeCourse ? `${activeCourse.progressPercentage ?? 0}% completado` : 'Explora los cursos disponibles.'}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href={activeCourse ? appRoutes.lessons : appRoutes.courses}
                className="inline-flex items-center h-11 px-6 rounded-full bg-warning-400 hover:bg-warning-300 text-neutral-900 font-semibold text-sm no-underline transition-colors">
                {activeCourse ? '▸ Continuar' : 'Explorar cursos'}
              </Link>
              <Link href={appRoutes.inscriptions}
                className="inline-flex items-center h-11 px-6 rounded-full border border-white/20 text-white hover:bg-white/10 text-sm no-underline transition-colors">
                Mis inscripciones
              </Link>
            </div>
          </div>

          {activeCourse && (
            <div className="bg-white/8 rounded-xl p-5 backdrop-blur-sm border border-white/10">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-300 mb-2">Tu avance</p>
              <p className="font-serif text-6xl text-white leading-none">
                {activeCourse.progressPercentage ?? 0}<small className="text-3xl text-primary-300 ml-0.5">%</small>
              </p>
              <ProgressBar value={activeCourse.progressPercentage ?? 0} color="green" className="mt-3" />
              <p className="text-xs text-primary-300 mt-2 truncate">{activeCourse.course?.title}</p>
            </div>
          )}
        </div>
      </Card>

      {/* ── Stats ── */}
      {loading
        ? <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map((i) => <SkeletonCard key={i} />)}</div>
        : (
          <div className="grid grid-cols-4 gap-4">
            {canAdmin ? (
              <>
                <StatCard label="Cursos"            value={courses.length} />
                <StatCard label="Publicados"        value={published} deltaUp />
                <StatCard label="Borradores"        value={drafts} />
                <StatCard label="Constancias"       value={validCerts} deltaUp />
              </>
            ) : (
              <>
                <StatCard label="Inscripciones"     value={inscriptions.length} />
                <StatCard label="En progreso"       value={activeInsc.length} />
                <StatCard label="Completados"       value={completed} deltaUp />
                <StatCard label="Constancias"       value={validCerts} deltaUp />
              </>
            )}
          </div>
        )}

      {/* ── Two columns ── */}
      <div className="grid grid-cols-2 gap-5">
        {/* Quick links */}
        <Card>
          <h2 className="font-serif text-xl text-neutral-900 mb-1">Accesos rápidos</h2>
          <p className="text-sm text-neutral-500 mb-5">Navega a las áreas principales.</p>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map((item) => (
              <Link key={item.label} href={item.href}
                className="flex flex-col gap-1 p-4 rounded-lg bg-neutral-50 border border-neutral-200 no-underline hover:border-primary-300 hover:bg-primary-50 transition-colors group">
                <strong className="text-sm text-neutral-900 group-hover:text-primary-700">{item.label}</strong>
                <span className="text-xs text-neutral-500">{item.desc}</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Summary */}
        <Card>
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-serif text-xl text-neutral-900">
              {inscriptions.length > 0 ? 'Mis inscripciones' : 'Cursos disponibles'}
            </h2>
            <Link href={inscriptions.length > 0 ? appRoutes.inscriptions : appRoutes.courses}
              className="text-xs font-medium text-primary-500 hover:text-primary-700 no-underline">
              Ver todos →
            </Link>
          </div>
          {loading ? (
            <div className="flex flex-col gap-3">{[1,2,3].map((i) => <div key={i} className="h-10 rounded bg-neutral-100 animate-pulse" />)}</div>
          ) : inscriptions.length > 0 ? (
            <div className="flex flex-col divide-y divide-neutral-100">
              {inscriptions.slice(0, 4).map((ins) => (
                <div key={ins.id} className="flex items-center gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{ins.course?.title ?? 'Curso'}</p>
                    <ProgressBar value={ins.progressPercentage ?? 0} color={ins.status === 'completed' ? 'green' : 'blue'} className="mt-1.5" />
                  </div>
                  <span className="text-xs text-neutral-500 min-w-[34px] text-right">{ins.progressPercentage ?? 0}%</span>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="flex flex-col divide-y divide-neutral-100">
              {courses.filter((c) => c.status === 'published').slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{c.title}</p>
                    <p className="text-xs text-neutral-500">{c.level}</p>
                  </div>
                  <Badge variant="green">Publicado</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="📚" title="Sin contenido aún" description="No hay cursos disponibles." />
          )}
        </Card>
      </div>

      {/* ── Active courses (student) ── */}
      {!loading && activeInsc.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-serif text-xl text-neutral-900">En progreso</h2>
            <Link href={appRoutes.inscriptions} className="text-xs font-medium text-primary-500 hover:text-primary-700 no-underline">Ver inscripciones →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeInsc.slice(0, 3).map((ins) => (
              <div key={ins.id} className="p-4 rounded-lg border border-neutral-200 bg-neutral-50">
                <p className="text-sm font-semibold text-neutral-900 mb-3 truncate">{ins.course?.title ?? 'Curso activo'}</p>
                <ProgressBar value={ins.progressPercentage ?? 0} color="blue" showLabel />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

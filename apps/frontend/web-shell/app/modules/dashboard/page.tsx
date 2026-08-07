'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { AccessProfile, Certificate, Course, Inscription } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { RadarChart } from '@/app/components/ui/RadarChart';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

type ChartDatum = {
  label: string;
  value: number;
  color: string;
};

type ProgressDatum = {
  label: string;
  value: number;
};

const CHART_COLORS = ['#1F9A4B', '#2566CB', '#D99A2B', '#6D5BD0', '#DB5F57'];

/** Lectura del panel según el rol de la sesión. */
type ViewMode = 'admin' | 'instructor' | 'student';

const MODE_COPY = {
  admin: {
    badge:       'Panel administrador',
    badgeTone:   'green' as const,
    subtitle:    'Estadísticas generales de toda la plataforma.',
    donutTitle:  'Estado de cursos',
    donutDesc:   'Publicados contra borradores en la plataforma',
    barTitle:    'Finalización por curso',
    barDesc:     'Porcentaje de alumnos que completaron cada curso',
    radarSeries: ['Cursos', 'Publicación'] as [string, string],
    certDesc:    'Certificados válidos emitidos por mes',
  },
  instructor: {
    badge:       'Panel profesor',
    badgeTone:   'green' as const,
    subtitle:    'Estadísticas de los alumnos inscritos en tus cursos.',
    donutTitle:  'Estado de cursos',
    donutDesc:   'Publicados contra borradores',
    barTitle:    'Finalización por curso',
    barDesc:     'Porcentaje de tus alumnos que completaron cada curso',
    radarSeries: ['Cursos', 'Publicación'] as [string, string],
    certDesc:    'Certificados válidos de tus alumnos por mes',
  },
  student: {
    badge:       'Panel alumno',
    badgeTone:   'blue' as const,
    subtitle:    'Estadísticas de tus cursos como alumno.',
    donutTitle:  'Estado de aprendizaje',
    donutDesc:   'Cursos activos, completados o pausados',
    barTitle:    'Avance por curso',
    barDesc:     'Progreso individual en tus cursos',
    radarSeries: ['Actividad', 'Cierre'] as [string, string],
    certDesc:    'Tus certificados válidos por mes',
  },
} as const;

function getCached<T>(key: string): T | null {
  try { return JSON.parse(sessionStorage.getItem(key) ?? 'null') as T; }
  catch { return null; }
}

function pct(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function clampPercent(value: number | null | undefined) {
  return Math.max(0, Math.min(100, Math.round(value ?? 0)));
}

function DonutChart({ data, title, description }: Readonly<{ data: ChartDatum[]; title: string; description: string }>) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const segments = data.reduce<Array<ChartDatum & { dash: number; offset: number }>>((acc, item) => {
    const previousOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 25;
    const dash = total > 0 ? (item.value / total) * 263.89 : 0;
    return [...acc, { ...item, dash, offset: previousOffset }];
  }, []);

  return (
    <figure className="m-0">
      <figcaption className="mb-3">
        <p className="text-base font-semibold leading-tight text-[var(--ink)]">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{description}</p>
      </figcaption>
      <div className="grid items-center gap-4 sm:grid-cols-[140px_1fr]">
        <svg viewBox="0 0 120 120" className="h-[8.75rem] w-[8.75rem]" role="img" aria-label={title}>
          <circle cx="60" cy="60" r="42" fill="none" stroke="#E7EDE2" strokeWidth="18" />
          {segments.map((item, index) => (
              <circle
                key={item.label}
                className="dashboard-donut-segment"
                cx="60"
                cy="60"
                r="42"
                fill="none"
                stroke={item.color}
                strokeWidth="18"
                strokeLinecap="round"
                strokeDasharray={`${item.dash} 263.89`}
                strokeDashoffset={-item.offset}
                transform="rotate(-90 60 60)"
                style={{ animationDelay: `${index * 120}ms` }}
              />
          ))}
          <text x="60" y="56" textAnchor="middle" className="fill-[var(--ink)] text-[1.25rem] font-extrabold">
            {total}
          </text>
          <text x="60" y="73" textAnchor="middle" className="fill-[var(--ink-muted)] text-[0.625rem] font-bold uppercase tracking-wide">
            total
          </text>
        </svg>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3">
              <span className="inline-flex min-w-0 items-center gap-2 text-xs text-[var(--ink-soft)]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.label}</span>
              </span>
              <strong className="text-xs text-[var(--ink)]">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

function BarChart({ data, title, description }: Readonly<{ data: ProgressDatum[]; title: string; description: string }>) {
  const chartData = data.length > 0 ? data : [{ label: 'Sin datos', value: 0 }];

  return (
    <figure className="m-0">
      <figcaption className="mb-3">
        <p className="text-base font-semibold leading-tight text-[var(--ink)]">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{description}</p>
      </figcaption>
      <div className="space-y-2.5">
        {chartData.map((item, index) => {
          const value = clampPercent(item.value);
          return (
            <div key={`${item.label}-${index}`} className="grid gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-xs font-medium text-[var(--ink)]">{item.label}</span>
                <span className="text-xs font-bold text-[var(--ink)]">{value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E7EDE2]">
                <div
                  className="dashboard-bar-fill h-full rounded-full"
                  style={{
                    '--bar-width': `${value}%`,
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                    animationDelay: `${index * 70}ms`,
                  } as React.CSSProperties}
                />
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

function AreaChart({ data, title, description }: Readonly<{ data: ProgressDatum[]; title: string; description: string }>) {
  const values = data.length > 0 ? data : [{ label: 'Inicio', value: 0 }];
  const max = Math.max(1, ...values.map((item) => item.value));
  const points = values.map((item, index) => {
    const x = values.length === 1 ? 160 : 24 + (index * 272) / (values.length - 1);
    const y = 164 - (item.value / max) * 118;
    return { ...item, x, y };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(' ');
  const area = `24,176 ${line} 296,176`;

  return (
    <figure className="m-0">
      <figcaption className="mb-2">
        <p className="text-base font-semibold leading-tight text-[var(--ink)]">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">{description}</p>
      </figcaption>
      {/* Sin alto fijo: el viewBox es 320×190 (1.68) y forzar 150px de alto daba
          un contenedor de proporción 2.8, así que preserveAspectRatio ajustaba
          al alto y dejaba franjas vacías a los lados. Dejando que mande el
          ancho, el dibujo ocupa de verdad la tarjeta. */}
      <svg viewBox="0 0 320 190" className="mx-auto block h-auto w-full max-w-[38rem]" role="img" aria-label={title}>
        {[0, 1, 2, 3].map((row) => (
          <line key={row} x1="24" x2="296" y1={46 + row * 43} y2={46 + row * 43} stroke="#E7EDE2" />
        ))}
        <polygon className="dashboard-area-fill" points={area} fill="#1F9A4B" opacity="0.12" />
        <polyline className="dashboard-line-draw" points={line} fill="none" stroke="#1F9A4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle className="dashboard-point-pop" cx={point.x} cy={point.y} r="5" fill="#1F9A4B" stroke="#FFFFFF" strokeWidth="2" style={{ animationDelay: `${350 + index * 70}ms` }} />
            <text x={point.x} y="184" textAnchor="middle" className="fill-[var(--ink-muted)] text-[0.625rem] font-medium">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

function StatTile({ value, label, helper }: Readonly<{ value: string | number; label: string; helper: string }>) {
  return (
    <div className="rounded-xl border border-[#E4EBDD] bg-white p-3 dashboard-card-in">
      <div className="text-xl font-extrabold leading-none text-[var(--ink)]">{value}</div>
      <div className="mt-1.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-muted)]">{label}</div>
      <div className="mt-0.5 truncate text-xs text-[var(--ink-soft)]">{helper}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [access, setAccess] = useState<AccessProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [cachedUser, setCachedUser] = useState<{ id?: string; fullName?: string; email?: string } | null>(null);
  const [sessionName, setSessionName] = useState('Usuario');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const cachedAccess = getCached<AccessProfile>('pccl_access');
    const cachedUserData = getCached<{ id?: string; fullName?: string; email?: string }>('pccl_user');

    queueMicrotask(() => {
      if (!alive) return;
      if (cachedAccess) setAccess(cachedAccess);
      if (cachedUserData) {
        setCachedUser(cachedUserData);
        setSessionName(cachedUserData.fullName ?? cachedUserData.email ?? 'Usuario');
      }
    });

    Promise.allSettled([
      cachedAccess ? Promise.resolve(cachedAccess) : api.access(),
      api.courses(),
      api.inscriptions(),
      api.certificates(),
    ]).then(([accessResult, coursesResult, inscriptionsResult, certificatesResult]) => {
      if (!alive) return;
      if (accessResult.status === 'fulfilled') setAccess(accessResult.value);
      if (coursesResult.status === 'fulfilled') setCourses(coursesResult.value);
      if (inscriptionsResult.status === 'fulfilled') setInscriptions(inscriptionsResult.value);
      if (certificatesResult.status === 'fulfilled') setCertificates(certificatesResult.value);
      setLoading(false);
    });

    if (!cachedUserData?.fullName) {
      api.users()
        .then((users) => {
          if (!alive) return;
          const current = users.find((user) => (
            (cachedUserData?.id && user.id === cachedUserData.id) ||
            (cachedUserData?.email && user.email === cachedUserData.email)
          ));
          if (current?.fullName) {
            setCachedUser((prev) => ({ ...prev, id: current.id, email: current.email, fullName: current.fullName }));
            setSessionName(current.fullName);
            const cached = getCached<Record<string, unknown>>('pccl_user') ?? {};
            sessionStorage.setItem('pccl_user', JSON.stringify({ ...cached, id: current.id, email: current.email, fullName: current.fullName }));
            window.dispatchEvent(new Event('pccl_user_updated'));
          }
        })
        .catch(() => {});
    }

    return () => { alive = false; };
  }, []);

  /* El backend ya entrega inscripciones, avances y constancias acotados a la
     sesión (admin = toda la plataforma, instructor = alumnos de sus cursos,
     resto = solo lo propio). Aquí solo se elige la lectura y las etiquetas. */
  const roles = access?.roles ?? [];
  const mode: ViewMode = roles.includes('admin')
    ? 'admin'
    : roles.includes('instructor')
      ? 'instructor'
      : 'student';
  const isManagerView = mode !== 'student';
  const copy = MODE_COPY[mode];

  const firstName = (sessionName || cachedUser?.fullName || cachedUser?.email || 'Usuario').split(' ')[0];

  /* `courses.createdBy` guarda el correo del actor, no su UUID: el gateway
     escribe `user.email` como actor al crear el curso. */
  const visibleCourses =
    mode === 'admin'
      ? courses
      : mode === 'instructor'
        ? courses.filter((course) => course.createdBy === cachedUser?.email)
        : courses.filter((course) => inscriptions.some((item) => item.course?.id === course.id));

  const published = visibleCourses.filter((course) => course.status === 'published').length;
  const drafts = visibleCourses.filter((course) => course.status === 'draft').length;
  const activeInscriptions = inscriptions.filter((item) => item.status === 'in-progress' || item.status === 'enrolled');
  const completedInscriptions = inscriptions.filter((item) => item.status === 'completed');
  const validCertificates = certificates.filter((cert) => cert.status === 'valid');
  const averageProgress = pct(
    inscriptions.reduce((sum, item) => sum + clampPercent(item.progressPercentage), 0),
    Math.max(inscriptions.length, 1) * 100,
  );

  const courseStatusData: ChartDatum[] = isManagerView
    ? [
        { label: 'Publicados', value: published, color: CHART_COLORS[0] },
        { label: 'Borradores', value: drafts, color: CHART_COLORS[2] },
      ]
    : [
        { label: 'En curso', value: activeInscriptions.length, color: CHART_COLORS[0] },
        { label: 'Completados', value: completedInscriptions.length, color: CHART_COLORS[1] },
        { label: 'Pausados', value: inscriptions.filter((item) => item.status === 'dropped').length, color: CHART_COLORS[4] },
      ];

  const progressData = (isManagerView
    ? visibleCourses.slice(0, 6).map((course) => ({
        label: course.title,
        value: pct(inscriptions.filter((item) => item.course?.id === course.id && item.status === 'completed').length, Math.max(1, inscriptions.filter((item) => item.course?.id === course.id).length)),
      }))
    : inscriptions.slice(0, 6).map((item) => ({
        label: item.course?.title ?? 'Curso',
        value: clampPercent(item.progressPercentage),
      }))
  ).filter((item) => item.label);

  const categories = (isManagerView ? visibleCourses : inscriptions.map((item) => item.course).filter(Boolean) as Course[])
    .reduce<Record<string, { total: number; completed: number }>>((acc, course) => {
      const key = course.category ?? course.level ?? 'General';
      acc[key] ??= { total: 0, completed: 0 };
      acc[key].total += 1;
      if (isManagerView ? course.status === 'published' : inscriptions.some((item) => item.course?.id === course.id && item.status === 'completed')) {
        acc[key].completed += 1;
      }
      return acc;
    }, {});

  const radarData = Object.entries(categories).slice(0, 6).map(([categoria, values]) => ({
    categoria,
    actividad: pct(values.total, Math.max(1, isManagerView ? visibleCourses.length : inscriptions.length)),
    cierre: pct(values.completed, Math.max(1, values.total)),
  }));

  const monthlyCertificates = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map((label, index) => ({
    label,
    value: validCertificates.filter((cert) => {
      const issued = new Date(cert.issuedAt);
      return Number.isFinite(issued.getTime()) && issued.getMonth() === index;
    }).length,
  }));

  if (loading) {
    return (
      <div className="flex min-h-[26.25rem] items-center justify-center">
        <WaveSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <PageHeader
        title={<>Hola, {firstName}</>}
        subtitle={copy.subtitle}
        action={<Badge variant={copy.badgeTone}>{copy.badge}</Badge>}
      />

      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {isManagerView ? (
          <>
            <StatTile
              value={visibleCourses.length}
              label="Cursos"
              helper={mode === 'admin' ? 'Cursos en la plataforma' : 'Cursos bajo tu gestión'}
            />
            <StatTile value={published} label="Publicados" helper={`${pct(published, visibleCourses.length)}% visibles`} />
            <StatTile
              value={inscriptions.length}
              label="Inscripciones"
              helper={mode === 'admin' ? 'Total de alumnos inscritos' : 'Alumnos en tus cursos'}
            />
            <StatTile value={validCertificates.length} label="Constancias" helper="Emitidas y válidas" />
          </>
        ) : (
          <>
            <StatTile value={inscriptions.length} label="Inscripciones" helper="Cursos asignados" />
            <StatTile value={activeInscriptions.length} label="En progreso" helper="Cursos activos" />
            <StatTile value={`${averageProgress}%`} label="Avance" helper="Promedio general" />
            <StatTile value={validCertificates.length} label="Constancias" helper="Obtenidas y válidas" />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-4 dashboard-card-in">
          <DonutChart
            data={courseStatusData}
            title={copy.donutTitle}
            description={copy.donutDesc}
          />
        </Card>

        <Card className="p-4 dashboard-card-in">
          <BarChart
            data={progressData}
            title={copy.barTitle}
            description={copy.barDesc}
          />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="dashboard-card-in dashboard-card-dots p-3">
          <RadarChart
            data={radarData.length > 0 ? radarData : [{ categoria: 'General', actividad: 0, cierre: 0 }]}
            angleKey="categoria"
            valueKeys={['actividad', 'cierre']}
            seriesLabels={[...copy.radarSeries]}
            title="Rendimiento por categoría"
            description="Comparación entre actividad y cierre por área"
            className="dashboard-radar-compact"
          />
        </Card>

        <Card className="dashboard-card-in dashboard-card-dots p-3">
          <AreaChart
            data={monthlyCertificates}
            title="Constancias emitidas"
            description={copy.certDesc}
          />
        </Card>
      </div>
    </div>
  );
}

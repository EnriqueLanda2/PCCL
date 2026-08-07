'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { AppButton } from '@/app/components/ui/AppControls';
import { StudentAvatar } from '@/app/components/shared/StudentAvatar';
import { PieChart, type PieChartDatum } from '@/app/components/ui/PieChart';
import { RadarChart } from '@/app/components/ui/RadarChart';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { api, getErrorMessage } from '@/lib/api';
import type { AccessProfile, Certificate, Course, Inscription, SessionUser } from '@/lib/types';
import { PendingTasks } from '@/app/components/shared/PendingTasks';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { getLabel, courseLevel, coursePublishStatus, inscriptionStatus } from '@/types/status';
import { APP_ICONS } from '@/lib/icons';
import { appRoutes } from '@/lib/routes';

function tally<T>(items: T[], keyFn: (item: T) => string | undefined): PieChartDatum[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

export default function IdentityProfilePage() {
  const [profile, setProfile] = useState({
    id: '',
    fullName: 'Usuario',
    email: '',
    avatarUrl: null as string | null,
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [access,       setAccess]       = useState<AccessProfile | null>(null);
  const [courses,      setCourses]      = useState<Course[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [me,           setMe]           = useState<SessionUser | null>(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const cached = JSON.parse(sessionStorage.getItem('pccl_user') ?? 'null') as {
          id?: string;
          fullName?: string;
          email?: string;
          avatarUrl?: string | null;
        } | null;
        if (cached) {
          setProfile({
            id: cached.id ?? '',
            fullName: cached.fullName ?? cached.email ?? 'Usuario',
            email: cached.email ?? '',
            avatarUrl: cached.avatarUrl ?? null,
          });
        }
      } catch {
        // conserva el perfil por defecto
      }
    });

    let alive = true;
    Promise.allSettled([api.me(), api.access(), api.courses(), api.inscriptions(), api.certificates()])
      .then(([meR, accessR, coursesR, inscR, certR]) => {
        if (!alive) return;
        if (meR.status      === 'fulfilled') {
          setMe(meR.value);
          setProfile({
            id: meR.value.id,
            fullName: meR.value.fullName ?? meR.value.email,
            email: meR.value.email,
            avatarUrl: meR.value.avatarUrl ?? null,
          });
        }
        if (accessR.status  === 'fulfilled') setAccess(accessR.value);
        if (coursesR.status === 'fulfilled') setCourses(coursesR.value);
        if (inscR.status    === 'fulfilled') setInscriptions(inscR.value);
        if (certR.status    === 'fulfilled') setCertificates(certR.value);
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  const isInstructor = (access?.permissions.includes('courses:create') ?? false)
    || (access?.roles.some((r) => r === 'instructor' || r === 'admin') ?? false);
  const isAdmin = access?.roles.includes('admin') ?? false;

  const effectiveRole = isInstructor ? 'profesor' : 'alumno';
  const roleLabel = isAdmin ? 'Administrador' : isInstructor ? 'Instructor' : 'Alumno';

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage('Selecciona una imagen válida.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const uploaded = await api.uploadImage(file);
      const updated = await api.updateMyAvatar(uploaded.url);
      const nextProfile = { ...profile, avatarUrl: updated.avatarUrl };
      setProfile(nextProfile);

      const cached = JSON.parse(sessionStorage.getItem('pccl_user') ?? '{}') as Record<string, unknown>;
      sessionStorage.setItem('pccl_user', JSON.stringify({ ...cached, ...nextProfile }));
      window.dispatchEvent(new Event('pccl_user_updated'));
      setMessage('Foto de perfil actualizada.');
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  /* ── Recorte de "lo mío" a partir de las listas del sistema — sin
     endpoints nuevos: courses ya trae createdBy (email de quien lo creó),
     inscriptions/certificates ya traen el usuario embebido. ── */
  const myCourses = useMemo(
    () => courses.filter((c) => c.createdBy && c.createdBy === me?.email),
    [courses, me],
  );
  const myCourseIds = useMemo(() => new Set(myCourses.map((c) => c.id)), [myCourses]);
  const myInscriptions = useMemo(
    () => inscriptions.filter((i) => i.user?.id === me?.id),
    [inscriptions, me],
  );
  const myCertificates = useMemo(
    () => certificates.filter((c) => c.inscription?.user?.id === me?.id),
    [certificates, me],
  );
  const studentsInMyCourses = useMemo(() => {
    const ids = new Set(
      inscriptions.filter((i) => i.course?.id && myCourseIds.has(i.course.id)).map((i) => i.user?.id),
    );
    ids.delete(undefined);
    return ids.size;
  }, [inscriptions, myCourseIds]);
  const certificatesFromMyCourses = useMemo(
    () => certificates.filter((c) => c.inscription?.course?.id && myCourseIds.has(c.inscription.course.id)),
    [certificates, myCourseIds],
  );

  const myCoursesByStatus   = tally(myCourses, (c) => getLabel(coursePublishStatus, c.status));
  const myCoursesByLevel    = tally(myCourses, (c) => getLabel(courseLevel, c.level));
  const myCoursesByCategory = tally(myCourses, (c) => c.category).slice(0, 6);

  const myInscByStatus   = tally(myInscriptions, (i) => getLabel(inscriptionStatus, i.status));
  const myInscByCategory = tally(myInscriptions, (i) => i.course?.category).slice(0, 6);
  const avgProgress = myInscriptions.length
    ? Math.round(myInscriptions.reduce((sum, i) => sum + (i.progressPercentage ?? 0), 0) / myInscriptions.length)
    : 0;
  const instructorRadarData = [
    { label: 'Cursos', value: myCourses.length },
    { label: 'Publicados', value: myCourses.filter((c) => c.status === 'published').length },
    { label: 'Borradores', value: myCourses.filter((c) => c.status === 'draft').length },
    { label: 'Estudiantes', value: studentsInMyCourses },
    { label: 'Certificados', value: certificatesFromMyCourses.length },
  ];
  const studentRadarData = [
    { label: 'Inscritos', value: myInscriptions.length },
    { label: 'Completados', value: myInscriptions.filter((i) => i.status === 'completed').length },
    { label: 'En progreso', value: myInscriptions.filter((i) => i.status === 'in-progress').length },
    { label: 'Avance', value: avgProgress },
    { label: 'Certificados', value: myCertificates.length },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader
        title="Perfil e impartición"
        subtitle="Tu cuenta, tus cursos y tu actividad en la plataforma."
      />

      {/* ── Encabezado: avatar grande + identidad + acciones ── */}
      <Card className="overflow-hidden p-0">
        {/* Banda superior: da peso al avatar sin necesidad de una foto de
            portada, que no tenemos. */}
        <div className="h-20 bg-[linear-gradient(120deg,var(--green-50)_0%,#EAF3FF_55%,#F6F1FF_100%)] sm:h-24" />

        <div className="flex flex-col gap-5 px-5 pb-5 sm:flex-row sm:items-end sm:gap-6 sm:px-7 sm:pb-6">
          {/* El avatar cabalga sobre la banda: es el elemento principal. */}
          <div className="-mt-14 shrink-0 sm:-mt-16">
            <StudentAvatar
              userId={profile.id ?? profile.email ?? ''}
              fullName={profile.fullName || profile.email || 'Usuario'}
              avatarUrl={profile.avatarUrl}
              size="xl"
              ring
              className="shadow-[0_16px_28px_rgba(31,154,75,0.18)]"
            />
          </div>

          <div className="min-w-0 flex-1 sm:pb-1">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* h2, no h1: el título de la página ya lo pone PageHeader y dos h1
                  en la misma vista rompen la jerarquía para lectores de pantalla. */}
              <h2 className="text-2xl font-extrabold leading-tight text-[var(--ink)]">{profile.fullName}</h2>
              <Badge variant={isInstructor ? 'blue' : 'green'}>{roleLabel}</Badge>
              <Badge variant="green">Activo</Badge>
            </div>
            <p className="mt-1 truncate text-sm text-[var(--ink-muted)]">{profile.email}</p>
            {message && <p className="mt-1.5 text-xs font-medium text-[var(--green-700)]">{message}</p>}
          </div>

          <div className="flex flex-wrap gap-2 sm:pb-1">
            {/* Dos caminos distintos a propósito: personalizar el personaje 3D
                es una tarea larga y vive en su propia pantalla; subir una foto
                es un gesto de un clic y se queda aquí. */}
            <AppButton href={appRoutes.avatar} variant="contained">
              Cambiar avatar
            </AppButton>
            <AppButton onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? 'Subiendo…' : 'Subir foto'}
            </AppButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <WaveSpinner size="lg" label="Cargando estadísticas…" />
        </div>
      ) : effectiveRole === 'profesor' ? (
        <>
          {/* Cifras simples — sin tarjetas de color, solo número + etiqueta */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-y border-neutral-100 py-3">
            {[
              { label: 'Mis cursos', value: myCourses.length },
              { label: 'Publicados', value: myCourses.filter((c) => c.status === 'published').length },
              { label: 'Estudiantes', value: studentsInMyCourses },
              { label: 'Certificados emitidos', value: certificatesFromMyCourses.length },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-xl leading-none text-[var(--ink)]">{s.value}</div>
                <div className="mt-1 text-[0.6875rem] uppercase tracking-wide text-[var(--ink-muted)]">{s.label}</div>
              </div>
            ))}
          </div>

          {myCourses.length === 0 ? (
            <Card padding="default">
              <EmptyState icon={APP_ICONS.book} title="Aún no has creado cursos" description="Cuando publiques cursos, aquí verás sus estadísticas." />
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6 lg:p-7">
                <PieChart data={myCoursesByStatus} title="Mis cursos por estado" description="Publicados vs. borradores" />
              </Card>
              <Card className="p-6 lg:p-7">
                <PieChart data={myCoursesByLevel} title="Mis cursos por nivel" description="Básico, intermedio, avanzado" />
              </Card>
              {myCoursesByCategory.length > 1 && (
                <Card className="p-6 lg:p-7 lg:col-span-2">
                  <RadarChart
                    data={myCoursesByCategory}
                    angleKey="label"
                    valueKeys={['value']}
                    seriesLabels={['Cursos']}
                    max={Math.max(...myCoursesByCategory.map((d) => d.value), 1)}
                    title="Mis cursos por categoría"
                    description="Distribución de tus temas"
                  />
                </Card>
              )}
              <Card className="p-6 lg:p-7 lg:col-span-2">
                <RadarChart
                  data={instructorRadarData}
                  angleKey="label"
                  valueKeys={['value']}
                  seriesLabels={['Actividad']}
                  max={Math.max(...instructorRadarData.map((d) => d.value), 1)}
                  title="Resumen de impartición"
                  description="Vista tipo telaraña de tu actividad como profesor"
                />
              </Card>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-y border-neutral-100 py-3">
            {[
              { label: 'Inscripciones', value: myInscriptions.length },
              { label: 'Completados', value: myInscriptions.filter((i) => i.status === 'completed').length },
              { label: 'Avance promedio', value: `${avgProgress}%` },
              { label: 'Certificados', value: myCertificates.length },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-xl leading-none text-[var(--ink)]">{s.value}</div>
                <div className="mt-1 text-[0.6875rem] uppercase tracking-wide text-[var(--ink-muted)]">{s.label}</div>
              </div>
            ))}
          </div>

          {myInscriptions.length === 0 ? (
            <Card padding="default">
              <EmptyState icon={APP_ICONS.book} title="Aún no tienes cursos" description="Inscríbete a un curso del catálogo para ver tu progreso aquí." />
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Tareas de TODOS sus cursos — sin courseId */}
              <Card className="p-6 lg:col-span-2 lg:p-7">
                <PendingTasks title="Tus tareas pendientes" defaultExpanded />
              </Card>
              <Card className="p-6 lg:p-7">
                <PieChart data={myInscByStatus} title="Mis cursos por estado" description="Inscrito, en progreso, completado…" />
              </Card>
              {myInscByCategory.length > 1 ? (
                <Card className="p-6 lg:p-7">
                  <RadarChart
                    data={myInscByCategory}
                    angleKey="label"
                    valueKeys={['value']}
                    seriesLabels={['Cursos']}
                    max={Math.max(...myInscByCategory.map((d) => d.value), 1)}
                    title="Mis cursos por categoría"
                    description="En qué temas te enfocas"
                  />
                </Card>
              ) : (
                <Card className="p-6 lg:p-7">
                  <PieChart data={myInscByCategory} title="Mis cursos por categoría" description="En qué temas te enfocas" />
                </Card>
              )}
              <Card className="p-6 lg:p-7 lg:col-span-2">
                <RadarChart
                  data={studentRadarData}
                  angleKey="label"
                  valueKeys={['value']}
                  seriesLabels={['Actividad']}
                  max={Math.max(...studentRadarData.map((d) => d.value), 100)}
                  title="Resumen de aprendizaje"
                  description="Vista tipo telaraña de tu actividad como alumno"
                />
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}

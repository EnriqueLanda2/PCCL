/* ───────────────────────────────────────────
   Courses Page — Catálogo de cursos
   Filtros laterales · Chips de nivel/estado
   Grid de CourseHoloCard · Permiso crear curso
   ─────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import { api, getErrorMessage } from '@/lib/api';
import type { Course, CourseEarnings, Inscription } from '@/lib/types';
import { Badge } from '@/app/components/ui/Badge';
import { AppButton, AppInput, AppSelect } from '@/app/components/ui/AppControls';
import { DEFAULT_PAGE_SIZE, Pagination } from '@/app/components/ui/Pagination';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { CourseContentView } from '@/app/components/shared/CourseContentView';
import { CreateCourseModal } from '@/app/components/shared/CreateCourseModal';
import { CheckoutModal } from '@/app/components/shared/CheckoutModal';
import { CourseCard } from '@/app/components/shared/CourseCard';
import { EnrollableCourses } from '@/app/components/shared/EnrollableCourses';
import { APP_ICONS } from '@/lib/icons';

function getCachedEmail(): string | null {
  try {
    const raw = sessionStorage.getItem('pccl_user');
    if (!raw) return null;
    return (JSON.parse(raw) as { email?: string }).email ?? null;
  } catch {
    return null;
  }
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--neutral-100)', overflow: 'hidden', background: 'var(--panel)' }}>
      <div style={{ aspectRatio: '16/10', background: 'var(--neutral-100)', animation: 'pulse 1.4s ease-in-out infinite' }} />
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div style={{ height: '1.25rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: '80%' }} />
        <div style={{ height: '0.875rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: '55%' }} />
        <div style={{ height: '0.875rem', borderRadius: '0.375rem', background: 'var(--neutral-100)', width: '35%' }} />
      </div>
    </div>
  );
}

/* Controles compactos SOLO para la barra de filtros. No se toca el alto por
   defecto de AppControls (46px) porque lo comparten todos los formularios de la
   app, donde ese tamaño sí es el adecuado para escribir. */
const DENSE_CONTROL = {
  minHeight: '2.125rem',
  borderRadius: '999px',
  fontSize: '0.8125rem',
};
const DENSE_FIELD_SX = {
  '& .MuiOutlinedInput-root': DENSE_CONTROL,
  '& .MuiOutlinedInput-input': { paddingTop: '0.3rem', paddingBottom: '0.3rem' },
};
const DENSE_SELECT_SX = {
  ...DENSE_CONTROL,
  '& .MuiSelect-select': { paddingTop: '0.3rem', paddingBottom: '0.3rem' },
};
const DENSE_BUTTON_SX = {
  minHeight: '2.125rem',
  py: 0,
  px: 1.4,
  fontSize: '0.8125rem',
  whiteSpace: 'nowrap',
};

const STATUS_LABEL: Record<string, string> = { published: 'Publicado', draft: 'Borrador' };
const SORT_OPTIONS = [
  { value: 'newest',   label: 'Más recientes' },
  { value: 'title',    label: 'A → Z'         },
  { value: 'popular',  label: 'Más populares' },
];

type StudentTab = 'mine' | 'available';
type ManagerTab = 'all' | 'published' | 'draft' | 'sold';

function formatCompact(value: number) {
  return new Intl.NumberFormat('es-MX', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function formatMoney(value: number, currency = 'USD') {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(value);
}

function SectionHeader({ title, count }: Readonly<{ title: string; count: number }>) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <h2 className="text-[1rem] font-extrabold text-[var(--ink)]">{title}</h2>
      <span className="rounded-full bg-white px-2.5 py-0.5 text-[0.7188rem] font-bold text-[var(--blue-600)] shadow-[0_1px_4px_rgba(23,50,77,0.07)]">
        {count}
      </span>
      <div className="h-px flex-1 bg-[var(--neutral-100)]" />
    </div>
  );
}

function CourseTabs<T extends string>({
  tabs,
  active,
  onChange,
  tone = 'dark',
}: Readonly<{
  tabs: { id: T; label: string; count: number | string }[];
  active: T;
  onChange: (tab: T) => void;
  tone?: 'dark' | 'green';
}>) {
  return (
    <div className="flex w-fit flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-[0_2px_12px_rgba(23,50,77,0.07)]">
      {tabs.map((tab) => {
        const selected = active === tab.id;
        return (
          <AppButton
            key={tab.id}
            onClick={() => onChange(tab.id)}
            sx={{
              minHeight: '2.5rem',
              px: 1.8,
              borderRadius: '0.85rem',
              bgcolor: selected ? (tone === 'green' ? 'var(--green-600)' : 'var(--ink)') : 'transparent',
              color: selected ? '#fff' : 'var(--ink-soft)',
              boxShadow: 'none',
              '&:hover': { bgcolor: selected ? (tone === 'green' ? 'var(--green-700)' : 'var(--blue-900)') : 'var(--green-50)' },
            }}
          >
            {tab.label}
            <span
              className="ml-2 rounded-full px-1.5 py-0.5 text-[0.625rem] font-extrabold"
              style={{ background: selected ? 'rgba(255,255,255,0.18)' : 'var(--surface)', color: selected ? '#fff' : 'var(--ink-muted)' }}
            >
              {tab.count}
            </span>
          </AppButton>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, icon, color, textColor }: Readonly<{
  label: string;
  value: string | number;
  icon: string;
  color: string;
  textColor: string;
}>) {
  return (
    <div className="flex items-center gap-4 rounded-[1.125rem] bg-white p-5 shadow-[0_2px_12px_rgba(23,50,77,0.07)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-[1.25rem]" style={{ background: color }}>
        <Icon icon={icon} width={22} height={22} style={{ color: textColor }} />
      </div>
      <div>
        <p className="text-[0.7188rem] font-semibold text-[var(--ink-muted)]">{label}</p>
        <p className="text-[1.25rem] font-extrabold" style={{ color: textColor }}>{value}</p>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [courses,      setCourses]      = useState<Course[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [permissions,  setPermissions]  = useState<string[]>([]);
  const [roles,        setRoles]        = useState<string[]>([]);
  const [earnings,     setEarnings]     = useState<CourseEarnings[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  /* Arranca en null en ambos lados — sessionStorage no existe en el servidor */
  const [myEmail] = useState<string | null>(() => (typeof window === 'undefined' ? null : getCachedEmail()));

  /* Sección "Cursos disponibles para ti" (solo alumnos) */
  const [enrollableCount, setEnrollableCount] = useState<number | null>(null);
  const [catalogKey,      setCatalogKey]      = useState(0);
  const handleEnrollableCount = useCallback((n: number) => setEnrollableCount(n), []);

  /* ── Filters state ── */
  const [levelFilters,    setLevelFilters]     = useState<string[]>([]);
  const [statusFilters,   setStatusFilters]    = useState<string[]>([]);
  const [onlyMine,        setOnlyMine]         = useState(false);
  const [sortBy,          setSortBy]           = useState('newest');
  const [search,          setSearch]           = useState('');
  /* Plegado por defecto: la barra debe ser discreta salvo que se pidan filtros. */
  const [filtersOpen,     setFiltersOpen]      = useState(false);
  const [page,            setPage]             = useState(1);
  const [studentTab,      setStudentTab]      = useState<StudentTab>('mine');
  const [managerTab,      setManagerTab]      = useState<ManagerTab>('all');

  useEffect(() => {
    let alive = true;
    Promise.all([api.courses(), api.access(), api.inscriptions().catch(() => [])])
      .then(([courseList, access, inscriptionList]) => {
        if (!alive) return;
        setCourses(courseList);
        setPermissions(access.permissions);
        setRoles(access.roles);
        setInscriptions(inscriptionList);
        if (access.roles.includes('admin') || access.roles.includes('instructor')) {
          api.courseEarnings().then((items) => { if (alive) setEarnings(items); }).catch(() => {});
        }
      })
      .catch(() => { if (alive) { setCourses([]); setPermissions([]); setRoles([]); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const canCreate = useMemo(() => permissions.includes('courses:create'), [permissions]);

  /* El backend ya acota la lista: admin ve todo, instructor sus cursos creados
     y el alumno solo aquellos en los que está inscrito. El encabezado cambia
     para no prometer un catálogo completo que no se está mostrando. */
  const isAdmin      = roles.includes('admin');
  const isInstructor = roles.includes('instructor');
  const heading = isAdmin
    ? { lead: 'Catálogo de',  em: 'cursos',  helper: (n: number) => `${n} curso${n !== 1 ? 's' : ''} en la plataforma` }
    : isInstructor
      ? { lead: 'Mis',        em: 'cursos',  helper: (n: number) => `${n} curso${n !== 1 ? 's' : ''} que impartes` }
      : { lead: 'Mis',        em: 'cursos',  helper: (n: number) => `${n} curso${n !== 1 ? 's' : ''} en los que estás inscrito` };
  const enrolledCourseIds = useMemo(
    () => new Set(inscriptions.map((i) => i.course?.id).filter((id): id is string => Boolean(id))),
    [inscriptions],
  );
  const progressByCourseId = useMemo(() => {
    const map = new Map<string, number>();
    for (const i of inscriptions) {
      if (i.course?.id) map.set(i.course.id, i.progressPercentage ?? 0);
    }
    return map;
  }, [inscriptions]);
  const myCoursesCount = useMemo(
    () => (myEmail ? courses.filter((c) => c.createdBy === myEmail).length : 0),
    [courses, myEmail],
  );
  const publishedCount = useMemo(() => courses.filter((course) => course.status === 'published').length, [courses]);
  const draftCount = useMemo(() => courses.filter((course) => course.status === 'draft').length, [courses]);
  const soldCourseIds = useMemo(
    () => new Set(earnings.filter((item) => item.salesCount > 0).map((item) => item.courseId)),
    [earnings],
  );
  const soldCount = soldCourseIds.size;
  const totalStudents = useMemo(
    () => courses.reduce((sum, course) => sum + (course.studentsCount ?? 0), 0),
    [courses],
  );
  const totalRevenue = useMemo(
    () => earnings.reduce((sum, item) => sum + item.grossRevenue, 0),
    [earnings],
  );
  const revenueCurrency = earnings[0]?.currency ?? 'USD';

  const levelOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const course of courses) {
      if (course.level) counts.set(course.level, (counts.get(course.level) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([value, count]) => ({ value, label: value, count }));
  }, [courses]);

  const statusOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const course of courses) {
      if (course.status) counts.set(course.status, (counts.get(course.status) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([value, count]) => ({ value, label: STATUS_LABEL[value] ?? value, count }));
  }, [courses]);

  /* ── Filtered + sorted list ── */
  const filtered = useMemo(() => {
    let list = [...courses];

    if (isAdmin || isInstructor) {
      if (managerTab === 'published') list = list.filter((c) => c.status === 'published');
      if (managerTab === 'draft') list = list.filter((c) => c.status === 'draft');
      if (managerTab === 'sold') list = list.filter((c) => soldCourseIds.has(c.id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        (c.instructorName ?? '').toLowerCase().includes(q)
      );
    }

    if (levelFilters.length > 0) {
      list = list.filter((c) => levelFilters.includes(c.level));
    }

    if (statusFilters.length > 0) {
      list = list.filter((c) => statusFilters.includes(c.status ?? ''));
    }

    if (onlyMine && myEmail) {
      list = list.filter((c) => c.createdBy === myEmail);
    }

    if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.studentsCount ?? 0) - (a.studentsCount ?? 0));
    }

    return list;
  }, [courses, search, levelFilters, statusFilters, onlyMine, myEmail, sortBy, isAdmin, isInstructor, managerTab, soldCourseIds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / DEFAULT_PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paginatedCourses = filtered.slice((pageSafe - 1) * DEFAULT_PAGE_SIZE, pageSafe * DEFAULT_PAGE_SIZE);

  const clearAll = () => {
    setOnlyMine(false);
    setLevelFilters([]);
    setStatusFilters([]);
    setSearch('');
    setSortBy('newest');
    setPage(1);
  };

  const hasActiveFilters = levelFilters.length > 0 || statusFilters.length > 0 || onlyMine || Boolean(search.trim());
  /* Cuenta solo lo que vive dentro del panel plegable: el buscador se ve siempre,
     así que incluirlo haría que el contador señalara algo ya visible. */
  const activeFilterCount = levelFilters.length + statusFilters.length + (sortBy === 'newest' ? 0 : 1);

  /** Alumnos compran cursos con costo antes de ver contenido; admin/profesor pueden administrarlos. */
  const handleSelectCourse = (course: Course) => {
    const requiresPayment = !course.isFree && (course.price ?? 0) > 0;
    const canManageCourse = isAdmin || (isInstructor && course.createdBy === myEmail);
    if (requiresPayment && !enrolledCourseIds.has(course.id) && !canManageCourse) {
      setCheckoutCourse(course);
    } else {
      setSelectedCourse(course);
    }
  };

  const handlePaid = () => {
    if (!checkoutCourse) return;
    const course = checkoutCourse;
    setInscriptions((prev) => [
      ...prev,
      { id: `local-${course.id}`, status: 'enrolled', progressPercentage: 0, completedAt: null, course },
    ]);
    setCheckoutCourse(null);
    setSelectedCourse(course);
  };

  const canPublishCourse = (course: Course) =>
    course.status === 'draft' && (isAdmin || (isInstructor && course.createdBy === myEmail));

  const handlePublishCourse = async (course: Course) => {
    setPublishingId(course.id);
    setPublishError(null);
    try {
      const published = await api.publishCourse(course.id);
      setCourses((prev) => prev.map((item) => (item.id === course.id ? published : item)));
      setCatalogKey((key) => key + 1);
    } catch (error) {
      setPublishError(getErrorMessage(error));
    } finally {
      setPublishingId(null);
    }
  };

  const studentTabs = [
    { id: 'mine' as const, label: 'Mis cursos', count: courses.length },
    { id: 'available' as const, label: 'Catálogo', count: enrollableCount ?? '—' },
  ];
  const managerTabs = [
    { id: 'all' as const, label: 'Todos', count: courses.length },
    { id: 'published' as const, label: 'Publicados', count: publishedCount },
    { id: 'draft' as const, label: 'Borradores', count: draftCount },
    { id: 'sold' as const, label: 'Vendidos', count: soldCount },
  ];
  const managerStats = [
    { label: 'Total cursos', value: courses.length, icon: APP_ICONS.book, color: '#EBF2FF', textColor: '#2454A9' },
    { label: 'Publicados', value: publishedCount, icon: APP_ICONS.checkFilled, color: '#E8F7EE', textColor: '#1E7A44' },
    { label: 'Estudiantes', value: formatCompact(totalStudents), icon: APP_ICONS.users, color: '#FEF3C7', textColor: '#92400E' },
    { label: 'Ganancias', value: formatMoney(totalRevenue, revenueCurrency), icon: APP_ICONS.chart, color: '#F3E8FF', textColor: '#6B21A8' },
  ];
  const currentSectionTitle = isAdmin || isInstructor
    ? managerTabs.find((tab) => tab.id === managerTab)?.label ?? 'Cursos'
    : 'Cursos inscritos';

  /* ── Segmento de detalle: reemplaza el catálogo sin navegar de página ── */
  if (selectedCourse) {
    return <CourseContentView course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Page header ── */}
      <PageHeader
        title={<>{heading.lead} {heading.em}</>}
        subtitle={loading ? 'Cargando…' : heading.helper(courses.length)}
        action={canCreate ? (
          <AppButton
            variant="contained"
            onClick={() => setModalOpen(true)}
            sx={{ px: 2.4, py: 1, boxShadow: '0 12px 24px rgba(30,139,72,0.18)' }}
          >
            + Nuevo curso
          </AppButton>
        ) : undefined}
      />

      {(isAdmin || isInstructor) && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {managerStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        {isAdmin || isInstructor ? (
          <CourseTabs
            tabs={managerTabs}
            active={managerTab}
            onChange={(tab) => { setManagerTab(tab); setPage(1); }}
            tone="green"
          />
        ) : (
          <CourseTabs
            tabs={studentTabs}
            active={studentTab}
            onChange={(tab) => { setStudentTab(tab); setPage(1); }}
          />
        )}
      </div>

      {/* ── "Mis cursos" toggle — solo para admin: es el único que ve cursos
             ajenos, así que es el único para quien el filtro significa algo. ── */}
      {isAdmin && myEmail && myCoursesCount > 0 && (
        <AppButton
          onClick={() => { setOnlyMine((v) => !v); setPage(1); }}
          variant={onlyMine ? 'contained' : 'outlined'}
          startIcon={<Icon icon={APP_ICONS.user} width={14} height={14} />}
          sx={{
            alignSelf: 'flex-start',
            border: onlyMine ? '1.5px solid var(--green-500)' : '1.5px solid var(--neutral-200)',
            bgcolor: onlyMine ? 'var(--green-50)' : 'var(--panel)',
            color: onlyMine ? 'var(--green-700)' : 'var(--ink-muted)',
            borderRadius: '999px',
            px: 2,
            py: 0.8,
            fontSize: 13,
            fontWeight: onlyMine ? 700 : 600,
            fontFamily: 'var(--font-sans)',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { bgcolor: onlyMine ? 'var(--green-50)' : 'var(--neutral-50)', borderColor: onlyMine ? 'var(--green-500)' : 'var(--neutral-200)' },
          }}
        >
          Mis cursos
          <span style={{ background: onlyMine ? 'var(--green-600)' : 'var(--neutral-200)', color: onlyMine ? '#fff' : 'var(--ink-muted)', borderRadius: '999px', padding: '1px 7px', fontSize: '0.7188rem' }}>
            {myCoursesCount}
          </span>
        </AppButton>
      )}

      {/* ── Barra de filtros — compacta y plegable ──
             Solo el buscador queda siempre a la vista; orden, nivel y estado se
             despliegan bajo demanda para que la barra no domine la página. */}
      <div style={{ borderRadius: '1rem', border: '1px solid var(--neutral-100)', background: 'rgba(255,255,255,0.86)', boxShadow: '0 6px 18px rgba(23,50,77,0.05)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: filtersOpen ? '0.5rem' : 0 }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
          {/* Buscador */}
          <div style={{ flex: '1 1 12rem', minWidth: '9rem' }}>
            <AppInput
              type="search"
              placeholder="Buscar cursos o instructor…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              withSearchIcon
              sx={DENSE_FIELD_SX}
            />
          </div>

          {/* Alternar filtros. El contador es lo que evita que plegarlos oculte
              que hay filtros aplicados y el usuario no entienda el resultado. */}
          <AppButton
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            sx={{ ...DENSE_BUTTON_SX, gap: '0.4rem' }}
          >
            <Icon icon={APP_ICONS.filter} width={14} height={14} />
            Filtros
            {activeFilterCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: '1.15rem', height: '1.15rem', padding: '0 0.3rem',
                borderRadius: '999px', background: 'var(--green-600)', color: '#fff',
                fontSize: '0.6875rem', fontWeight: 700, lineHeight: 1,
              }}>
                {activeFilterCount}
              </span>
            )}
            <Icon icon={filtersOpen ? APP_ICONS.chevronUp : APP_ICONS.chevronDown} width={14} height={14} />
          </AppButton>

          {hasActiveFilters && (
            <AppButton onClick={clearAll} sx={DENSE_BUTTON_SX}>Limpiar</AppButton>
          )}
        </div>

        {filtersOpen && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '0.5rem' }}>
            <AppSelect
              value={sortBy}
              onChange={(e: SelectChangeEvent) => { setSortBy(e.target.value); setPage(1); }}
              sx={DENSE_SELECT_SX}
            >
              {SORT_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </AppSelect>

            <AppSelect
              multiple
              value={levelFilters}
              onChange={(e) => { setLevelFilters(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value); setPage(1); }}
              displayEmpty
              renderValue={(selected) => selected.length ? selected.join(', ') : 'Todos los niveles'}
              sx={DENSE_SELECT_SX}
            >
              {levelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </MenuItem>
              ))}
            </AppSelect>

            <AppSelect
              multiple
              value={statusFilters}
              onChange={(e) => { setStatusFilters(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value); setPage(1); }}
              displayEmpty
              renderValue={(selected) => selected.length ? selected.map((value) => STATUS_LABEL[value] ?? value).join(', ') : 'Todos los estados'}
              sx={DENSE_SELECT_SX}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </MenuItem>
              ))}
            </AppSelect>
          </div>
        )}
      </div>

      {/* ── Course grid ── */}
      {(isAdmin || isInstructor || studentTab === 'mine') && (
      <div>
          {publishError && (
            <p className="mb-4 rounded-2xl border-l-4 border-[var(--red-500)] bg-[#FFF1ED] px-4 py-3 text-[0.8125rem] text-[var(--red-600)]">
              {publishError}
            </p>
          )}

          {!loading && <SectionHeader title={currentSectionTitle} count={filtered.length} />}

          {/* Results summary */}
          {!loading && (
            <div style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', marginBottom: '1rem' }}>
              Mostrando <strong style={{ color: 'var(--ink)' }}>{paginatedCourses.length}</strong> de {filtered.length} cursos
              {hasActiveFilters && (
                <span> · <span style={{ color: 'var(--blue-600)', fontWeight: 500 }}>filtros activos</span></span>
              )}
            </div>
          )}

          {loading ? (
            /* Skeleton grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={APP_ICONS.search}
              title="Sin resultados"
              description={
                hasActiveFilters
                  ? 'Ningún curso coincide con los filtros actuales. Intenta ajustarlos.'
                  : isAdmin
                    ? 'Aún no hay cursos registrados en el sistema.'
                    : isInstructor
                      ? 'Todavía no has creado ningún curso.'
                      : 'Aún no estás inscrito en ningún curso. Explora el catálogo público para encontrar uno.'
              }
              action={
                hasActiveFilters
                  ? { label: 'Limpiar filtros', onClick: clearAll }
                  : canCreate
                  ? { label: '+ Crear primer curso', onClick: () => setModalOpen(true) }
                  : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
              {paginatedCourses.map((course, i) => {
                const enrolled = enrolledCourseIds.has(course.id);
                const canManageThisCourse = isAdmin || (isInstructor && course.createdBy === myEmail);
                const requiresPayment = !course.isFree && (course.price ?? 0) > 0;
                const actionLabel = enrolled || canManageThisCourse
                  ? 'Continuar'
                  : requiresPayment
                    ? 'Comprar'
                    : 'Inscribirme';
                return (
                  <div
                    key={course.id}
                    className="dashboard-card-in"
                    style={{ display: 'flex', flexDirection: 'column', animationDelay: `${Math.min(i, 9) * 45}ms` }}
                  >
                    <CourseCard
                      course={course}
                      progress={progressByCourseId.get(course.id) ?? 0}
                      actionLabel={actionLabel}
                      onAction={handleSelectCourse}
                      onDetails={handleSelectCourse}
                    />
                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '0.375rem' }}>
                      <span>
                        {course.isFree || !course.price ? (
                          <Badge variant="green">Gratis</Badge>
                        ) : (
                          <Badge variant="dark">
                            {new Intl.NumberFormat('es', { style: 'currency', currency: course.currency ?? 'USD' }).format(course.price)}
                          </Badge>
                        )}
                      </span>
                      <span style={{ display: 'flex', gap: '0.375rem' }}>
                        {course.status === 'draft' && <Badge variant="yellow">Borrador</Badge>}
                      </span>
                    </div>
                    {canPublishCourse(course) && (
                      <AppButton
                        variant="outlined"
                        loading={publishingId === course.id}
                        disabled={publishingId === course.id}
                        onClick={() => void handlePublishCourse(course)}
                        sx={{ mt: 1, width: '100%', justifyContent: 'center' }}
                      >
                        Publicar curso
                      </AppButton>
                    )}
                  </div>
                );
              })}
            </div>
          )}
      </div>
      )}

      {/* ── Cursos por descubrir ──
             La lista de arriba está acotada a los cursos propios; esta sección
             es el único punto del portal donde el alumno ve cursos ajenos y
             puede inscribirse sin salir de "Mis cursos". */}
      {!isAdmin && !isInstructor && studentTab === 'available' && (
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionHeader title="Cursos disponibles" count={enrollableCount ?? 0} />
              <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {enrollableCount === null
                  ? 'Buscando cursos…'
                  : enrollableCount === 0
                    ? 'Ya estás inscrito en todos los cursos publicados.'
                    : `${enrollableCount} curso${enrollableCount !== 1 ? 's' : ''} en los que aún no estás inscrito`}
              </p>
            </div>
          </div>

          <EnrollableCourses
            key={catalogKey}
            layout="grid"
            search={search}
            levels={levelFilters}
            onCountChange={handleEnrollableCount}
            onEnrolled={() => {
              setCatalogKey((k) => k + 1);
              /* La inscripción cambia "Mis cursos": se recarga la lista propia. */
              api.courses().then(setCourses).catch(() => {});
              api.inscriptions().then(setInscriptions).catch(() => {});
            }}
          />
        </section>
      )}

      {!loading && filtered.length > 0 && (isAdmin || isInstructor || studentTab === 'mine') && (
        <Pagination page={pageSafe} totalItems={filtered.length} onChange={setPage} label="cursos" />
      )}

      <CreateCourseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(course) => setCourses((prev) => [course, ...prev])}
      />

      {checkoutCourse && (
        <CheckoutModal
          open={Boolean(checkoutCourse)}
          course={checkoutCourse}
          onClose={() => setCheckoutCourse(null)}
          onPaid={handlePaid}
        />
      )}
    </div>
  );
}

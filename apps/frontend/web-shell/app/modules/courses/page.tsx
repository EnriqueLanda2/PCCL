/* ───────────────────────────────────────────
   Courses Page — Catálogo de cursos
   Filtros laterales · Chips de nivel/estado
   Grid de CourseHoloCard · Permiso crear curso
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { api } from '@/lib/api';
import type { Course, Inscription } from '@/lib/types';
import { Card } from '@/app/components/ui/Card';
import { Badge } from '@/app/components/ui/Badge';
import { Button } from '@/app/components/ui/Button';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { CourseContentView } from '@/app/components/shared/CourseContentView';
import { CreateCourseModal } from '@/app/components/shared/CreateCourseModal';
import { CourseHoloCard, type CardCarouselItem } from '@/app/components/shared/CardCarousel';
import { APP_ICONS, COURSE_COVER_ICONS } from '@/lib/icons';

const COVER_CLASSES = ['cover-1', 'cover-2', 'cover-3', 'cover-4', 'cover-5', 'cover-6'];

function courseIcon(iconName: string) {
  return <Icon icon={iconName} width={40} height={40} style={{ color: 'rgba(255,255,255,0.9)' }} />;
}

function getCachedEmail(): string | null {
  try {
    const raw = sessionStorage.getItem('pccl_user');
    if (!raw) return null;
    return (JSON.parse(raw) as { email?: string }).email ?? null;
  } catch {
    return null;
  }
}

/* ── Chip helper ── */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: active ? '1.5px solid var(--blue-600)' : '1.5px solid var(--neutral-200)',
        background: active ? 'var(--blue-50)' : 'var(--panel)',
        color: active ? 'var(--blue-700)' : 'var(--ink-muted)',
        borderRadius: 'var(--radius-full)',
        padding: '6px 16px',
        fontSize: '13px',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 140ms',
        fontFamily: 'var(--font-sans)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/* ── Filter checkbox row ── */
function FilterItem({ label, count, checked, onChange }: {
  label: string; count?: number; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', cursor: 'pointer', padding: '6px 0' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--ink)' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ accentColor: 'var(--blue-600)', width: '15px', height: '15px' }}
        />
        {label}
      </span>
      {count !== undefined && (
        <span style={{ fontSize: '11.5px', color: 'var(--ink-muted)', background: 'var(--neutral-100)', borderRadius: '999px', padding: '1px 7px', minWidth: '24px', textAlign: 'center' }}>
          {count}
        </span>
      )}
    </label>
  );
}

/* ── Section label ── */
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, color: 'var(--blue-600)', marginBottom: '8px' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--neutral-100)', overflow: 'hidden', background: 'var(--panel)' }}>
      <div style={{ aspectRatio: '16/10', background: 'var(--neutral-100)', animation: 'pulse 1.4s ease-in-out infinite' }} />
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ height: '20px', borderRadius: '6px', background: 'var(--neutral-100)', width: '80%' }} />
        <div style={{ height: '14px', borderRadius: '6px', background: 'var(--neutral-100)', width: '55%' }} />
        <div style={{ height: '14px', borderRadius: '6px', background: 'var(--neutral-100)', width: '35%' }} />
      </div>
    </div>
  );
}

const LEVELS   = ['Básico', 'Intermedio', 'Avanzado'];
const STATUSES = ['published', 'draft'];
const STATUS_LABEL: Record<string, string> = { published: 'Publicado', draft: 'Borrador' };
const LEVEL_CHIPS  = ['Todos', 'Básico', 'Intermedio', 'Avanzado'];
const SORT_OPTIONS = [
  { value: 'newest',   label: 'Más recientes' },
  { value: 'title',    label: 'A → Z'         },
  { value: 'popular',  label: 'Más populares' },
];

export default function CoursesPage() {
  const [courses,      setCourses]      = useState<Course[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [permissions,  setPermissions]  = useState<string[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  /* Arranca en null en ambos lados — sessionStorage no existe en el servidor */
  const [myEmail,      setMyEmail]      = useState<string | null>(null);
  useEffect(() => { setMyEmail(getCachedEmail()); }, []);

  /* ── Filters state ── */
  const [levelChip,       setLevelChip]       = useState('Todos');
  const [levelFilters,    setLevelFilters]     = useState<string[]>([]);
  const [statusFilters,   setStatusFilters]    = useState<string[]>([]);
  const [onlyMine,        setOnlyMine]         = useState(false);
  const [sortBy,          setSortBy]           = useState('newest');
  const [search,          setSearch]           = useState('');

  useEffect(() => {
    let alive = true;
    Promise.all([api.courses(), api.access(), api.inscriptions().catch(() => [])])
      .then(([courseList, access, inscriptionList]) => {
        if (!alive) return;
        setCourses(courseList);
        setPermissions(access.permissions);
        setInscriptions(inscriptionList);
      })
      .catch(() => { if (alive) { setCourses([]); setPermissions([]); } })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const canCreate = useMemo(() => permissions.includes('courses:create'), [permissions]);
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

  /* ── Derived counts for filter sidebar ── */
  const levelCounts  = useMemo(() =>
    LEVELS.reduce<Record<string, number>>((acc, l) => {
      acc[l] = courses.filter((c) => c.level === l).length;
      return acc;
    }, {}),
  [courses]);

  const statusCounts = useMemo(() =>
    STATUSES.reduce<Record<string, number>>((acc, s) => {
      acc[s] = courses.filter((c) => c.status === s).length;
      return acc;
    }, {}),
  [courses]);

  /* ── Filtered + sorted list ── */
  const filtered = useMemo(() => {
    let list = [...courses];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        (c.instructorName ?? '').toLowerCase().includes(q)
      );
    }

    if (levelChip !== 'Todos') {
      list = list.filter((c) => c.level === levelChip);
    } else if (levelFilters.length > 0) {
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
  }, [courses, search, levelChip, levelFilters, statusFilters, onlyMine, myEmail, sortBy]);

  const toggleLevel  = (l: string, on: boolean) =>
    setLevelFilters((prev) => on ? [...prev, l] : prev.filter((x) => x !== l));
  const toggleStatus = (s: string, on: boolean) =>
    setStatusFilters((prev) => on ? [...prev, s] : prev.filter((x) => x !== s));

  const clearAll = () => {
    setOnlyMine(false);
    setLevelChip('Todos');
    setLevelFilters([]);
    setStatusFilters([]);
    setSearch('');
    setSortBy('newest');
  };

  const hasActiveFilters = levelChip !== 'Todos' || levelFilters.length > 0 || statusFilters.length > 0 || onlyMine || Boolean(search.trim());

  /* ── Segmento de detalle: reemplaza el catálogo sin navegar de página ── */
  if (selectedCourse) {
    return <CourseContentView course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.15, marginBottom: '6px' }}>
            Catálogo de <em style={{ color: 'var(--blue-600)', fontStyle: 'italic' }}>cursos</em>
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
            {loading ? 'Cargando…' : `${courses.length} curso${courses.length !== 1 ? 's' : ''} disponibles`}
          </p>
        </div>
        {canCreate && (
          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            + Nuevo curso
          </Button>
        )}
      </div>

      {/* ── "Mis cursos" toggle (instructor) ── */}
      {myEmail && myCoursesCount > 0 && (
        <button
          type="button"
          onClick={() => setOnlyMine((v) => !v)}
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: onlyMine ? '1.5px solid var(--green-500)' : '1.5px solid var(--neutral-200)',
            background: onlyMine ? 'var(--green-50)' : 'var(--panel)',
            color: onlyMine ? 'var(--green-700)' : 'var(--ink-muted)',
            borderRadius: 'var(--radius-full)', padding: '7px 16px',
            fontSize: '13px', fontWeight: onlyMine ? 600 : 500,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}
        >
          <Icon icon={APP_ICONS.user} width={14} height={14} /> Mis cursos
          <span style={{ background: onlyMine ? 'var(--green-600)' : 'var(--neutral-200)', color: onlyMine ? '#fff' : 'var(--ink-muted)', borderRadius: '999px', padding: '1px 7px', fontSize: '11.5px' }}>
            {myCoursesCount}
          </span>
        </button>
      )}

      {/* ── Search + sort bar ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '400px' }}>
          <Icon icon={APP_ICONS.search} width={16} height={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)', pointerEvents: 'none' }} />
          <input
            type="search"
            placeholder="Buscar cursos o instructor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              paddingLeft: '42px',
              paddingRight: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--neutral-200)',
              background: 'var(--blue-50)',
              fontSize: '14px',
              color: 'var(--ink)',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              transition: 'border-color 160ms, box-shadow 160ms',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--blue-400)';
              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(61,108,229,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--neutral-200)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Level chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {LEVEL_CHIPS.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              active={levelChip === chip}
              onClick={() => { setLevelChip(chip); setLevelFilters([]); }}
            />
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            height: '40px',
            padding: '0 12px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--neutral-200)',
            background: 'var(--panel)',
            color: 'var(--ink)',
            fontSize: '13.5px',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            style={{ fontSize: '13px', color: 'var(--blue-600)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '4px 6px', borderRadius: '6px', fontWeight: 500 }}
          >
            <Icon icon={APP_ICONS.close} width={13} height={13} style={{ verticalAlign: '-2px' }} /> Limpiar filtros
          </button>
        )}
      </div>

      {/* ── Main: sidebar + grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* ── Filters sidebar ── */}
        <Card padding="default" style={{ position: 'sticky', top: '80px' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', marginBottom: '20px', color: 'var(--ink)' }}>
            Filtros
          </div>

          <FilterSection title="Nivel">
            {LEVELS.map((l) => (
              <FilterItem
                key={l}
                label={l}
                count={levelCounts[l] ?? 0}
                checked={levelFilters.includes(l)}
                onChange={(on) => { setLevelChip('Todos'); toggleLevel(l, on); }}
              />
            ))}
          </FilterSection>

          <FilterSection title="Estado">
            {STATUSES.map((s) => (
              <FilterItem
                key={s}
                label={STATUS_LABEL[s]}
                count={statusCounts[s] ?? 0}
                checked={statusFilters.includes(s)}
                onChange={(on) => toggleStatus(s, on)}
              />
            ))}
          </FilterSection>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              style={{
                width: '100%',
                padding: '10px 0',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--neutral-200)',
                background: 'transparent',
                color: 'var(--ink-muted)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                marginTop: '4px',
              }}
            >
              Limpiar todo
            </button>
          )}
        </Card>

        {/* ── Course grid ── */}
        <div>
          {/* Results summary */}
          {!loading && (
            <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '16px' }}>
              Mostrando <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> de {courses.length} cursos
              {hasActiveFilters && (
                <span> · <span style={{ color: 'var(--blue-600)', fontWeight: 500 }}>filtros activos</span></span>
              )}
            </div>
          )}

          {loading ? (
            /* Skeleton grid */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={APP_ICONS.search}
              title="Sin resultados"
              description={
                hasActiveFilters
                  ? 'Ningún curso coincide con los filtros actuales. Intenta ajustarlos.'
                  : 'Aún no hay cursos registrados en el sistema.'
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {filtered.map((course, i) => {
                const enrolled = enrolledCourseIds.has(course.id);
                const item: CardCarouselItem = {
                  id: course.id,
                  title: course.title,
                  description: course.description || 'Explora este curso y comienza cuando quieras.',
                  eyebrow: course.category ?? course.level,
                  coverClass: COVER_CLASSES[i % COVER_CLASSES.length],
                  coverImageUrl: course.coverImageUrl ?? undefined,
                  icon: courseIcon(COURSE_COVER_ICONS[i % COURSE_COVER_ICONS.length]),
                  progress: progressByCourseId.get(course.id),
                  onSelect: () => setSelectedCourse(course),
                  linkLabel: enrolled ? 'Continuar' : 'Ver curso',
                };
                return (
                  <div key={course.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <CourseHoloCard item={item} fluid />
                    {/* Status pills below card */}
                    {(course.status === 'draft' || enrolled) && (
                      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        {enrolled && <Badge variant="blue"><Icon icon={APP_ICONS.check} width={12} height={12} style={{ verticalAlign: '-1px' }} /> Ya inscrito</Badge>}
                        {course.status === 'draft' && <Badge variant="yellow">Borrador</Badge>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Pagination stub ── */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', paddingTop: '8px' }}>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              type="button"
              style={{
                width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                border: p === 1 ? '1.5px solid var(--blue-600)' : '1.5px solid var(--neutral-200)',
                background: p === 1 ? 'var(--blue-600)' : 'var(--panel)',
                color: p === 1 ? 'var(--panel)' : 'var(--ink-muted)',
                fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              }}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            style={{
              height: '36px', padding: '0 14px', borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--neutral-200)',
              background: 'var(--panel)', color: 'var(--ink-muted)',
              fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            →
          </button>
        </div>
      )}

      <CreateCourseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(course) => setCourses((prev) => [course, ...prev])}
      />
    </div>
  );
}

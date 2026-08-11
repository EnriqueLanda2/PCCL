/* ───────────────────────────────────────────
   EnrollableCourses — cursos publicados en los que
   el usuario aún NO está inscrito, con acción de
   inscripción. Lo usan la sección de "Mis cursos"
   (variante carrusel) y /learning/catalog (grid).

   Los gratuitos se inscriben directo; los cursos con costo
   se compran en CheckoutModal antes de crear la inscripción.
   ─────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Course, Inscription, PublicCourse } from '@/lib/types';
import { enrollableCourses, priceLabel, requiresPayment, toCourse } from '@/lib/enrollableCourses';
import { Badge } from '@/app/components/ui/Badge';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { CheckoutModal } from '@/app/components/shared/CheckoutModal';
import { CourseCard } from '@/app/components/shared/CourseCard';
import { CoursePreviewModal } from '@/app/components/shared/CoursePreviewModal';
import { DEFAULT_PAGE_SIZE, Pagination } from '@/app/components/ui/Pagination';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';
import { APP_ICONS } from '@/lib/icons';

interface EnrollableCoursesProps {
  /** `carousel` para la sección embebida, `grid` para la página de catálogo */
  layout?: 'carousel' | 'grid';
  /** Tope de tarjetas — útil en la sección embebida */
  limit?: number;
  /** Texto de búsqueda ya aplicado por el contenedor (solo `grid`) */
  search?: string;
  /** Nivel a filtrar, o 'Todos' */
  level?: string;
  /** Niveles múltiples cuando el contenedor usa filtros colapsables */
  levels?: string[];
  /** Se dispara tras inscribirse, para que el contenedor recargue sus listas */
  onEnrolled?: () => void;
  /** Notifica cuántos cursos quedan disponibles, para encabezados y contadores */
  onCountChange?: (n: number) => void;
}

export function EnrollableCourses({
  layout = 'grid',
  limit,
  search = '',
  level = 'Todos',
  levels = [],
  onEnrolled,
  onCountChange,
}: Readonly<EnrollableCoursesProps>) {
  const [published,    setPublished]    = useState<PublicCourse[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [userId,       setUserId]       = useState<string | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [failed,       setFailed]       = useState(false);
  const [enrolling,    setEnrolling]    = useState<string | null>(null);
  const [error,        setError]        = useState<string | null>(null);
  const [checkout,     setCheckout]     = useState<Course | null>(null);
  const [preview,      setPreview]      = useState<PublicCourse | null>(null);
  const [page,         setPage]         = useState(1);

  const load = useCallback(async () => {
    const [pub, insc, me] = await Promise.allSettled([
      api.publicCourses(),
      api.inscriptions(),
      api.me(),
    ]);
    if (pub.status === 'fulfilled') setPublished(pub.value);
    else setFailed(true);
    if (insc.status === 'fulfilled') setInscriptions(insc.value);
    if (me.status === 'fulfilled') setUserId(me.value.id);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const available = useMemo(() => {
    let list = enrollableCourses(published, inscriptions);
    if (levels.length > 0) list = list.filter((c) => levels.includes(c.level));
    else if (level !== 'Todos') list = list.filter((c) => c.level === level);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    return limit ? list.slice(0, limit) : list;
  }, [published, inscriptions, level, levels, search, limit]);

  const totalPages = Math.max(1, Math.ceil(available.length / DEFAULT_PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paginatedAvailable = layout === 'grid'
    ? available.slice((pageSafe - 1) * DEFAULT_PAGE_SIZE, pageSafe * DEFAULT_PAGE_SIZE)
    : available;

  useEffect(() => { onCountChange?.(available.length); }, [available.length, onCountChange]);

  const enrollFree = async (course: PublicCourse) => {
    if (!userId) { setError('No se pudo identificar tu sesión. Vuelve a iniciar sesión.'); return; }
    setError(null);
    setEnrolling(course.id);
    try {
      await api.createInscription(userId, course.id);
      await load();
      onEnrolled?.();
    } catch {
      setError(`No se pudo completar la inscripción a "${course.title}". Intenta de nuevo.`);
    } finally {
      setEnrolling(null);
    }
  };

  const handleSelect = (course: PublicCourse) => {
    if (requiresPayment(course)) setCheckout(toCourse(course));
    else void enrollFree(course);
  };

  /* Desde la vista previa: el checkout sustituye al modal, pero la inscripción
     gratuita lo mantiene abierto para que el botón muestre "Inscribiendo…" y
     solo se cierra al terminar. Si falla, enrollFree deja el aviso de error
     visible en la lista. */
  const handlePreviewEnroll = async (course: PublicCourse) => {
    if (requiresPayment(course)) {
      setPreview(null);
      setCheckout(toCourse(course));
      return;
    }
    await enrollFree(course);
    setPreview(null);
  };

  const handlePaid = async () => {
    setCheckout(null);
    /* El pago dispara payment.completed y learning-service crea la inscripción;
       se recarga para reflejarla en cuanto el evento se procesa. */
    await load();
    onEnrolled?.();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <WaveSpinner size="md" label="Buscando cursos disponibles…" />
      </div>
    );
  }

  if (available.length === 0) {
    return (
      <EmptyState
        icon={APP_ICONS.search}
        title={failed ? 'No se pudo cargar el catálogo' : 'Estás al día'}
        description={
          failed
            ? 'El servicio de cursos no respondió. Intenta de nuevo en unos momentos.'
            : search || level !== 'Todos'
              ? 'Ningún curso disponible coincide con tu búsqueda.'
              : 'Ya estás inscrito en todos los cursos publicados.'
        }
      />
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-xl border-l-4 border-[var(--red-500)] bg-[#FFF1ED] px-4 py-3 text-[0.8125rem] text-[var(--red-600)]">
          {error}
        </div>
      )}

      {layout === 'carousel' ? (
        <div className="flex gap-5 overflow-x-auto pb-2">
          {available.map((course) => (
            <div key={course.id} className="min-w-[17.5rem] max-w-[17.5rem]">
              <CourseCard
                course={toCourse(course)}
                progress={0}
                actionLabel={enrolling === course.id ? 'Inscribiendo…' : requiresPayment(course) ? 'Comprar' : 'Inscribirme'}
                onAction={() => handleSelect(course)}
                onDetails={() => setPreview(course)}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {paginatedAvailable.map((course, i) => (
              <div key={course.id} className="dashboard-card-in flex flex-col" style={{ animationDelay: `${Math.min(i, 9) * 45}ms` }}>
                <CourseCard
                  course={toCourse(course)}
                  progress={0}
                  actionLabel={enrolling === course.id ? 'Inscribiendo…' : requiresPayment(course) ? 'Comprar' : 'Inscribirme'}
                  onAction={() => handleSelect(course)}
                  onDetails={() => setPreview(course)}
                />
                <div className="mt-2 flex justify-between gap-2">
                  <Badge variant={requiresPayment(course) ? 'dark' : 'green'}>{priceLabel(course)}</Badge>
                  <Badge variant="blue">{course.level}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Pagination className="mt-6" page={pageSafe} totalItems={available.length} onChange={setPage} label="cursos" />
        </>
      )}

      {preview && (
        <CoursePreviewModal
          open={Boolean(preview)}
          course={preview}
          busy={enrolling === preview.id}
          onClose={() => setPreview(null)}
          onEnroll={(course) => { void handlePreviewEnroll(course); }}
        />
      )}

      {checkout && (
        <CheckoutModal
          open={Boolean(checkout)}
          course={checkout}
          onClose={() => setCheckout(null)}
          onPaid={handlePaid}
        />
      )}
    </>
  );
}

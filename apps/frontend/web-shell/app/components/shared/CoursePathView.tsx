/* ───────────────────────────────────────────
   CoursePathView — pantalla propia para "seguir el curso"
   ───────────────────────────────────────────
   CourseContentView es la ficha del curso: portada, descripción, reseñas,
   pestañas por tipo de contenido — todo lo que sirve para DECIDIR o repasar.
   Esta vista es la otra mitad: cuando el alumno ya decidió y solo quiere
   saber "¿por dónde voy?", sin nada alrededor que compita por su atención.

   El camino es secuencial y mezcla lecciones y exámenes Kahoot en un solo
   orden (por fecha de alta): no se puede abrir una actividad futura antes de
   completar la actual, y un examen no se puede saltar como una lectura —
   hay que contestarlo. Una vez completada una actividad, reabrirla entra en
   modo repaso (solo lectura, sin controles de avance).

   Las clases en vivo NO viven acá como una pestaña más: son un botón
   flotante. Si hay una sesión en vivo o programada, aparece; si no, no hay
   nada que mostrar y no ocupa espacio.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { APP_ICONS } from '@/lib/icons';
import { cn } from '@/lib/cn';
import { CoursePathMap, type PathMapItem } from '@/app/components/shared/CoursePathMap';
import { LiveClassRoom } from '@/app/components/shared/LiveClassRoom';
import { useLessonFileViewer } from '@/app/components/shared/LessonFileViewer';
import { KahootEvaluationCard, KahootAttemptReview } from '@/app/components/shared/KahootEvaluationCard';
import { contentTypeMeta, formatDuration } from '@/lib/lessonContentTypes';
import { usePageHeader } from '@/hooks/usePageHeader';
import { api, getErrorMessage } from '@/lib/api';
import { currentPhaseOrder } from '@/lib/coursePhase';
import { Modal } from '@/app/components/ui/Modal';
import { Button } from '@/app/components/ui/Button';
import { Badge, statusToBadgeVariant } from '@/app/components/ui/Badge';
import type { CertificateEligibility, CertificateRequest, Course, Evaluation, EvaluationAttempt, Lesson, LiveSession } from '@/lib/types';

/** Id sintético del nodo final del camino — no corresponde a ninguna lección
    ni examen real, así que nunca puede colisionar con un `pathItems[].id`
    (esos son UUIDs). */
const CERTIFICATE_NODE_ID = '__certificate__';

/** Texto plano a partir del `content` de la lección (puede traer HTML) —
    mismo criterio que el resumen del tooltip de CourseRoadmap: nunca se
    inyecta como HTML, solo se muestra como texto. */
function plainTextContent(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Un ítem del camino: o una lección, o un examen Kahoot — nunca ambos.
    Se arma una sola vez a partir de `lessons` + `evaluations` y es lo único
    que necesita conocer el resto de este componente. */
type PathItem =
  | { kind: 'lesson'; id: string; createdAt: string; completed: boolean; lesson: Lesson }
  | { kind: 'evaluation'; id: string; createdAt: string; completed: boolean; evaluation: Evaluation };

/** Actividad de lectura/video/documento abierta dentro de la misma pantalla
    del camino — nada de navegar afuera ni cerrar esta vista. Cuando la
    lección ya está completada entra en modo repaso: sin botón "Siguiente",
    solo para volver a ver el contenido. */
function LessonActivityPanel({
  lesson,
  completed,
  onNext,
  nextBusy,
  nextError,
}: Readonly<{ lesson: Lesson; completed: boolean; onNext?: () => void; nextBusy: boolean; nextError?: string | null }>) {
  const { controls, content } = useLessonFileViewer(lesson, { alwaysOpen: true });
  const meta = contentTypeMeta(lesson.contentType);
  const duration = formatDuration(lesson.durationMinutes);
  const text = lesson.content ? plainTextContent(lesson.content) : '';

  return (
    <div className="flex w-full flex-1 flex-col gap-5 px-6 py-8 lg:px-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--green-600)]">
            <Icon icon={meta.icon} width={15} height={15} /> {meta.label}{duration ? ` · ${duration}` : ''}
            {completed && <Badge variant="green">Completada · repaso</Badge>}
          </p>
          <h2 className="mt-1 text-[1.375rem] font-extrabold text-[var(--ink)]">{lesson.title}</h2>
        </div>
        {controls}
      </div>

      {/* flex-1: el video/documento crece para llenar el alto disponible en
          vez de quedar chico arriba con todo el resto vacío. */}
      <div className="flex flex-1 flex-col [&_video]:h-full [&_video]:max-h-none [&_iframe]:h-full">
        {content}

        {!lesson.fileUrl && text && (
          <p className="whitespace-pre-wrap text-[0.9375rem] leading-7 text-[var(--ink-soft)]">{text}</p>
        )}

        {!lesson.fileUrl && !text && (
          <p className="text-[0.875rem] text-[var(--ink-muted)]">Esta actividad todavía no tiene contenido cargado.</p>
        )}
      </div>

      {!completed && onNext && (
        <div className="flex flex-col items-end gap-2 border-t border-[var(--neutral-100)] pt-5">
          {nextError && (
            <p className="w-full rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-right text-[0.8125rem] text-[#BF2600]">{nextError}</p>
          )}
          <button
            type="button"
            disabled={nextBusy}
            onClick={onNext}
            className="rounded-full bg-[var(--green-600)] px-6 py-3 text-[0.9063rem] font-extrabold text-white shadow-[0_10px_24px_rgba(31,154,75,0.28)] transition-colors hover:bg-[var(--green-700)] disabled:opacity-60"
          >
            {nextBusy ? 'Guardando…' : 'Siguiente'}
          </button>
        </div>
      )}
    </div>
  );
}

/** Examen Kahoot dentro del camino: activo se contesta con la tarjeta
    interactiva (no se puede saltar), completado se ve en modo repaso con
    las respuestas ya dadas. */
function EvaluationActivityPanel({
  evaluation,
  completed,
  onPassed,
  onBack,
}: Readonly<{ evaluation: Evaluation; completed: boolean; onPassed: () => void; onBack: () => void }>) {
  const [attempt, setAttempt] = useState<EvaluationAttempt | null>(null);
  const [loadingAttempt, setLoadingAttempt] = useState(completed);

  useEffect(() => {
    if (!completed) return;
    let alive = true;
    setLoadingAttempt(true);
    api.myEvaluationAttempt(evaluation.id)
      .then((result) => { if (alive) setAttempt(result); })
      .finally(() => { if (alive) setLoadingAttempt(false); });
    return () => { alive = false; };
  }, [completed, evaluation.id]);

  return (
    <div className="flex w-full flex-1 flex-col gap-5 px-6 py-8 lg:px-10">
      {completed ? (
        loadingAttempt ? (
          <p className="text-[0.875rem] text-[var(--ink-muted)]">Cargando tus respuestas…</p>
        ) : attempt ? (
          <KahootAttemptReview evaluation={evaluation} attempt={attempt} onBack={onBack} />
        ) : (
          <p className="text-[0.875rem] text-[var(--ink-muted)]">No se encontró tu intento de este examen.</p>
        )
      ) : (
        /* Solo avanza al siguiente ítem del camino si aprobó (passed viene de
           comparar contra evaluation.passingScore) — si reprobó, se queda acá
           mismo y KahootEvaluationCard ya ofrece "Reintentar examen". */
        <KahootEvaluationCard
          evaluation={evaluation}
          onSubmitted={(_score, passed) => { if (passed) onPassed(); }}
          onBack={onBack}
        />
      )}
    </div>
  );
}

/** Nodo final del camino: ni lección ni examen, es la meta. Repite el mismo
    resumen de elegibilidad que la tarjeta "Certificado" de la ficha del
    curso, pero servido acá para que el alumno no tenga que salir del camino
    para pedirlo apenas termina la última actividad. */
function CertificateActivityPanel({
  courseTitle,
  eligibility,
  request,
  busy,
  onRequest,
  onDownload,
  downloading,
  onBack,
}: Readonly<{
  courseTitle: string;
  eligibility: CertificateEligibility | null;
  request: CertificateRequest | null;
  busy: boolean;
  onRequest: () => void;
  onDownload: () => void;
  downloading: boolean;
  onBack: () => void;
}>) {
  const approved = request?.status === 'approved';
  const pending = request?.status === 'pending';

  return (
    <div className="flex w-full flex-1 flex-col gap-5 px-6 py-8 lg:px-10">
      <button
        type="button"
        onClick={onBack}
        className="group flex w-fit items-center gap-1.5 text-[0.8125rem] font-semibold text-[var(--blue-600)] transition-colors hover:text-[var(--blue-700)]"
      >
        <Icon icon={APP_ICONS.chevronLeft} width={16} height={16} className="transition-transform duration-200 ease-out group-hover:-translate-x-1" />
        Volver
      </button>

      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--green-50)] text-[var(--green-600)]">
          <Icon icon={APP_ICONS.diplomaVerified} width={44} height={44} />
        </div>
        <div>
          <p className="mb-1 text-[0.75rem] font-extrabold uppercase tracking-[0.18em] text-[var(--green-600)]">Final</p>
          <h2 className="text-[1.375rem] font-extrabold text-[var(--ink)]">Emitir certificado</h2>
          <p className="mt-2 text-[0.9063rem] leading-6 text-[var(--ink-soft)]">
            {approved
              ? `Tu certificado de "${courseTitle}" ya fue aprobado y emitido — lo encontrás en Certificaciones.`
              : pending
                ? 'Solicitud enviada — un admin o el instructor la tiene que aprobar.'
                : eligibility?.eligible
                  ? 'Completaste todas las lecciones y aprobaste los exámenes. Ya podés solicitarlo.'
                  : eligibility?.reason ?? 'Completa todas las lecciones y aprueba los exámenes para desbloquearlo.'}
          </p>
        </div>

        {eligibility && (
          <div className="flex gap-4 text-[0.8125rem] font-semibold text-[var(--ink-soft)]">
            <span>{eligibility.lessonsCompleted}/{eligibility.lessonsTotal} lecciones</span>
            <span>{eligibility.evaluationsPassed}/{eligibility.evaluationsTotal} exámenes</span>
          </div>
        )}

        {approved ? (
          <button
            type="button"
            disabled={downloading}
            onClick={onDownload}
            className="rounded-full bg-[var(--green-600)] px-8 py-3.5 text-[0.9063rem] font-extrabold text-white shadow-[0_10px_24px_rgba(31,154,75,0.28)] transition-colors hover:bg-[var(--green-700)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {downloading ? 'Descargando…' : 'Descargar certificado'}
          </button>
        ) : (
          <button
            type="button"
            disabled={!eligibility?.eligible || busy || pending}
            onClick={onRequest}
            className="rounded-full bg-[var(--green-600)] px-8 py-3.5 text-[0.9063rem] font-extrabold text-white shadow-[0_10px_24px_rgba(31,154,75,0.28)] transition-colors hover:bg-[var(--green-700)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {busy
              ? 'Enviando…'
              : pending
                ? 'Solicitud pendiente…'
                : request?.status === 'rejected'
                  ? 'Volver a solicitar certificado'
                  : 'Solicitar certificado'}
          </button>
        )}
      </div>
    </div>
  );
}

const LIVE_JOINABLE_STATUSES = new Set(['live', 'scheduled']);
const LIVE_STATUS_LABEL: Record<string, string> = {
  scheduled: 'Programada', live: 'En vivo ahora', ended: 'Finalizada', canceled: 'Cancelada',
};

function formatScheduledAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-MX', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export interface CoursePathViewProps {
  course: Course;
  lessons: Lesson[];
  completedIds: ReadonlySet<string>;
  evaluations: Evaluation[];
  completedEvaluationIds: ReadonlySet<string>;
  onLessonCompleted: (lessonId: string) => void;
  onEvaluationCompleted: (evaluationId: string) => void;
  liveSessions: LiveSession[];
  progress: number;
  displayName: string;
  onClose: () => void;
  certificateIncluded: boolean;
  certificateEligibility: CertificateEligibility | null;
  certificateRequest: CertificateRequest | null;
  certificateBusy: boolean;
  onRequestCertificate: () => void;
  certificateDownloading: boolean;
  onDownloadCertificate: () => void;
}

export function CoursePathView({
  course,
  lessons,
  completedIds,
  evaluations,
  completedEvaluationIds,
  onLessonCompleted,
  onEvaluationCompleted,
  liveSessions,
  progress,
  displayName,
  onClose,
  certificateIncluded,
  certificateEligibility,
  certificateRequest,
  certificateBusy,
  onRequestCertificate,
  certificateDownloading,
  onDownloadCertificate,
}: Readonly<CoursePathViewProps>) {
  const [liveOpen, setLiveOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  /** Sesión que el alumno quiso abrir pero pertenece a una fase posterior a
      la suya — se le pide confirmar antes de entrar igual. */
  const [aheadSession, setAheadSession] = useState<LiveSession | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [nextBusy, setNextBusy] = useState(false);
  const [nextError, setNextError] = useState<string | null>(null);
  /* Si el error de "No estás inscrito..." (u otro) queda pegado de una
     actividad anterior, no debe seguir mostrándose al abrir otra distinta. */
  useEffect(() => { setNextError(null); }, [openItemId]);
  /* Hueco real que dejan la sidebar y el topbar de la app — esta vista debe
     abarcar TODO lo demás (edge-to-edge), pero sin taparlos: la sidebar y el
     header siempre tienen que seguir visibles. Se mide en vivo en vez de
     hardcodear anchos/altos porque la sidebar cambia de ancho (rail vs
     expandida) y de posición (drawer en móvil). */
  const [offset, setOffset] = useState({ top: 0, left: 0 });

  /* Camino único: lecciones + exámenes Kahoot, por defecto mezclados por
     fecha de alta (el orden en el que se crearon es el orden en el que se
     recorren) — un examen bloquea el avance igual que una lección sin
     completar. Si una fase ya asignó orden a su contenido, esa fase manda:
     dentro de ella, un examen "al comienzo" va antes que sus lecciones y uno
     "al final" va después de todas — item sin fase asignada no se reordena,
     conserva su lugar cronológico de siempre. */
  const phaseOrderById = useMemo(
    () => new Map((course.phases ?? []).map((p) => [p.id, p.order])),
    [course.phases],
  );
  const phaseRankOf = (item: PathItem): number | undefined =>
    item.kind === 'lesson'
      ? (item.lesson.phaseId ? phaseOrderById.get(item.lesson.phaseId) : undefined)
      : (item.evaluation.phaseId ? phaseOrderById.get(item.evaluation.phaseId) : undefined);
  const subRankOf = (item: PathItem): number => {
    if (item.kind === 'evaluation') return item.evaluation.phasePosition === 'start' ? 0 : 2;
    return 1;
  };

  const pathItems = useMemo<PathItem[]>(() => {
    const lessonItems: PathItem[] = lessons.map((lesson) => ({
      kind: 'lesson',
      id: lesson.id,
      createdAt: lesson.createdAt ?? '',
      completed: completedIds.has(lesson.id) || Boolean(lesson.completed),
      lesson,
    }));
    const evaluationItems: PathItem[] = evaluations.map((evaluation) => ({
      kind: 'evaluation',
      id: evaluation.id,
      createdAt: evaluation.createdAt ?? '',
      completed: completedEvaluationIds.has(evaluation.id),
      evaluation,
    }));
    return [...lessonItems, ...evaluationItems]
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
      .sort((a, b) => {
        const rankA = phaseRankOf(a);
        const rankB = phaseRankOf(b);
        if (rankA === undefined || rankB === undefined) return 0;
        return rankA - rankB || subRankOf(a) - subRankOf(b);
      }
    );
  }, [lessons, evaluations, completedIds, completedEvaluationIds, phaseOrderById]);

  const openIndex = pathItems.findIndex((item) => item.id === openItemId);
  const openItem = openIndex >= 0 ? pathItems[openIndex] : null;
  const certificateOpen = openItemId === CERTIFICATE_NODE_ID;

  const joinable = liveSessions
    .filter((s) => LIVE_JOINABLE_STATUSES.has(s.status))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  const isLiveNow = joinable.some((s) => s.status === 'live');

  /* Fase en la que va el alumno en este curso — para avisarle si la clase
     que quiere abrir corresponde a una fase más adelante en el camino. */
  const myPhaseOrder = useMemo(
    () => currentPhaseOrder(course.phases, lessons, completedIds),
    [course.phases, lessons, completedIds],
  );
  const openLiveSession = (session: LiveSession) => {
    if (session.phase && session.phase.order > myPhaseOrder) {
      setAheadSession(session);
      return;
    }
    setActiveSession(session);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && !liveOpen) onClose(); };
    document.addEventListener('keydown', onKeyDown);
    /* Solo el body deja de scrollear — la sidebar sigue con su propio scroll
       (lg:h-screen) intacto, así que no queda atrapada ni se corta. */
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, liveOpen]);

  useEffect(() => {
    /* Se abre siempre desde arriba: así el topbar (no es sticky) está en su
       posición natural cuando medimos su alto. */
    window.scrollTo({ top: 0 });

    const sidebarEl = document.querySelector<HTMLElement>('[data-app-sidebar]');
    const topbarEl = document.querySelector<HTMLElement>('[data-app-topbar]');

    const update = () => {
      /* .right (no .width): en móvil la sidebar sigue teniendo su ancho de
         drawer aunque esté trasladada fuera de pantalla; lo que importa es
         hasta dónde llega su borde derecho realmente visible. */
      const left = sidebarEl ? Math.max(0, sidebarEl.getBoundingClientRect().right) : 0;
      const top = topbarEl ? Math.max(0, topbarEl.getBoundingClientRect().bottom) : 0;
      setOffset({ top, left });
    };

    update();
    const ro = new ResizeObserver(update);
    if (sidebarEl) ro.observe(sidebarEl);
    if (topbarEl) ro.observe(topbarEl);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const completedCount = pathItems.filter((item) => item.completed).length;

  /* El nombre del curso y el progreso viven en el header real de la app
     (donde normalmente dice "Mis cursos"), no acá abajo — y cambian solos,
     según el curso que estés viendo. */
  usePageHeader({
    eyebrow: 'Curso',
    title: course.title,
    subtitle: `${completedCount} de ${pathItems.length} completados · ${Math.round(progress)}%`,
  });

  /* Al terminar una actividad avanza a la siguiente del camino; si era la
     última, vuelve al camino para que se vea todo completado. */
  const advance = () => {
    const next = pathItems[openIndex + 1];
    setOpenItemId(next ? next.id : null);
  };

  const handleLessonNext = async (lessonId: string) => {
    setNextBusy(true);
    setNextError(null);
    try {
      await api.setLessonCompleted(lessonId, true);
      onLessonCompleted(lessonId);
      advance();
    } catch (err) {
      setNextError(getErrorMessage(err));
    } finally {
      setNextBusy(false);
    }
  };

  const handleEvaluationPassed = (evaluationId: string) => {
    onEvaluationCompleted(evaluationId);
    advance();
  };

  /* Un solo botón de "volver", contextual: si hay una actividad (o el nodo
     final) abierto, vuelve al camino; si no, cierra esta vista y vuelve a la
     ficha del curso. */
  const handleBack = (openItem || certificateOpen) ? () => setOpenItemId(null) : onClose;
  const backLabel = (openItem || certificateOpen) ? 'Volver al camino' : 'Volver al curso';

  const mapItems: PathMapItem[] = pathItems.map((item) => {
    if (item.kind === 'lesson') {
      const meta = contentTypeMeta(item.lesson.contentType);
      return {
        id: item.id,
        title: item.lesson.title,
        icon: meta.icon,
        typeLabel: meta.label,
        durationMinutes: item.lesson.durationMinutes,
        completed: item.completed,
      };
    }
    return {
      id: item.id,
      title: item.evaluation.title,
      icon: APP_ICONS.quiz,
      typeLabel: 'Examen',
      completed: item.completed,
    };
  });

  /* Meta del camino: solo si el curso emite certificado. Bloqueada como
     cualquier otro nodo hasta completar lo anterior (CoursePathMap decide eso
     solo por posición respecto al primer ítem sin completar de la lista). */
  if (certificateIncluded) {
    mapItems.push({
      id: CERTIFICATE_NODE_ID,
      title: 'Final',
      icon: APP_ICONS.diplomaVerified,
      typeLabel: 'Emitir certificado',
      completed: certificateRequest?.status === 'approved',
    });
  }

  return (
    <div
      className="fixed z-[250] flex flex-col overflow-y-auto bg-[linear-gradient(180deg,#F7FBF4_0%,#FFFFFF_22%)]"
      style={{ top: offset.top, left: offset.left, right: 0, bottom: 0 }}
    >
      {/* ── Cabecera mínima ──
          Sin caja/fondo propio a propósito: pegada arriba del todo, contra el
          header de la app, para que se lea como una continuación de esa
          barra y no como una segunda barra aparte. */}
      <div className="shrink-0 px-6 pb-2 pt-3">
        <button
          type="button"
          onClick={handleBack}
          className="group flex items-center gap-1.5 text-[0.875rem] font-semibold text-[var(--blue-600)] transition-colors hover:text-[var(--blue-700)]"
        >
          <Icon
            icon={APP_ICONS.chevronLeft}
            width={17}
            height={17}
            className="transition-transform duration-200 ease-out group-hover:-translate-x-1"
          />
          {backLabel}
        </button>
      </div>

      <p className="shrink-0 px-6 text-center text-[0.6875rem] font-extrabold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
        Contenido del curso
      </p>

      {/* ── Camino, o la actividad seleccionada ──
          "Continuar" abre la actividad acá mismo, dentro de esta pantalla —
          nunca sale a otra vista. */}
      {certificateOpen ? (
        <CertificateActivityPanel
          courseTitle={course.title}
          eligibility={certificateEligibility}
          request={certificateRequest}
          busy={certificateBusy}
          onRequest={onRequestCertificate}
          downloading={certificateDownloading}
          onDownload={onDownloadCertificate}
          onBack={() => setOpenItemId(null)}
        />
      ) : openItem ? (
        openItem.kind === 'lesson' ? (
          <LessonActivityPanel
            lesson={openItem.lesson}
            completed={openItem.completed}
            nextBusy={nextBusy}
            nextError={nextError}
            onNext={openItem.completed ? undefined : () => void handleLessonNext(openItem.id)}
          />
        ) : (
          <EvaluationActivityPanel
            evaluation={openItem.evaluation}
            completed={openItem.completed}
            onPassed={() => handleEvaluationPassed(openItem.id)}
            onBack={() => setOpenItemId(null)}
          />
        )
      ) : (
        <div className="flex-1 px-6 py-12">
          <CoursePathMap items={mapItems} onOpen={(item) => setOpenItemId(item.id)} />
        </div>
      )}

      {/* ── Botón flotante de clase en vivo ──
          Solo existe si hay algo que unirse: nada de una pestaña vacía
          "clases en vivo" cuando el curso no tiene ninguna programada. */}
      {joinable.length > 0 && (
        <button
          type="button"
          onClick={() => setLiveOpen((v) => !v)}
          /* +64 en vez de +14: justo debajo de la fila del botón "Volver", no
             encima — se tapaban entre sí, dejando "Volver" invisible. */
          style={{ top: offset.top + 64, left: offset.left + 14 }}
          className={cn(
            'fixed z-[260] flex items-center gap-2.5 rounded-full px-5 py-3.5 text-[0.875rem] font-extrabold text-white shadow-[0_16px_36px_rgba(23,50,77,0.28)] transition-transform hover:scale-105',
            isLiveNow ? 'bg-[var(--red-500,#E5484D)]' : 'bg-[var(--blue-600)]',
          )}
        >
          <span className="relative flex h-2.5 w-2.5">
            {isLiveNow && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            )}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
          </span>
          {isLiveNow ? 'Clase en vivo' : 'Próxima clase'}
        </button>
      )}

      {/* ── Panel de sesiones ── */}
      {liveOpen && joinable.length > 0 && (
        <div
          role="dialog"
          aria-label="Clases en vivo del curso"
          style={{ top: offset.top + 118, left: offset.left + 14 }}
          className="fixed z-[260] w-[21rem] max-w-[calc(100vw-3.5rem)] rounded-[1.25rem] border border-[var(--neutral-100)] bg-white p-3 shadow-[0_20px_48px_rgba(23,50,77,0.24)]"
        >
          <p className="px-2 pb-2 pt-1 text-[0.75rem] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
            Clases en vivo de este curso
          </p>
          <div className="flex flex-col gap-1.5">
            {joinable.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => { openLiveSession(session); setLiveOpen(false); }}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--blue-50)]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.8438rem] font-bold text-[var(--ink)]">{session.title}</p>
                  <p className="text-[0.75rem] text-[var(--ink-muted)]">
                    {session.hostName} · {formatScheduledAt(session.scheduledAt)}
                  </p>
                </div>
                <Badge variant={statusToBadgeVariant(session.status)}>
                  {LIVE_STATUS_LABEL[session.status] ?? session.status}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      <Modal
        open={activeSession !== null}
        onClose={() => setActiveSession(null)}
        title={activeSession?.title ?? ''}
        description={activeSession ? `${activeSession.hostName} · ${formatScheduledAt(activeSession.scheduledAt)}` : undefined}
        className="max-w-4xl"
      >
        {activeSession && (
          <LiveClassRoom
            sessionId={activeSession.id}
            userName={displayName}
            onLeave={() => setActiveSession(null)}
          />
        )}
      </Modal>

      {/* ── Aviso de fase adelantada ── */}
      <Modal
        open={aheadSession !== null}
        onClose={() => setAheadSession(null)}
        title="Esta clase es de una fase más adelante"
      >
        {aheadSession && (
          <div className="flex flex-col gap-4">
            <p className="text-[0.9375rem] leading-6 text-[var(--ink-soft)]">
              <strong className="text-[var(--ink)]">{aheadSession.title}</strong> pertenece a{' '}
              <strong className="text-[var(--ink)]">Fase {aheadSession.phase?.order}: {aheadSession.phase?.title}</strong>,
              que está más adelante de donde vas en el curso. Podés seguir sin haber completado lo anterior,
              pero puede que algunos temas todavía no te resulten familiares.
            </p>
            <div className="flex justify-end gap-2.5">
              <Button variant="secondary" onClick={() => setAheadSession(null)}>Cancelar</Button>
              <Button
                variant="primary"
                onClick={() => { setActiveSession(aheadSession); setAheadSession(null); }}
              >
                Entrar de todas formas
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

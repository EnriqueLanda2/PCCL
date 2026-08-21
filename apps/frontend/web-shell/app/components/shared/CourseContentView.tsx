/* ───────────────────────────────────────────
   CourseContentView — detalle de un curso embebido
   en el catálogo (sin navegar de página).
   Header con tabs por tipo de contenido
   (Material, Clases en video, Clases por PDF, etc.)
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { api } from '@/lib/api';
import type { CertificateEligibility, CertificateRequest, Course, CourseReview, Evaluation, Lesson, LiveSession } from '@/lib/types';
import { Badge, statusToBadgeVariant } from '@/app/components/ui/Badge';
import { Modal } from '@/app/components/ui/Modal';
import { AppInput } from '@/app/components/ui/AppControls';
import { contentTypeMeta, formatDuration, cloudinaryVideoThumbnail } from '@/lib/lessonContentTypes';
import { CreateLessonModal } from '@/app/components/shared/CreateLessonModal';
import { LiveClassRoom } from '@/app/components/shared/LiveClassRoom';
import { useLessonFileViewer } from '@/app/components/shared/LessonFileViewer';
import { PendingTasks } from '@/app/components/shared/PendingTasks';
import { KahootEvaluationCard } from '@/app/components/shared/KahootEvaluationCard';
import { CoursePathView } from '@/app/components/shared/CoursePathView';
import { ProgressBar } from '@/app/components/ui/ProgressBar';
import { useUser } from '@/hooks/useUser';
import { APP_ICONS } from '@/lib/icons';
import { downloadFile } from '@/lib/downloadFile';

const LIVE_STATUS_LABEL: Record<string, string> = {
  scheduled: 'Programada', live: 'En vivo', ended: 'Finalizada', canceled: 'Cancelada',
};
const LIVE_JOINABLE_STATUSES = new Set(['live', 'scheduled']);
const softButtonSx = {
  borderRadius: '999px',
  borderColor: 'var(--neutral-200)',
  bgcolor: 'rgba(255,255,255,0.82)',
  color: 'var(--ink-soft)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 10px 22px rgba(23,50,77,0.08)',
  '&:hover': { bgcolor: 'var(--blue-50)', borderColor: 'var(--blue-300)' },
};

function formatScheduledAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-MX', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function levelLabel(level: string) {
  return ({ basic: 'Básico', intermediate: 'Intermedio', advanced: 'Avanzado' } as Record<string, string>)[level] ?? level;
}

function instructorInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'P';
}

function ratingLabel(rating?: number | null, count?: number | null) {
  if (!rating || !count) return 'Sin reseñas';
  return `${rating.toFixed(1)} (${count} reseña${count === 1 ? '' : 's'})`;
}

interface CourseContentViewProps {
  course: Course;
  onBack: () => void;
  /** Texto del enlace de regreso — p. ej. "Volver al estudio" cuando un
      instructor entra como vista previa desde su estudio de curso. */
  backLabel?: string;
}

export function CourseContentView({ course, onBack, backLabel }: CourseContentViewProps) {
  const [lessons, setLessons] = useState<Lesson[]>(course.lessons ?? []);
  const [canManage, setCanManage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const duration = formatDuration(course.durationMinutes);

  /* ── Clases en vivo del curso — viven en LiveSession, no en Lesson, así
     que se cargan aparte y se fusionan como una pestaña más ── */
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [activeLiveSession, setActiveLiveSession] = useState<LiveSession | null>(null);
  const [pathViewOpen, setPathViewOpen] = useState(false);
	  const [progress, setProgress] = useState(0);
	  const [inscriptionId, setInscriptionId] = useState<string | null>(null);
	  const [certificateEligibility, setCertificateEligibility] = useState<CertificateEligibility | null>(null);
	  const [certificateRequest, setCertificateRequest] = useState<CertificateRequest | null>(null);
	  const [certificateBusy, setCertificateBusy] = useState(false);
	  const [certificateDownloading, setCertificateDownloading] = useState(false);
	  const [reviews, setReviews] = useState<CourseReview[]>([]);
	  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
	  const [reviewRating, setReviewRating] = useState(5);
	  const [reviewComment, setReviewComment] = useState('');
	  const [reviewBusy, setReviewBusy] = useState(false);
  /* Antes era solo localStorage (no viajaba entre dispositivos ni lo veía un
     admin). Ahora vive en `course_favorites`, enlazando userId + courseId —
     se pide junto con el resto de los datos de la ficha al montar. */
  const [favorite, setFavorite] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  /* Lecciones ya completadas. Se derivan de las tareas pendientes, que es el
     endpoint que cruza lesson_completions con el alumno de la sesión; la
     lección en sí no trae ese dato porque es el mismo objeto para todos. */
  const [completedLessonIds, setCompletedLessonIds] = useState<ReadonlySet<string>>(new Set());
  /** Igual que completedLessonIds pero para exámenes — de la misma
      respuesta de pendingTasks, filtrando por kind === 'evaluation'. */
  const [completedEvaluationIds, setCompletedEvaluationIds] = useState<ReadonlySet<string>>(new Set());
  const { user } = useUser();
  const displayName = user?.fullName ?? user?.email?.split('@')[0] ?? 'Invitado';
	  const instructorName = course.instructorName ?? course.createdBy ?? 'Profesor del curso';
	  /* Antes se derivaba de `progress` (round((progress/100) * lessons.length)),
	     pero ese % mezcla lecciones Y exámenes — solo da el conteo real de
	     lecciones cuando ambas proporciones coinciden por casualidad. Usar el
	     Set de completadas evita ese redondeo matemáticamente inconsistente. */
	  const completedLessons = completedLessonIds.size;
	  const averageRating = reviews.length
	    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
	    : course.rating;
	  const reviewCount = reviews.length || course.reviewCount || 0;

  const loadLiveSessions = () => {
    api.liveSessions()
      .then((all) => setLiveSessions(all.filter((s) => s.courseId === course.id)))
      .catch(() => {});
  };

  /* Completar una lección o aprobar un examen cambia el % real en el backend
     (recalculateCourseProgress), pero acá solo se actualizaba el Set local de
     completados — el número de progreso se quedaba con el valor cargado al
     abrir la ficha. Se llama tras cada avance dentro de CoursePathView para
     que "X de N completados · Y%" no se desincronice.
     También refresca la elegibilidad de certificado por el mismo motivo: si
     no, la tarjeta "Certificado" se queda mostrando "0/6 lecciones" aunque el
     curso ya esté al 100%. */
  const refreshProgress = () => {
    api.inscriptions().then((items) => {
      const current = items.find((item) => item.course?.id === course.id);
      setProgress(current?.progressPercentage ?? 0);
    }).catch(() => {});
    api.courseCertificateEligibility(course.id).then(setCertificateEligibility).catch(() => {});
  };

  useEffect(() => {
    let alive = true;
    api.access().then((access) => {
      if (alive) setCanManage(access.permissions.includes('lessons:create'));
    }).catch(() => {});
	    api.inscriptions().then((items) => {
	      if (!alive) return;
	      const current = items.find((item) => item.course?.id === course.id);
	      setProgress(current?.progressPercentage ?? 0);
	      setInscriptionId(current?.id ?? null);
	      if (current?.id) {
	        api.myCertificateRequest(current.id).then((req) => { if (alive) setCertificateRequest(req); }).catch(() => {});
	      }
	    }).catch(() => {});
	    api.pendingTasks(course.id).then((result) => {
	      if (!alive) return;
	      setCompletedLessonIds(
	        new Set(result.tasks.filter((task) => task.kind === 'lesson' && task.done).map((task) => task.id)),
	      );
	      setCompletedEvaluationIds(
	        new Set(result.tasks.filter((task) => task.kind === 'evaluation' && task.done).map((task) => task.id)),
	      );
	    }).catch(() => {});
	    api.courseCertificateEligibility(course.id).then((eligibility) => {
	      if (alive) setCertificateEligibility(eligibility);
	    }).catch(() => {});
	    api.myFavoriteCourseIds().then((ids) => {
	      if (alive) setFavorite(ids.includes(course.id));
	    }).catch(() => {});
	    api.courseReviews(course.id).then((items) => {
	      if (!alive) return;
	      setReviews(items);
	      const mine = items.find((review) => review.mine);
	      if (mine) {
	        setReviewRating(mine.rating);
	        setReviewComment(mine.comment ?? '');
	      }
	    }).catch(() => {});
	    api.evaluations(course.id).then((items) => {
	      if (alive) setEvaluations(items);
	    }).catch(() => {});
	    loadLiveSessions();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.id]);

  const handleFavorite = async () => {
    if (favoriteBusy) return;
    const next = !favorite;
    /* Optimista: se ve al toque, y si el pedido falla se revierte —
       coherente con cómo se maneja el resto de las acciones de esta ficha. */
    setFavorite(next);
    setFavoriteBusy(true);
    try {
      await api.setCourseFavorite(course.id, next);
    } catch {
      setFavorite(!next);
      setFeedback('No se pudo guardar el curso. Intenta de nuevo.');
      window.setTimeout(() => setFeedback(null), 2400);
    } finally {
      setFavoriteBusy(false);
    }
  };

	  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: course.title, text: course.description, url });
      else await navigator.clipboard.writeText(url);
      setFeedback('Enlace del curso listo para compartir.');
    } catch {
      setFeedback('No se pudo compartir el curso desde este navegador.');
    }
    window.setTimeout(() => setFeedback(null), 2400);
	  };

	  /** Se aprueba en el momento: llegar hasta el backend ya implica que
	      `certificateEligibility.eligible` es true (todas las lecciones y
	      exámenes al día), así que no hace falta que un admin lo revise. */
	  const handleRequestCertificate = async () => {
	    if (!inscriptionId) return;
	    setCertificateBusy(true);
	    try {
	      const request = await api.requestCertificate(inscriptionId);
	      setCertificateRequest(request);
	      setFeedback('¡Certificado emitido! Ya podés descargarlo.');
	    } catch {
	      setFeedback(certificateEligibility?.reason ?? 'Aún no cumples los requisitos para obtener el certificado.');
	    } finally {
	      setCertificateBusy(false);
	      window.setTimeout(() => setFeedback(null), 2800);
	    }
	  };

	  const handleDownloadCertificate = async () => {
	    if (!certificateRequest?.certificateId || certificateDownloading) return;
	    setCertificateDownloading(true);
	    try {
	      const { url } = await api.downloadCertificate(certificateRequest.certificateId);
	      await downloadFile(url, `${course.title}.pdf`);
	    } catch {
	      setFeedback('No se pudo descargar el certificado. Intenta de nuevo.');
	      window.setTimeout(() => setFeedback(null), 2800);
	    } finally {
	      setCertificateDownloading(false);
	    }
	  };

	  const handleSubmitReview = async () => {
	    setReviewBusy(true);
	    try {
	      const items = await api.upsertCourseReview(course.id, reviewRating, reviewComment.trim() || null);
	      setReviews(items);
	      setFeedback('Reseña guardada.');
	    } catch {
	      setFeedback('No se pudo guardar la reseña. Verifica que estés inscrito en el curso.');
	    } finally {
	      setReviewBusy(false);
	      window.setTimeout(() => setFeedback(null), 2400);
	    }
	  };

  const openCreate = () => { setEditingLesson(null); setModalOpen(true); };
  const openEdit = (lesson: Lesson) => { setEditingLesson(lesson); setModalOpen(true); };

  const handleSaved = (saved: Lesson) => {
    setLessons((prev) => {
      const exists = prev.some((l) => l.id === saved.id);
      return exists ? prev.map((l) => (l.id === saved.id ? saved : l)) : [...prev, saved];
    });
  };

  const handleLiveSaved = () => {
    loadLiveSessions();
    setActiveTab('live');
  };

  const tabs = useMemo(() => {
    /* 'live' se arma aparte a partir de `liveSessions` (más abajo) — si
       alguna lección vieja quedó con ese contentType, no debe generar una
       segunda pestaña con la misma key. */
    const present = Array.from(new Set(lessons.map((l) => l.contentType))).filter((type) => type !== 'live');
    const lessonTabs = present.map((type) => ({
      type,
      ...contentTypeMeta(type),
      count: lessons.filter((l) => l.contentType === type).length,
    }));
	    const allTabs = liveSessions.length > 0
	      ? [...lessonTabs, { type: 'live', ...contentTypeMeta('live'), count: liveSessions.length }]
	      : lessonTabs;
	    if (evaluations.length > 0) {
	      allTabs.push({ type: 'evaluation', icon: APP_ICONS.quiz, label: 'Exámenes Kahoot', count: evaluations.length });
	    }
	    return allTabs.sort((a, b) => b.count - a.count);
	  }, [lessons, liveSessions, evaluations]);

  const [activeTab, setActiveTab] = useState<string>('all');
  const filteredLessons = activeTab === 'all' || activeTab === 'live'
    ? lessons
    : lessons.filter((l) => l.contentType === activeTab);
  const sortedLiveSessions = useMemo(
    () => [...liveSessions].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()),
    [liveSessions],
  );

  /* Layout única: mientras el camino está abierto, la ficha del curso (hero,
     descripción, pestañas, reseñas...) ni se monta — no solo queda tapada
     visualmente. Antes seguía renderizada por detrás de CoursePathView,
     duplicando trabajo y a veces filtrándose por encima si el overlay no
     alcanzaba a cubrir todo. */
  if (pathViewOpen) {
    return (
      <CoursePathView
        course={course}
        lessons={lessons}
        completedIds={completedLessonIds}
        evaluations={evaluations}
        completedEvaluationIds={completedEvaluationIds}
        onLessonCompleted={(lessonId) => { setCompletedLessonIds((prev) => new Set(prev).add(lessonId)); refreshProgress(); }}
        onEvaluationCompleted={(evaluationId) => { setCompletedEvaluationIds((prev) => new Set(prev).add(evaluationId)); refreshProgress(); }}
        liveSessions={liveSessions}
        progress={progress}
        displayName={displayName}
        onClose={() => setPathViewOpen(false)}
        certificateIncluded={Boolean(course.certificateIncluded)}
        certificateEligibility={certificateEligibility}
        certificateRequest={certificateRequest}
        certificateBusy={certificateBusy}
        onRequestCertificate={() => void handleRequestCertificate()}
        certificateDownloading={certificateDownloading}
        onDownloadCertificate={() => void handleDownloadCertificate()}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Back ── */}
      <Button
        onClick={onBack}
        variant="text"
        disableRipple
        sx={{
          alignSelf: 'flex-start',
          minWidth: 0,
          p: 0,
          color: 'var(--blue-600)',
          fontSize: 13.5,
          fontWeight: 600,
          fontFamily: 'var(--font-sans)',
          textTransform: 'none',
          '&:hover': { bgcolor: 'transparent', color: 'var(--blue-700)' },
        }}
      >
        ← {backLabel ?? 'Volver al catálogo'}
      </Button>

      {/* ── Course detail hero ── */}
      <div
        style={{
          position: 'relative',
          borderRadius: '0 0 1.5rem 1.5rem',
          overflow: 'hidden',
          minHeight: '16.25rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '1.75rem',
          color: '#fff',
          background: course.coverImageUrl
            ? `linear-gradient(to right, rgba(14,26,38,0.86), rgba(14,26,38,0.30)), url(${course.coverImageUrl}) center/cover no-repeat`
            : 'radial-gradient(circle at 72% 36%, rgba(47,168,102,0.45), transparent 28%), linear-gradient(135deg, #0E1A26, #17324D)',
        }}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-[0.75rem] font-extrabold text-[var(--green-700)]">{levelLabel(course.level)}</span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-[0.75rem] font-extrabold text-[var(--blue-700)]">{course.status === 'draft' ? 'Borrador' : 'Inscrito'}</span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-[0.75rem] font-extrabold text-white backdrop-blur">{course.category ?? 'Curso'}</span>
        </div>
        {/* color explícito: globals.css pinta todo h1 de #17324D, el mismo azul
            del fondo del hero, y el título se perdía por completo */}
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', lineHeight: 1.08, marginBottom: '0.5rem', maxWidth: '48rem', color: '#fff', textShadow: '0 1px 12px rgba(10,20,30,0.45)' }}>
          {course.title}
        </h1>
        <p style={{ fontSize: '0.9688rem', maxWidth: '48rem', opacity: 0.95, lineHeight: 1.55, fontWeight: 600 }}>
          por {instructorName}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <main className="flex min-w-0 flex-col gap-7">
          <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-[var(--neutral-100)] pb-6 text-[0.9063rem] font-semibold text-[var(--blue-600)]">
            {duration && <span className="inline-flex items-center gap-2"><Icon icon={APP_ICONS.clock} width={17} height={17} />{duration}</span>}
            <span className="inline-flex items-center gap-2"><Icon icon={APP_ICONS.users} width={17} height={17} />{course.studentsCount?.toLocaleString('es-MX') ?? '0'} estudiantes</span>
	            <span className="inline-flex items-center gap-2"><Icon icon={APP_ICONS.star} width={17} height={17} />{ratingLabel(averageRating, reviewCount)}</span>
	            <span className="inline-flex items-center gap-2"><Icon icon={APP_ICONS.diplomaVerified} width={17} height={17} />{course.certificateIncluded ? 'Certificado incluido' : 'Sin certificado'}</span>
          </div>

          <section className="rounded-[1.5rem] bg-[#F3F8EE] p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[1rem] font-extrabold text-[var(--ink)]">Tu progreso</h2>
	                <p className="text-[0.875rem] text-[var(--ink-soft)]">{completedLessons} de {lessons.length} lecciones completadas</p>
              </div>
              <strong className="text-[1.75rem] font-extrabold text-[var(--green-600)]">{Math.round(progress)}%</strong>
            </div>
            <ProgressBar value={progress} color="green" />
          </section>

          <section>
            <h2 className="mb-3 text-[1.15rem] font-extrabold text-[var(--ink)]">Sobre este curso</h2>
            <p className="text-[0.9688rem] leading-8 text-[var(--ink-soft)]">{course.description}</p>
          </section>

          <section>
            <h2 className="mb-4 text-[1.15rem] font-extrabold text-[var(--ink)]">Lo que aprenderás</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                `Dominar los fundamentos de ${course.category ?? levelLabel(course.level)}`,
                'Aplicar lo aprendido en actividades prácticas',
                'Avanzar con materiales, videos o documentos del curso',
                'Medir tu progreso y completar evaluaciones',
              ].map((item) => (
                <div key={item} className="flex gap-3 text-[0.9063rem] leading-6 text-[var(--ink-soft)]">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--green-50)] text-[var(--green-600)]">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </section>

	          <section>
	            <h2 className="mb-3 text-[1.15rem] font-extrabold text-[var(--ink)]">Requisitos</h2>
	            <ul className="flex flex-col gap-2 text-[0.9063rem] text-[var(--ink-soft)]">
	              <li>· No se requiere experiencia previa para comenzar.</li>
	              <li>· Reserva tiempo para completar las actividades del curso.</li>
	              <li>· Para certificado: completa todas las lecciones y aprueba los exámenes  por tema.</li>
	            </ul>
	          </section>

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[1.15rem] font-extrabold text-[var(--ink)]">Contenido del curso</h2>
              <span className="text-[0.875rem] font-semibold text-[var(--blue-600)]">{tabs.length || 1} módulos · {lessons.length} lecciones</span>
            </div>

            {/* ── Header con tabs por tipo de contenido ── */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.75rem', borderBottom: '1.5px solid var(--neutral-200)', flexWrap: 'wrap', paddingBottom: '2px' }}>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                <TabButton label={`Todo el contenido (${lessons.length})`} active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                {tabs.map((t) => (
                  <TabButton
                    key={t.type}
                    icon={t.icon}
                    label={`${t.label} (${t.count})`}
                    active={activeTab === t.type}
                    onClick={() => setActiveTab(t.type)}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                <PendingTasks courseId={course.id} title="Tareas pendientes del curso" defaultExpanded />
                {canManage && (
                  <Button type="button" variant="outlined" size="small" onClick={openCreate} sx={softButtonSx}>
                    + Agregar lección
                  </Button>
                )}
	              </div>
	            </div>

	            <div id="course-content-list" className="mt-5">
	              {activeTab === 'live' ? (
	                sortedLiveSessions.length === 0 ? (
	                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem', padding: '24px 0' }}>
	                    Este curso aún no tiene clases en vivo programadas.
	                  </p>
	                ) : (
	                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
	                    {sortedLiveSessions.map((session) => (
	                      <div
	                        key={session.id}
	                        style={{
	                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap',
	                          padding: '14px 16px', borderRadius: 'var(--radius-md)',
	                          border: '1px solid var(--neutral-100)', background: 'var(--panel)',
	                        }}
	                      >
	                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', minWidth: 0 }}>
	                          <span style={{
	                            flexShrink: 0, width: '2rem', height: '2rem', borderRadius: '999px',
	                            background: 'var(--blue-50)', color: 'var(--blue-600)',
	                            display: 'flex', alignItems: 'center', justifyContent: 'center',
	                          }}>
	                            <Icon icon={APP_ICONS.live} width={16} height={16} />
	                          </span>
	                          <div style={{ minWidth: 0 }}>
	                            <div style={{ fontSize: '0.9063rem', fontWeight: 500, color: 'var(--ink)' }}>{session.title}</div>
	                            <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
	                              {session.hostName} · {formatScheduledAt(session.scheduledAt)}
	                            </div>
	                          </div>
	                        </div>
	                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
	                          <Badge variant={statusToBadgeVariant(session.status)}>
	                            {LIVE_STATUS_LABEL[session.status] ?? session.status}
	                          </Badge>
	                          {LIVE_JOINABLE_STATUSES.has(session.status) && (
	                            <Button variant="outlined" size="small" onClick={() => setActiveLiveSession(session)} sx={softButtonSx}>
	                              {session.status === 'live' ? 'Unirse' : 'Entrar temprano'}
	                            </Button>
	                          )}
	                        </div>
	                      </div>
	                    ))}
	                  </div>
	                )
	              ) : activeTab === 'evaluation' ? (
	                <div className="grid gap-4">
	                  {evaluations.map((evaluation) => (
	                    <KahootEvaluationCard
	                      key={evaluation.id}
	                      evaluation={evaluation}
	                      onSubmitted={() => {
	                        api.courseCertificateEligibility(course.id).then(setCertificateEligibility).catch(() => {});
	                        api.inscriptions().then((items) => {
	                          const current = items.find((item) => item.course?.id === course.id);
	                          setProgress(current?.progressPercentage ?? 0);
	                        }).catch(() => {});
	                      }}
	                    />
	                  ))}
	                </div>
	              ) : filteredLessons.length === 0 ? (
	                <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem', padding: '24px 0' }}>
	                  Este curso aún no tiene contenido de este tipo.
	                </p>
	              ) : activeTab === 'video' ? (
	                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
	                  {filteredLessons.map((lesson, i) => (
	                    <VideoLessonCard key={lesson.id} lesson={lesson} index={i} />
	                  ))}
	                </div>
	              ) : (
	                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
	                  {filteredLessons.map((lesson, i) => (
	                    <LessonRow key={lesson.id} lesson={lesson} index={i} canManage={canManage} onEdit={openEdit} />
	                  ))}
	                </div>
	              )}
	            </div>
		          </section>
		        </main>

        <aside className="flex flex-col gap-6 lg:border-l lg:border-[var(--neutral-100)] lg:pl-8">
          <div className="rounded-[1.5rem] bg-[#F3F8EE] p-6">
            <p className="mb-1 font-extrabold text-[var(--green-700)]">Ya estás inscrito ✓</p>
            <p className="mb-5 text-[0.875rem] text-[var(--ink-soft)]">Continúa desde donde lo dejaste.</p>
            <Button
              type="button"
              variant="contained"
              onClick={() => setPathViewOpen(true)}
              fullWidth
              sx={{ borderRadius: '1rem', bgcolor: 'var(--green-600)', py: 1.45, fontFamily: 'var(--font-sans)', fontWeight: 900, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: 'var(--green-700)', boxShadow: 'none' } }}
            >
              Continuar curso
            </Button>
          </div>

          <div>
            <h3 className="mb-4 text-[1rem] font-extrabold text-[var(--ink)]">Este curso incluye</h3>
            <ul className="flex flex-col gap-3 text-[0.9063rem] text-[var(--ink-soft)]">
              <li className="flex items-center gap-3"><Icon icon={APP_ICONS.video} width={17} height={17} />{duration ?? 'Contenido'} de contenido</li>
              <li className="flex items-center gap-3"><Icon icon={APP_ICONS.book} width={17} height={17} />{lessons.length} lecciones</li>
	              <li className="flex items-center gap-3"><Icon icon={APP_ICONS.diplomaVerified} width={17} height={17} />{course.certificateIncluded ? 'Certificado al completar todo' : 'Este curso no emite certificado'}</li>
	              <li className="flex items-center gap-3"><Icon icon={APP_ICONS.shield} width={17} height={17} />Acceso {course.isFree ? 'gratuito' : 'según tu compra'}</li>
	            </ul>
	          </div>

	          {course.certificateIncluded && (
	            <div className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5">
	              <h3 className="mb-2 text-[1rem] font-extrabold text-[var(--ink)]">Certificado</h3>
	              <p className="mb-4 text-[0.875rem] leading-6 text-[var(--ink-soft)]">
	                {certificateRequest?.status === 'approved'
	                  ? 'Tu certificado ya fue aprobado y emitido — lo encontrás en Certificaciones.'
	                  : certificateRequest?.status === 'pending'
	                    ? 'Solicitud enviada — un admin o el instructor la tiene que aprobar.'
	                    : certificateEligibility?.eligible
	                      ? 'Cumples los requisitos: curso completo y exámenes aprobados.'
	                      : certificateEligibility?.reason ?? 'Completa el curso y aprueba los exámenes por tema para desbloquearlo.'}
	              </p>
	              <div className="mb-4 grid grid-cols-2 gap-2 text-[0.7813rem] font-semibold text-[var(--ink-soft)]">
	                <span>{certificateEligibility?.lessonsCompleted ?? 0}/{certificateEligibility?.lessonsTotal ?? lessons.length} lecciones</span>
	                <span>{certificateEligibility?.evaluationsPassed ?? 0}/{certificateEligibility?.evaluationsTotal ?? 0} exámenes</span>
	              </div>
	              {certificateRequest?.status === 'approved' && (
	                <Button
	                  type="button"
	                  variant="contained"
	                  disabled={certificateDownloading}
	                  onClick={() => void handleDownloadCertificate()}
	                  fullWidth
	                  sx={{ borderRadius: '1rem', mb: 1.25, bgcolor: 'var(--green-600)', py: 1.2, fontFamily: 'var(--font-sans)', fontWeight: 900, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: 'var(--green-700)', boxShadow: 'none' } }}
	                >
	                  {certificateDownloading ? 'Descargando…' : 'Descargar certificado'}
	                </Button>
	              )}
	              {certificateRequest?.status !== 'approved' && (
	              <Button
	                type="button"
	                variant="contained"
	                disabled={!certificateEligibility?.eligible || certificateBusy || certificateRequest?.status === 'pending'}
	                onClick={() => void handleRequestCertificate()}
	                fullWidth
	                sx={{ borderRadius: '1rem', bgcolor: 'var(--green-600)', py: 1.2, fontFamily: 'var(--font-sans)', fontWeight: 900, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: 'var(--green-700)', boxShadow: 'none' } }}
	              >
	                {certificateBusy
	                  ? 'Enviando…'
	                  : certificateRequest?.status === 'pending'
	                    ? 'Solicitud pendiente…'
	                    : certificateRequest?.status === 'rejected'
	                      ? 'Volver a solicitar certificado'
	                      : 'Solicitar certificado'}
	              </Button>
	              )}
	            </div>
	          )}

          <div className="border-y border-[var(--neutral-100)] py-6">
            <h3 className="mb-4 text-[1rem] font-extrabold text-[var(--ink)]">Tu instructor</h3>
            <div className="flex gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--blue-50)] text-xl font-extrabold text-[var(--blue-700)]">
                {instructorInitial(instructorName)}
              </span>
              <div>
                <p className="font-extrabold text-[var(--ink)]">{instructorName}</p>
                <p className="mt-1 text-[0.875rem] leading-6 text-[var(--ink-soft)]">Responsable de este curso y de sus clases, materiales y evaluaciones.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outlined" onClick={() => void handleShare()} sx={softButtonSx}><Icon icon={APP_ICONS.upload} width={16} height={16} /> Compartir</Button>
            <Button variant="outlined" disabled={favoriteBusy} onClick={() => void handleFavorite()} sx={softButtonSx}><Icon icon={APP_ICONS.star} width={16} height={16} /> {favorite ? 'Guardado' : 'Guardar'}</Button>
          </div>
          {feedback && <p className="rounded-2xl bg-[var(--green-50)] px-4 py-3 text-[0.8125rem] font-semibold text-[var(--green-700)]">{feedback}</p>}
        </aside>
      </div>

      <section className="rounded-[1.5rem] border border-[var(--neutral-100)] bg-white p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[1.15rem] font-extrabold text-[var(--ink)]">Reseñas del curso</h2>
            <p className="text-[0.875rem] text-[var(--ink-muted)]">
              {ratingLabel(averageRating, reviewCount)} · datos reales de alumnos inscritos.
            </p>
          </div>
          <div className="flex gap-1 text-[var(--yellow-600)]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className="text-[1.2rem] leading-none"
                aria-label={`${star} estrella${star === 1 ? '' : 's'}`}
              >
                {star <= reviewRating ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <AppInput
            multiline
            minRows={3}
            value={reviewComment}
            onChange={(event) => setReviewComment(event.target.value)}
            placeholder="Escribe qué te pareció el curso…"
          />
          <Button
            type="button"
            variant="contained"
            disabled={reviewBusy}
            onClick={() => void handleSubmitReview()}
            sx={{ alignSelf: 'flex-end', borderRadius: '999px', bgcolor: 'var(--green-600)', fontFamily: 'var(--font-sans)', fontWeight: 800, textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: 'var(--green-700)', boxShadow: 'none' } }}
          >
            {reviewBusy ? 'Guardando…' : 'Guardar reseña'}
          </Button>
        </div>
        {reviews.length > 0 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {reviews.slice(0, 4).map((review) => (
              <article key={review.id} className="rounded-2xl border border-[var(--neutral-100)] bg-[#F8FBF5] p-4">
                <div className="mb-1 text-[var(--yellow-600)]">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                <p className="text-[0.875rem] text-[var(--ink-soft)]">{review.comment || 'Sin comentario escrito.'}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <CreateLessonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        courseId={course.id}
        lesson={editingLesson}
        onSaved={handleSaved}
        onLiveSaved={handleLiveSaved}
      />

      {/* ── Sala en vivo — misma sala Jitsi efímera que /learning/live, unida por id de sesión ── */}
      <Modal
        open={activeLiveSession !== null}
        onClose={() => setActiveLiveSession(null)}
        title={activeLiveSession?.title ?? ''}
        description={activeLiveSession ? `${activeLiveSession.hostName} · ${formatScheduledAt(activeLiveSession.scheduledAt)}` : undefined}
        className="max-w-4xl"
      >
        {activeLiveSession && (
          <LiveClassRoom
            sessionId={activeLiveSession.id}
            userName={displayName}
            onLeave={() => setActiveLiveSession(null)}
          />
        )}
      </Modal>
    </div>
	  );
	}

function LessonRow({ lesson, index, canManage, onEdit }: Readonly<{
  lesson: Lesson;
  index: number;
  canManage: boolean;
  onEdit: (lesson: Lesson) => void;
}>) {
  const meta = contentTypeMeta(lesson.contentType);
  const { controls, content } = useLessonFileViewer(lesson);
  const [hovered, setHovered] = useState(false);

  return (
    /* `scroll-mt` reserva el espacio de la cabecera fija: sin él, al saltar
       desde la ruta de temas la fila queda tapada por la barra superior. */
    <div
      id={`lesson-${lesson.id}`}
      className="scroll-mt-24"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          padding: '14px 16px', borderRadius: 'var(--radius-md)',
          border: `1px solid ${hovered ? 'var(--green-200, #BFE3CC)' : 'var(--neutral-100)'}`,
          background: hovered ? 'var(--green-50, #F3FAF0)' : 'var(--panel)',
          boxShadow: hovered ? '0 4px 14px rgba(31,154,75,0.10)' : 'none',
          transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
          transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
        }}
      >
        <span style={{
          flexShrink: 0, width: '2rem', height: '2rem', borderRadius: '999px',
          background: 'var(--blue-50)', color: 'var(--blue-600)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 600,
        }}>
          {index + 1}
        </span>
        <Icon icon={meta.icon} width={18} height={18} style={{ flexShrink: 0, color: 'var(--ink-muted)' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.9063rem', fontWeight: 500, color: 'var(--ink)' }}>{lesson.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{meta.label}</div>
        </div>
        {controls}
        {lesson.durationMinutes ? (
          <span style={{ fontSize: '0.7813rem', color: 'var(--ink-muted)', flexShrink: 0 }}>
            {formatDuration(lesson.durationMinutes)}
          </span>
        ) : null}
        {canManage && (
          <IconButton
            onClick={() => onEdit(lesson)}
            aria-label={`Editar ${lesson.title}`}
            size="small"
            sx={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: '0.5rem',
              border: '1px solid var(--neutral-100)',
              bgcolor: 'var(--panel)',
              color: 'var(--ink-muted)', cursor: 'pointer',
              '&:hover': { bgcolor: 'var(--blue-50)', color: 'var(--blue-600)', borderColor: 'var(--blue-200)' },
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
        )}
      </div>
      {content}
    </div>
  );
}

/** Tarjeta de lección en video estilo YouTube — miniatura (frame extraído del
 * video en Cloudinary) + botón de play + duración; clic para reproducir en línea. */
function VideoLessonCard({ lesson, index }: Readonly<{ lesson: Lesson; index: number }>) {
  const { content, open, toggle } = useLessonFileViewer(lesson);
  const thumb = cloudinaryVideoThumbnail(lesson.fileUrl);
  const duration = formatDuration(lesson.durationMinutes);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5625rem' }}>
      <Button
        onClick={toggle}
        aria-label={open ? `Ocultar ${lesson.title}` : `Reproducir ${lesson.title}`}
        sx={{
          position: 'relative', width: '100%', aspectRatio: '16 / 9',
          borderRadius: 'var(--radius-md)', overflow: 'hidden', border: 'none', padding: 0,
          cursor: 'pointer', background: 'var(--bg-dark)',
          minWidth: 0,
          display: 'block',
          '&:hover': { background: 'var(--bg-dark)' },
        }}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon icon={APP_ICONS.video} width={38} height={38} style={{ color: 'rgba(255,255,255,0.45)' }} />
          </span>
        )}
        <span style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(14,26,38,0.25)',
        }}>
          <span style={{
            width: '2.875rem', height: '2.875rem', borderRadius: '50%', background: 'rgba(14,26,38,0.72)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </span>
        {duration && (
          <span style={{
            position: 'absolute', right: '0.375rem', bottom: '0.375rem', background: 'rgba(14,26,38,0.85)', color: '#fff',
            fontSize: '0.6875rem', fontWeight: 600, padding: '2px 6px', borderRadius: '0.25rem',
          }}>
            {duration}
          </span>
        )}
      </Button>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <span style={{
          flexShrink: 0, width: '1.375rem', height: '1.375rem', borderRadius: '999px',
          background: 'var(--blue-50)', color: 'var(--blue-600)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 600,
        }}>
          {index + 1}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.8438rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{lesson.title}</div>
          <div style={{ fontSize: '0.7188rem', color: 'var(--ink-muted)', marginTop: '2px' }}>Clase en video</div>
        </div>
      </div>

      {open && content}
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: Readonly<{ label: string; icon?: string; active: boolean; onClick: () => void }>) {
  const [hovered, setHovered] = useState(false);
  return (
    <Button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variant="text"
      disableRipple
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        border: 'none',
        bgcolor: 'transparent',
        fontFamily: 'var(--font-sans)',
        fontSize: 13.5,
        fontWeight: active ? 600 : 400,
        color: active ? 'var(--blue-600)' : hovered ? 'var(--ink)' : 'var(--ink-muted)',
        padding: '10px 14px',
        borderBottom: active ? '2.5px solid var(--blue-600)' : '2.5px solid transparent',
        marginBottom: '-2px',
        whiteSpace: 'nowrap',
        borderRadius: 0,
        textTransform: 'none',
        transition: 'color 0.15s ease, border-color 0.2s ease',
        '&:hover': { bgcolor: 'transparent' },
      }}
    >
      {icon && <Icon icon={icon} width={14} height={14} />}
      {label}
    </Button>
  );
}

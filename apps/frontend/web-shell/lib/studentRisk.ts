/* ───────────────────────────────────────────
   Riesgo de abandono por curso
   ───────────────────────────────────────────
   El riesgo es una propiedad DEL CURSO, no del alumno: alguien puede ir al día
   en un curso y estancado en otro, y al profesor le sirve saber en cuál hay que
   intervenir. El alumno se marca en riesgo si alguno de sus cursos lo está.

   Reglas de negocio:

   - Solo aplican a cursos comprados por **mensualidad**. Un curso de acceso
     permanente no tiene fecha límite, así que ir lento no significa lo mismo.
   - **En riesgo**: menos del 50 % de avance y más de 20 días desde la compra.
     Los dos a la vez — quien lleva tres días con poco avance no está en riesgo,
     acaba de empezar.
   - **Abandonado**: la inscripción está dada de baja.

   Cómo se distingue mensual de permanente
   ───────────────────────────────────────
   El servicio de aprendizaje no guarda `accessType`; lo guarda el de pagos, en
   otra base. Lo que sí queda en la inscripción es `endDate`, que solo se rellena
   en las compras mensuales (con la fecha de fin de acceso) y queda en null en
   las permanentes. Esa es la señal disponible sin cruzar servicios.
   ─────────────────────────────────────────── */

import type { Inscription } from './types';

/** Avance por debajo del cual un curso mensual entra en riesgo. */
export const RISK_MAX_PROGRESS = 50;

/** Días desde la compra que deben pasar antes de considerar que hay riesgo. */
export const RISK_MIN_DAYS = 20;

export type CourseRisk = 'none' | 'at-risk' | 'abandoned';

export type AccessType = 'monthly' | 'permanent';

/**
 * Tipo de acceso de una inscripción.
 *
 * `endDate` solo se rellena en compras mensuales — ver cabecera del archivo.
 */
export function accessTypeOf(inscription: Pick<Inscription, 'endDate'>): AccessType {
  return inscription.endDate ? 'monthly' : 'permanent';
}

/** Días transcurridos desde una fecha ISO. `null` si no hay fecha válida. */
export function daysSince(iso: string | null | undefined, now: number): number | null {
  if (!iso) return null;
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return null;
  return Math.floor((now - time) / 86_400_000);
}

/** Fecha de compra de la inscripción. */
function purchasedAt(inscription: Pick<Inscription, 'createdAt' | 'startDate'>): string | null {
  /* `startDate` se reescribe al renovar la mensualidad, así que la referencia
     es `createdAt`: los 20 días cuentan desde que compró el curso, no desde la
     última renovación. Si falta, se usa `startDate` como respaldo. */
  return inscription.createdAt ?? inscription.startDate ?? null;
}

export interface RiskAssessment {
  risk: CourseRisk;
  accessType: AccessType;
  /** Avance del curso, 0-100. */
  progress: number;
  /** Días desde la compra, o null si no se pudo determinar. */
  daysSincePurchase: number | null;
  /** Explicación en lenguaje natural, lista para mostrar. */
  reason: string | null;
}

/**
 * Evalúa un curso concreto de un alumno.
 *
 * No lanza ni asume: si falta la fecha de compra no se puede afirmar que hayan
 * pasado 20 días, así que no se marca riesgo. Es preferible no señalar a
 * señalar en falso.
 */
export function assessInscription(inscription: Inscription, now: number): RiskAssessment {
  const accessType = accessTypeOf(inscription);
  const progress = Number(inscription.progressPercentage ?? 0);
  const elapsed = daysSince(purchasedAt(inscription), now);

  const base: RiskAssessment = {
    risk: 'none',
    accessType,
    progress,
    daysSincePurchase: elapsed,
    reason: null,
  };

  // Abandono: solo tiene sentido sobre una mensualidad.
  if (accessType === 'monthly' && inscription.status === 'dropped') {
    return { ...base, risk: 'abandoned', reason: 'Suscripción mensual dada de baja' };
  }

  // El resto de reglas no aplican a acceso permanente ni a cursos terminados.
  if (accessType !== 'monthly') return base;
  if (inscription.status === 'completed' || progress >= 100) return base;

  if (progress < RISK_MAX_PROGRESS && elapsed !== null && elapsed > RISK_MIN_DAYS) {
    return {
      ...base,
      risk: 'at-risk',
      reason: `${Math.round(progress)} % de avance tras ${elapsed} días de mensualidad`,
    };
  }

  return base;
}

export interface StudentRiskSummary {
  /** Peor situación entre todos sus cursos. */
  level: CourseRisk;
  /** Cursos en riesgo, con su motivo. */
  atRisk: { title: string; reason: string }[];
  /** Cursos abandonados, con su motivo. */
  abandoned: { title: string; reason: string }[];
}

/**
 * Resume el riesgo de un alumno a partir de sus inscripciones.
 *
 * El abandono pesa más que el riesgo: si canceló un curso, es lo primero que
 * hay que ver aunque vaya bien en otro.
 */
export function assessStudent(inscriptions: Inscription[], now: number): StudentRiskSummary {
  const atRisk: { title: string; reason: string }[] = [];
  const abandoned: { title: string; reason: string }[] = [];

  for (const inscription of inscriptions) {
    const assessment = assessInscription(inscription, now);
    if (assessment.risk === 'none' || !assessment.reason) continue;
    const entry = {
      title: inscription.course?.title ?? 'Curso sin título',
      reason: assessment.reason,
    };
    if (assessment.risk === 'abandoned') abandoned.push(entry);
    else atRisk.push(entry);
  }

  let level: CourseRisk = 'none';
  if (abandoned.length > 0) level = 'abandoned';
  else if (atRisk.length > 0) level = 'at-risk';

  return { level, atRisk, abandoned };
}

/** Texto del banner del panel de detalle, nombrando los cursos afectados. */
export function riskMessage(summary: StudentRiskSummary): string | null {
  const list = (items: { title: string }[]) =>
    items.map((item) => `"${item.title}"`).join(', ');

  if (summary.abandoned.length > 0) {
    return summary.abandoned.length === 1
      ? `Dio de baja la mensualidad de ${list(summary.abandoned)}.`
      : `Dio de baja la mensualidad de ${summary.abandoned.length} cursos: ${list(summary.abandoned)}.`;
  }
  if (summary.atRisk.length > 0) {
    const detail = summary.atRisk.map((item) => `"${item.title}" (${item.reason})`).join('; ');
    return summary.atRisk.length === 1
      ? `Riesgo de abandono en ${detail}.`
      : `Riesgo de abandono en ${summary.atRisk.length} cursos: ${detail}.`;
  }
  return null;
}

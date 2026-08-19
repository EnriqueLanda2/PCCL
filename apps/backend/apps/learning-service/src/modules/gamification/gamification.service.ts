/* ───────────────────────────────────────────
   Gamificación — puntos, racha, insignias y tabla
   de posiciones.

   NO hay tablas propias: todo se DERIVA de lo que
   ya se registra al estudiar (LessonCompletion,
   EvaluationAttempt, Inscription). Es deliberado.

   El motivo: learning-service no publica eventos
   NATS — el único emit() del backend está en
   payment-service. Una tabla de puntos exigiría
   además emitir y consumir eventos en cada acción
   del alumno, y cualquier fallo dejaría el marcador
   desincronizado de la realidad sin forma de
   notarlo. Calculando al leer, el marcador no puede
   mentir: si el alumno completó la lección, los
   puntos existen.

   El precio es el costo por lectura. Si algún día
   pesa, el reemplazo natural es materializar ESTOS
   MISMOS números en una tabla, no cambiar las
   reglas.
   ─────────────────────────────────────────── */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/* ── Reglas de puntaje ──
   Valores enteros y pequeños a propósito: el número tiene que ser legible de
   un vistazo en el panel, no una cifra inflada que no signifique nada. */
const POINTS_PER_LESSON = 10;
/** Un examen aprobado vale más que una lección: cuesta más y demuestra más. */
const POINTS_PER_EVALUATION_PASSED = 25;
/** Aunque repruebes, intentarlo suma algo. Premiar el intento sostiene la racha. */
const POINTS_PER_EVALUATION_ATTEMPT = 5;
/** Terminar un curso completo es el hito grande del portal. */
const POINTS_PER_COURSE_COMPLETED = 100;

/* Zona horaria con la que se decide qué día calendario es cada actividad.

   Esto NO puede quedar a merced del reloj del cliente: si el navegador
   decidiera el día, un alumno en otro huso vería su racha romperse o
   duplicarse según dónde abriera la app, y dos alumnos con la misma actividad
   tendrían rachas distintas. Se fija en el servidor y punto. */
const STREAK_TIMEZONE = process.env.GAMIFICATION_TIMEZONE ?? 'America/Mexico_City';

/** Cuántos puestos devuelve la tabla de posiciones. */
const LEADERBOARD_SIZE = 10;

export interface BadgeResult {
  id: string;
  label: string;
  description: string;
  earned: boolean;
  /** Progreso hacia la insignia, para pintar "3 de 5" en las no conseguidas. */
  progress: number;
  target: number;
}

/**
 * Día calendario de una fecha en la zona horaria del portal, como 'YYYY-MM-DD'.
 *
 * Se usa `en-CA` porque su formato corto ya ES `YYYY-MM-DD`, así que evita
 * recomponer la cadena a mano a partir de las partes. El resultado se ordena
 * y compara como texto sin ambigüedad.
 */
function calendarDay(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: STREAK_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Resta días a un 'YYYY-MM-DD' y devuelve otro 'YYYY-MM-DD'. */
function shiftDay(day: string, deltaDays: number): string {
  /* Se ancla a mediodía UTC: a medianoche, un corrimiento de zona horaria de
     ±12 h podría caer en el día anterior o siguiente al restar. */
  const anchor = new Date(`${day}T12:00:00Z`);
  anchor.setUTCDate(anchor.getUTCDate() + deltaDays);
  return anchor.toISOString().slice(0, 10);
}

@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fechas en las que el alumno hizo algo que cuenta: completar una lección o
   * responder un examen. Es la materia prima tanto de la racha como del
   * historial de actividad.
   */
  private async activityDates(userId: string): Promise<Date[]> {
    const [lessons, attempts] = await Promise.all([
      this.prisma.lessonCompletion.findMany({
        where: { userId },
        select: { completedAt: true },
      }),
      this.prisma.evaluationAttempt.findMany({
        where: { studentId: userId },
        select: { createdAt: true },
      }),
    ]);

    return [
      ...lessons.map((l) => l.completedAt),
      ...attempts.map((a) => a.createdAt),
    ];
  }

  /**
   * Racha de días consecutivos con actividad.
   *
   * Cuenta hacia atrás desde hoy, y si hoy todavía no hay actividad arranca
   * desde ayer: a media mañana la racha de alguien que estudió anoche sigue
   * viva, y romperla por no haber abierto la app aún sería un castigo absurdo.
   * Al segundo día sin actividad ya no hay nada que contar y devuelve 0.
   */
  private computeStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    const activeDays = new Set(dates.map(calendarDay));
    const today = calendarDay(new Date());

    let cursor = activeDays.has(today) ? today : shiftDay(today, -1);
    if (!activeDays.has(cursor)) return 0;

    let streak = 0;
    while (activeDays.has(cursor)) {
      streak++;
      cursor = shiftDay(cursor, -1);
    }
    return streak;
  }

  /** Racha más larga alcanzada alguna vez, para mostrarla como récord personal. */
  private computeLongestStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    const days = [...new Set(dates.map(calendarDay))].sort();
    let longest = 1;
    let current = 1;

    for (let i = 1; i < days.length; i++) {
      if (days[i] === shiftDay(days[i - 1], 1)) current++;
      else current = 1;
      if (current > longest) longest = current;
    }
    return longest;
  }

  /**
   * Números crudos del alumno. Los comparten el resumen y las insignias, así
   * que se calculan una sola vez por petición.
   */
  private async rawTotals(userId: string) {
    const [lessonsCompleted, attempts, inscriptions, evaluations] = await Promise.all([
      this.prisma.lessonCompletion.count({ where: { userId } }),
      this.prisma.evaluationAttempt.findMany({
        where: { studentId: userId },
        select: { evaluationId: true, score: true },
      }),
      this.prisma.inscription.findMany({
        where: { userId },
        select: { status: true },
      }),
      this.prisma.evaluation.findMany({ select: { id: true, passingScore: true } }),
    ]);

    /* Solo cuenta el MEJOR intento de cada examen: si contáramos todos, repetir
       un examen ya aprobado sería una máquina de fabricar puntos. */
    const passingById = new Map(evaluations.map((e) => [e.id, e.passingScore]));
    const bestByEvaluation = new Map<string, number>();
    for (const attempt of attempts) {
      const score = Number(attempt.score ?? 0);
      const previous = bestByEvaluation.get(attempt.evaluationId) ?? 0;
      if (score > previous) bestByEvaluation.set(attempt.evaluationId, score);
    }

    let evaluationsPassed = 0;
    for (const [evaluationId, best] of bestByEvaluation) {
      if (best >= (passingById.get(evaluationId) ?? 100)) evaluationsPassed++;
    }

    return {
      lessonsCompleted,
      evaluationsPassed,
      evaluationsAttempted: bestByEvaluation.size,
      coursesCompleted: inscriptions.filter((i) => i.status === 'completed').length,
      coursesEnrolled: inscriptions.length,
    };
  }

  private totalPoints(totals: Awaited<ReturnType<GamificationService['rawTotals']>>): number {
    return (
      totals.lessonsCompleted * POINTS_PER_LESSON +
      totals.evaluationsPassed * POINTS_PER_EVALUATION_PASSED +
      totals.evaluationsAttempted * POINTS_PER_EVALUATION_ATTEMPT +
      totals.coursesCompleted * POINTS_PER_COURSE_COMPLETED
    );
  }

  /**
   * Nivel a partir de los puntos, con umbrales que se separan progresivamente
   * (100, 300, 600, 1000…): subir de nivel al principio es rápido para
   * enganchar, y después cuesta, para que el nivel signifique algo.
   */
  private levelFor(points: number) {
    let level = 1;
    let threshold = 100;
    let previous = 0;

    while (points >= threshold) {
      level++;
      previous = threshold;
      threshold += level * 100;
    }

    return {
      level,
      pointsIntoLevel: points - previous,
      pointsForNextLevel: threshold - previous,
      nextLevelAt: threshold,
    };
  }

  private buildBadges(
    totals: Awaited<ReturnType<GamificationService['rawTotals']>>,
    longestStreak: number,
  ): BadgeResult[] {
    const definitions: Array<Omit<BadgeResult, 'earned'>> = [
      {
        id: 'first-lesson',
        label: 'Primer paso',
        description: 'Completa tu primera lección',
        progress: totals.lessonsCompleted,
        target: 1,
      },
      {
        id: 'ten-lessons',
        label: 'Constante',
        description: 'Completa 10 lecciones',
        progress: totals.lessonsCompleted,
        target: 10,
      },
      {
        id: 'fifty-lessons',
        label: 'Maratonista',
        description: 'Completa 50 lecciones',
        progress: totals.lessonsCompleted,
        target: 50,
      },
      {
        id: 'first-evaluation',
        label: 'A prueba',
        description: 'Aprueba tu primer examen',
        progress: totals.evaluationsPassed,
        target: 1,
      },
      {
        id: 'five-evaluations',
        label: 'Examinado',
        description: 'Aprueba 5 exámenes',
        progress: totals.evaluationsPassed,
        target: 5,
      },
      {
        id: 'first-course',
        label: 'Meta cumplida',
        description: 'Termina un curso completo',
        progress: totals.coursesCompleted,
        target: 1,
      },
      {
        id: 'three-courses',
        label: 'Coleccionista',
        description: 'Termina 3 cursos',
        progress: totals.coursesCompleted,
        target: 3,
      },
      {
        id: 'streak-3',
        label: 'En racha',
        description: 'Estudia 3 días seguidos',
        progress: longestStreak,
        target: 3,
      },
      {
        id: 'streak-7',
        label: 'Semana perfecta',
        description: 'Estudia 7 días seguidos',
        progress: longestStreak,
        target: 7,
      },
    ];

    return definitions.map((badge) => ({
      ...badge,
      /* El progreso se tope al objetivo: "12 de 10" se lee como un error. */
      progress: Math.min(badge.progress, badge.target),
      earned: badge.progress >= badge.target,
    }));
  }

  /** Resumen completo de un alumno: puntos, nivel, racha, totales e insignias. */
  async summary(userId: string) {
    const [totals, dates] = await Promise.all([
      this.rawTotals(userId),
      this.activityDates(userId),
    ]);

    const points = this.totalPoints(totals);
    const longestStreak = this.computeLongestStreak(dates);
    const badges = this.buildBadges(totals, longestStreak);

    return {
      userId,
      points,
      ...this.levelFor(points),
      currentStreak: this.computeStreak(dates),
      longestStreak,
      totals,
      badges,
      badgesEarned: badges.filter((b) => b.earned).length,
      timezone: STREAK_TIMEZONE,
    };
  }

  /**
   * Tabla de posiciones.
   *
   * Devuelve SOLO userId y puntos: learning-service no conoce los nombres, que
   * viven en la base de identity-service. El gateway es quien los cruza — así
   * este servicio no depende de otro para responder.
   *
   * Con `courseId` la tabla se acota a los inscritos en ese curso, que es el
   * uso sano por defecto: competir contra tus compañeros de curso motiva;
   * competir contra un desconocido a mitad de otro plan de estudios, no.
   */
  async leaderboard(params: { courseId?: string; limit?: number } = {}) {
    const limit = params.limit ?? LEADERBOARD_SIZE;

    const inscriptions = await this.prisma.inscription.findMany({
      where: params.courseId ? { courseId: params.courseId } : undefined,
      select: { userId: true },
      distinct: ['userId'],
    });

    const rows = await Promise.all(
      inscriptions.map(async ({ userId }) => {
        const [totals, dates] = await Promise.all([
          this.rawTotals(userId),
          this.activityDates(userId),
        ]);
        return {
          userId,
          points: this.totalPoints(totals),
          currentStreak: this.computeStreak(dates),
          lessonsCompleted: totals.lessonsCompleted,
        };
      }),
    );

    return rows
      .sort((a, b) => b.points - a.points || b.lessonsCompleted - a.lessonsCompleted)
      .slice(0, limit)
      .map((row, index) => ({ ...row, position: index + 1 }));
  }
}

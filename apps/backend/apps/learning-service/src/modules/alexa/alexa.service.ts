import { BadRequestException, Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '../../prisma/generated';
import { LiveSessionsService } from '../live-sessions/live-sessions.service';

/* Mismo criterio que ChatService (AIRumbo): tope de espera a Ollama antes de
   rendirnos, para que Alexa nunca se quede "pensando" indefinidamente. */
const OLLAMA_TIMEOUT_MS = 100_000;
const AIRUMBO_UNAVAILABLE_MESSAGE =
  'AIRumbo no está disponible en este momento. Intenta de nuevo más tarde.';
const VALID_OPTIONS = ['A', 'B', 'C', 'D'] as const;
const TRIVIA_COUNTS = [3, 5, 10, 20] as const;

interface ScheduleClassInput {
  topic: string;
  date: string;
  time: string;
}

interface GenerateTriviaInput {
  topic: string;
  count: number;
}

interface SaveTriviaResultInput {
  alexaUserId: string;
  topic: string;
  total: number;
  correct: number;
  score: number;
  answers: unknown[];
}

/* export: el controller expone un método que devuelve este tipo, y sin
   exportarlo `tsc --noEmit` truena con TS4053 (tipo innombrable). */
export interface TriviaQuestion {
  id: string;
  topic: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: string;
  explanation: string;
}

/**
 * Puente real entre la skill de Alexa y PCCL. No hay nada simulado aquí:
 *
 *  · agendar clase   → crea/reutiliza una fila real en `live_sessions`, la
 *                       misma tabla que alimenta la página de clases en vivo
 *                       de la web (ver LiveSessionsService).
 *  · trivia          → AIRumbo (Ollama) genera las preguntas a partir del
 *                       contenido real de las lecciones del curso, nunca de
 *                       un tema inventado por el alumno.
 *  · progreso        → se calcula desde `alexa_trivia_results`, la tabla
 *                       donde queda cada resultado real contestado por voz.
 *
 * Como la skill no tiene Cognito ni account linking (fuera de alcance del
 * curso), la cuenta de PCCL a la que Alexa agenda clases es una sola,
 * configurada por variables de entorno (ver .env.example). El id de Alexa
 * (`alexaUserId`) sí se usa para separar el progreso de cada dispositivo de
 * Alexa que use la skill.
 */
@Injectable()
export class AlexaService {
  private readonly logger = new Logger(AlexaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly liveSessions: LiveSessionsService,
  ) {}

  /** Cuenta real de PCCL bajo la que Alexa agenda clases: debe ser admin o
      instructor para que la clase aparezca en su propia vista de "clases en
      vivo" sin depender de estar inscrito en un curso. */
  private linkedHost(): { email: string } {
    const email = process.env.ALEXA_LINKED_USER_EMAIL?.trim();
    if (!email) {
      throw new ServiceUnavailableException(
        'La skill de Alexa no está configurada: falta ALEXA_LINKED_USER_EMAIL en el backend de PCCL.',
      );
    }
    return { email };
  }

  private linkedUserId(): string {
    const userId = process.env.ALEXA_LINKED_USER_ID?.trim();
    if (!userId) {
      throw new ServiceUnavailableException(
        'La skill de Alexa no está configurada: falta ALEXA_LINKED_USER_ID en el backend de PCCL.',
      );
    }
    return userId;
  }

  /** Empareja el tema que dice el alumno con un curso publicado real de
      PCCL. Sin esto, la trivia podría hablar de cualquier cosa que AIRumbo
      alucine en vez de limitarse al contenido real de la plataforma —
      exactamente lo que el requerimiento de la skill prohíbe (I y II del
      documento de requerimientos). */
  private async findCourseByTopic(topic: string) {
    const clean = topic.trim().toLowerCase();
    if (!clean) return null;

    const courses = await this.prisma.course.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        title: true,
        phases: { select: { id: true }, orderBy: { order: 'asc' }, take: 1 },
      },
    });

    return (
      courses.find((c) => c.title.toLowerCase() === clean) ??
      courses.find(
        (c) => c.title.toLowerCase().includes(clean) || clean.includes(c.title.toLowerCase()),
      ) ??
      null
    );
  }

  /* Lista los cursos publicados reales: la skill de Alexa la usa para
     sincronizar en caliente (Dynamic Entities) el catálogo de temas que
     reconoce, en vez de tener una lista fija en el modelo de interacción
     que se desactualiza cada vez que se publica o retira un curso. */
  async listCourseTopics() {
    const courses = await this.prisma.course.findMany({
      where: { status: 'published' },
      select: { title: true },
      orderBy: { title: 'asc' },
    });
    return { topics: courses.map((c) => c.title) };
  }

  /* ─── AGENDAR CLASE ───
     PCCL es la fuente de verdad: la fila se crea en `live_sessions` antes de
     que Alexa confirme nada, así que si esto falla, Alexa nunca dice que la
     clase quedó agendada. */
  async scheduleClass(input: ScheduleClassInput) {
    const topic = input.topic?.trim();
    if (!topic || !input.date || !input.time) {
      throw new BadRequestException('Falta el tema, la fecha o la hora de la clase.');
    }

    /* -06:00 fija la hora como horario de México (sin horario de verano
       desde 2022). Sin esto, "22:00" que dijo el alumno por voz se
       interpretaba como 22:00 UTC (16:00 México) y la clase quedaba
       guardada 6 horas antes de lo que Alexa confirmó. */
    const scheduledAt = new Date(`${input.date}T${input.time}:00-06:00`);
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new BadRequestException('La fecha o la hora no son válidas.');
    }
    if (scheduledAt.getTime() <= Date.now()) {
      throw new BadRequestException('Esa fecha u hora ya pasó. Elige una fecha futura.');
    }

    const course = await this.findCourseByTopic(topic);
    if (!course) {
      throw new NotFoundException(`No encontré un curso activo de "${topic}" en PCCL.`);
    }

    const { email } = this.linkedHost();
    const title = `Clase de ${topic}`;

    /* Repetir la misma solicitud (p. ej. Alexa reintentando un request) debe
       devolver la misma clase, no duplicarla — lo pide la rúbrica. */
    const existing = await this.prisma.liveSession.findFirst({
      where: { createdBy: email, title, scheduledAt },
    });
    if (existing) return this.toAgendaResponse(existing, topic, input.date, input.time);

    /* Solo se ata al curso si además tiene una fase: create() exige fase
       cuando hay courseId (ver assertPhase en LiveSessionsService), y un
       curso publicado sin fases no tiene dónde encajar la clase. */
    const phaseId = course.phases[0]?.id;

    const created = await this.liveSessions.create(
      {
        title,
        scheduledAt: scheduledAt.toISOString(),
        courseId: phaseId ? course?.id : undefined,
        phaseId,
      },
      email,
    );

    return this.toAgendaResponse(created, topic, input.date, input.time);
  }

  private toAgendaResponse(
    session: { id: string },
    topic: string,
    date: string,
    time: string,
  ) {
    return { id: session.id, topic, date, time };
  }

  /* ─── TRIVIA CON AIRumbo ─── */
  async generateTrivia(input: GenerateTriviaInput) {
    const topic = input.topic?.trim();
    if (!topic) throw new BadRequestException('Falta el tema de la trivia.');
    if (!TRIVIA_COUNTS.includes(input.count as (typeof TRIVIA_COUNTS)[number])) {
      throw new BadRequestException('Solo se permiten trivias de 3, 5, 10 o 20 preguntas.');
    }

    const course = await this.findCourseByTopic(topic);
    if (!course) {
      throw new NotFoundException(`No encontré un curso activo de "${topic}" en PCCL.`);
    }

    const lessons = await this.prisma.lesson.findMany({
      where: { courseId: course.id },
      select: { title: true, content: true },
      orderBy: { createdAt: 'asc' },
      /* Alexa debe contestar en pocos segundos. Mandar doce lecciones largas
         al modelo 7B gastaba la mayor parte del tiempo en procesar entrada,
         antes incluso de generar una pregunta. Tres extractos conservan la
         base real del curso y hacen viable una trivia corta por voz. */
      take: 3,
    });

    const material = lessons.length
      ? lessons.map((l) => `- ${l.title}: ${l.content.slice(0, 250)}`).join('\n')
      : `Curso: ${course.title} (sin lecciones todavía; genera preguntas generales sobre el título del curso).`;

    const questions = await this.askAIRumboForTrivia(course.title, material, input.count);
    return { courseId: course.id, topic: course.title, questions };
  }

  private async askAIRumboForTrivia(
    courseTitle: string,
    material: string,
    count: number,
  ): Promise<TriviaQuestion[]> {
    const systemPrompt =
      `Eres AIRumbo, el asistente de IA de la plataforma de cursos PCCL. Un alumno quiere repasar ` +
      `para su examen del curso "${courseTitle}" contestando una trivia de opción múltiple por voz con Alexa. ` +
      `Básate ÚNICAMENTE en el siguiente material real del curso, no inventes temas fuera de él:\n\n${material}\n\n` +
      `Responde ÚNICAMENTE con un JSON válido, sin texto adicional ni markdown, con esta forma exacta: ` +
      `{"questions":[{"question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correctAnswer":"A","explanation":"..."}]}. ` +
      `Genera exactamente ${count} preguntas distintas entre sí, completamente en español mexicano, claras para leerse en voz alta. ` +
      `Está PROHIBIDO usar caracteres chinos, japoneses o coreanos; traduce cualquier texto del material al español. ` +
      `Sé breve: pregunta de máximo 100 caracteres, cada opción de máximo 50 y explicación de máximo 120. ` +
      `"correctAnswer" debe ser siempre una de "A", "B", "C" o "D".`;

    /* Da espacio suficiente para JSON válido, sin permitir que una trivia de
       tres preguntas monopolice la ventana de respuesta de Alexa. */
    const raw = await this.callOllamaJson(
      [{ role: 'system', content: systemPrompt }],
      count <= 3 ? 900 : undefined,
    );

    let parsed: { questions?: unknown };
    try {
      parsed = JSON.parse(raw) as { questions?: unknown };
    } catch {
      throw new ServiceUnavailableException(AIRUMBO_UNAVAILABLE_MESSAGE);
    }

    const rawQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];
    const hasAsianCharacters = (value: string) => /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/u.test(value);
    const valid = rawQuestions.filter((q): q is {
      question: string;
      options: Record<string, string>;
      correctAnswer: string;
      explanation?: string;
    } => {
      const item = q as Record<string, unknown> | null;
      if (!item || typeof item.question !== 'string' || typeof item.correctAnswer !== 'string') return false;
      const options = item.options as Record<string, unknown> | undefined;
      if (!options) return false;
      const hasAllOptions = VALID_OPTIONS.every((k) => typeof options[k] === 'string' && (options[k] as string).length > 0);
      const text = [item.question, ...VALID_OPTIONS.map((k) => options[k] as string), typeof item.explanation === 'string' ? item.explanation : ''].join(' ');
      return hasAllOptions && !hasAsianCharacters(text) && VALID_OPTIONS.includes(item.correctAnswer.toUpperCase() as (typeof VALID_OPTIONS)[number]);
    });

    if (valid.length < count) {
      this.logger.warn(`AIRumbo devolvió ${valid.length}/${count} preguntas válidas para "${courseTitle}"`);
      throw new ServiceUnavailableException(
        'AIRumbo no pudo generar suficientes preguntas para esta trivia. Intenta de nuevo.',
      );
    }

    return valid.slice(0, count).map((q, index) => ({
      id: String(index + 1),
      topic: courseTitle,
      question: q.question.trim(),
      options: {
        A: q.options.A,
        B: q.options.B,
        C: q.options.C,
        D: q.options.D,
      },
      correctAnswer: q.correctAnswer.toUpperCase(),
      explanation: (q.explanation ?? '').trim(),
    }));
  }

  private async callOllamaJson(
    messages: { role: string; content: string }[],
    numPredict?: number,
  ): Promise<string> {
    const url = process.env.OLLAMA_URL ?? 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL ?? 'llama3.1';
    const basicAuthUser = process.env.OLLAMA_BASIC_AUTH_USERNAME?.trim();
    const basicAuthPass = process.env.OLLAMA_BASIC_AUTH_PASSWORD?.trim();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (basicAuthUser && basicAuthPass) {
      headers.Authorization = `Basic ${Buffer.from(`${basicAuthUser}:${basicAuthPass}`).toString('base64')}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(`${url}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          format: 'json',
          keep_alive: '30m',
          ...(numPredict ? { options: { num_predict: numPredict, temperature: 0.2 } } : {}),
        }),
        signal: controller.signal,
      });
    } catch {
      throw new ServiceUnavailableException(AIRUMBO_UNAVAILABLE_MESSAGE);
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) throw new ServiceUnavailableException(AIRUMBO_UNAVAILABLE_MESSAGE);

    const data = (await res.json()) as { message?: { content?: string } };
    const reply = data.message?.content?.trim();
    if (!reply) throw new ServiceUnavailableException(AIRUMBO_UNAVAILABLE_MESSAGE);
    return reply;
  }

  /* ─── GUARDAR RESULTADO ───
     Se persiste antes de que Alexa diga el puntaje final: si esto falla, el
     backend de Alexa (index.js) le pide al alumno reintentar en vez de
     anunciar un resultado que la web nunca vería. */
  async saveTriviaResult(input: SaveTriviaResultInput) {
    const topic = input.topic?.trim();
    if (!topic) throw new BadRequestException('Falta el tema de la trivia.');
    if (!Number.isFinite(input.total) || input.total <= 0) {
      throw new BadRequestException('El resultado de la trivia es inválido.');
    }

    const course = await this.findCourseByTopic(topic);

    const saved = await this.prisma.alexaTriviaResult.create({
      data: {
        userId: this.linkedUserId(),
        alexaUserId: input.alexaUserId,
        courseId: course?.id,
        topic: course?.title ?? topic,
        total: input.total,
        correct: input.correct,
        score: input.score,
        answers: (input.answers ?? []) as Prisma.InputJsonValue,
      },
    });

    return { id: saved.id, saved: true };
  }

  /* ─── PROGRESO REAL ───
     Se filtra por el id de Alexa (no por la cuenta enlazada) para que el
     progreso hablado corresponda exactamente a quién le está preguntando —
     y para que repetir la pregunta siempre devuelva el mismo resultado
     mientras no haya trivias nuevas, como pide la rúbrica. */
  async getProgress(alexaUserId: string) {
    const results = await this.prisma.alexaTriviaResult.findMany({
      where: { alexaUserId },
      orderBy: { createdAt: 'desc' },
    });

    if (results.length === 0) {
      return {
        totalTrivias: 0,
        averageScore: 0,
        weakTopic: null,
        recommendation: 'Aún no tienes trivias registradas. Puedes decir quiero estudiar para mi examen.',
      };
    }

    const averageScore = Math.round(
      results.reduce((sum, r) => sum + r.score, 0) / results.length,
    );

    const byTopic = new Map<string, { sum: number; count: number }>();
    for (const r of results) {
      const acc = byTopic.get(r.topic) ?? { sum: 0, count: 0 };
      acc.sum += r.score;
      acc.count += 1;
      byTopic.set(r.topic, acc);
    }

    let weakTopic: string | null = null;
    let weakAverage = Infinity;
    for (const [topic, acc] of byTopic) {
      const avg = acc.sum / acc.count;
      if (avg < weakAverage) {
        weakAverage = avg;
        weakTopic = topic;
      }
    }

    return {
      totalTrivias: results.length,
      averageScore,
      weakTopic,
      recommendation: this.recommendationFor(averageScore, weakTopic),
    };
  }

  private recommendationFor(averageScore: number, weakTopic: string | null): string {
    if (averageScore >= 90) {
      return 'Vas excelente, sigue practicando para mantener el ritmo.';
    }
    if (averageScore >= 70) {
      return weakTopic
        ? `Vas bien. Practica un poco más ${weakTopic} antes de tu examen.`
        : 'Vas bien, sigue así.';
    }
    return weakTopic
      ? `Necesitas reforzar ${weakTopic}. Te recomiendo repasarlo o agendar una clase de ese tema.`
      : 'Necesitas repasar más antes de tu examen.';
  }
}

import { BadRequestException, ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { SendChatMessageDto } from './dtos/send-chat-message.dto';

/* Cuántos mensajes previos del hilo se mandan como historial al modelo.
   Menos historial = prompt más corto = respuestas más rápidas y consistentes
   en hardware modesto (CPU, sin GPU dedicada). */
const HISTORY_WINDOW = 6;

/* Tope de conversaciones distintas por alumno. El historial dentro de cada
   conversación NO se limita aquí: ese contexto se manda a la IA local y lo
   que sí acotamos es solo cuántos hilos simultáneos puede conservar cada
   usuario. */
const MAX_CONVERSATIONS_PER_USER = 10;
const OLLAMA_UNAVAILABLE_MESSAGE =
  'Por el momento estoy desconectada. Intenta de nuevo más tarde o contacta a soporte si el problema continúa.';

/* Tiempo máximo que esperamos a Ollama antes de rendirnos. Sin esto, un
   fetch() sin abortar podía quedarse esperando indefinidamente si Ollama se
   trababa, dejando al alumno viendo los puntitos para siempre sin ni
   siquiera el mensaje de error. */
const OLLAMA_TIMEOUT_MS = 100_000;

/* Igual que canManageCourses() en el gateway: quien tiene uno de estos roles
   puede ver el contenido de cualquier lección sin estar inscrito. */
const COURSE_MANAGER_ROLES = ['admin', 'instructor', 'profesor'];

const CONVERSATION_TITLE_MAX_LENGTH = 60;
const VALID_CATALOG_PATH = '/learning/catalog';

function truncateTitle(text: string, max = CONVERSATION_TITLE_MAX_LENGTH): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

const SYSTEM_PROMPT =
  'Eres AIRumbo, el asistente de IA de la plataforma de cursos Rumbo. ' +
  'Ayudas a los alumnos a resolver dudas sobre el contenido de sus lecciones y sobre el catálogo de cursos. ' +
  'Rumbo es una plataforma de cursos en línea donde los usuarios pueden: explorar un catálogo de cursos e inscribirse, ' +
  'ver lecciones (texto, video o documentos) y llevar notas, hacer evaluaciones y ver sus calificaciones, ' +
  'participar en clases en vivo, obtener certificados al terminar un curso, comentar y reseñar cursos, ' +
  'y (para profesores/administradores) crear y publicar cursos, gestionar inscripciones y alumnos, y ver estadísticas de ganancias. ' +
  'Tú, AIRumbo, eres el asistente de IA integrado en la plataforma para resolver dudas. ' +
  'Responde en español, de forma clara y breve: ve directo a la respuesta, sin relleno ni repetir la pregunta. ' +
  'No escribas tanto texto — la mayoría de tus respuestas deben caber en 2-4 líneas cortas; solo extiéndete si el alumno pide explícitamente una explicación detallada. ' +
  'Usa **negritas** para resaltar términos clave y listas con guiones cuando enumeres varias cosas. ' +
  'Usa entre 2 y 4 emojis relevantes por respuesta (por ejemplo al inicio del saludo y junto a ideas clave) para sonar cálido y cercano, sin ponerlos en cada línea ni exagerar. ' +
  'IMPORTANTE: solo menciona cursos que aparezcan en la lista de "Catálogo de cursos disponibles" que se te da abajo. ' +
  'Nunca inventes cursos, nombres de cursos ni contenido que no esté en esa lista o en el contexto de la lección. ' +
  'NUNCA inventes URLs, slugs, rutas, dominios ni links de cursos. ' +
  'Solo puedes usar enlaces que aparezcan explícitamente en la lista de "Enlaces válidos" que se te da abajo. ' +
  'Si un curso no trae un enlace explícito, NO pongas ningún link para ese curso: indica solamente que el alumno lo busque en el catálogo. ' +
  'Si el alumno pregunta por algo que no está en el catálogo, dile honestamente que no existe ese curso en la plataforma. ' +
  'LÍMITE DE TEMA — SÍ puedes responder: (a) qué es la plataforma Rumbo, cómo funciona, qué se puede hacer en ella, cómo navegarla o usar sus funciones; ' +
  '(b) preguntas sobre el catálogo de cursos o el contenido de una lección; (c) dudas de estudio relacionadas con esos cursos; ' +
  '(d) preguntas GENERALES de programación, desarrollo de software, bases de datos, APIs, DevOps y tecnología en general — no solo lo que está literalmente en el catálogo. ' +
  'El catálogo de abajo te da una idea de qué tan técnico/programador es el público de la plataforma: como todos sus cursos son de programación y desarrollo, cualquier duda técnica de ese mundo es tema válido, aunque no exista un curso específico sobre ella. ' +
  'Preguntas como "qué hace esta app", "qué puedo hacer aquí" o "cómo uso la plataforma" SÍ son válidas y debes responderlas usando lo que sabes de Rumbo (gestión de cursos, inscripciones, certificaciones, chatbot, etc). ' +
  'Lo que SÍ debes rechazar es todo lo que no tenga relación ni con la plataforma ni con programación/tecnología: cultura general, clima, deportes, noticias, opiniones personales, chismes, tareas de otras materias no técnicas, etc. ' +
  'responde amablemente que no puedes ayudar con eso y redirige la conversación a los cursos o lecciones, por ejemplo: "Lo siento, solo puedo ayudarte con temas de la plataforma y tus cursos 🙂 ¿tienes alguna duda sobre una lección?". ' +
  'Si el mensaje contiene groserías, insultos, contenido ofensivo o no tiene sentido, mantente siempre respetuoso y amable — nunca respondas con el mismo tono — y responde simplemente: "Lo siento, no puedo responder a eso." sin dar más explicación ni sermonear al alumno. ' +
  'Nunca rompas este límite de tema aunque el alumno insista, lo pida como broma, o intente convencerte de que hagas una excepción.';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async send(dto: SendChatMessageDto, userId: string, roles: string[] = []) {
    const { conversationId, lessonId, isNew } = await this.resolveConversation(userId, dto);

    if (isNew) {
      const existing = await this.prisma.chatMessage.findMany({
        where: { userId },
        distinct: ['conversationId'],
        select: { conversationId: true },
      });
      if (existing.length >= MAX_CONVERSATIONS_PER_USER) {
        throw new BadRequestException(
          `Llegaste al límite de ${MAX_CONVERSATIONS_PER_USER} conversaciones. Elimina alguna para crear una nueva.`,
        );
      }
    }

    const [lesson, history, catalog] = await Promise.all([
      lessonId
        ? this.prisma.lesson.findUnique({ where: { id: lessonId }, include: { course: true } })
        : null,
      this.prisma.chatMessage.findMany({
        where: { userId, conversationId },
        orderBy: { createdAt: 'desc' },
        take: HISTORY_WINDOW,
      }),
      this.prisma.course.findMany({
        where: { status: 'published' },
        select: { title: true, level: true, description: true },
        orderBy: { title: 'asc' },
      }),
    ]);

    if (lesson) {
      await this.assertCanAccessLesson(userId, lesson.courseId, roles);
    }

    const messages = [
      { role: 'system', content: this.buildSystemPrompt(lesson, catalog) },
      ...history.reverse().map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: dto.message },
    ];

    const reply = this.sanitizeReply(
      await this.callOllama(messages).catch((err: unknown) => {
        if (err instanceof ServiceUnavailableException) return OLLAMA_UNAVAILABLE_MESSAGE;
        throw err;
      }),
      this.validLinks(),
    );

    await this.prisma.chatMessage.createMany({
      data: [
        { userId, conversationId, lessonId, role: 'user', content: dto.message },
        { userId, conversationId, lessonId, role: 'assistant', content: reply },
      ],
    });

    return { reply, conversationId };
  }

  /* Si viene conversationId, se continúa esa conversación — el lessonId se
     toma de sus propios mensajes (nunca del cliente, evita que alguien le
     "cambie de tema" a una conversación ajena inyectando otro lessonId). Si
     no existe o no es del usuario, se trata como una conversación nueva. */
  private async resolveConversation(
    userId: string,
    dto: SendChatMessageDto,
  ): Promise<{ conversationId: string; lessonId: string | null; isNew: boolean }> {
    if (dto.conversationId) {
      const existing = await this.prisma.chatMessage.findFirst({
        where: { userId, conversationId: dto.conversationId },
        select: { lessonId: true },
      });
      if (existing) {
        return { conversationId: dto.conversationId, lessonId: existing.lessonId, isNew: false };
      }
    }
    return { conversationId: dto.conversationId ?? randomUUID(), lessonId: dto.lessonId ?? null, isNew: true };
  }

  /* Sin esto, cualquier usuario autenticado podía pasar el lessonId de un
     curso de pago ajeno y AIRumbo le filtraba el contenido completo de esa
     lección dentro de la respuesta. Mismo criterio que canManageCourses()
     en el gateway: instructor/admin pasan siempre; el resto necesita estar
     inscrito en el curso de esa lección. */
  private async assertCanAccessLesson(userId: string, courseId: string, roles: string[]) {
    if (roles.some((r) => COURSE_MANAGER_ROLES.includes(r))) return;
    const inscription = await this.prisma.inscription.findFirst({
      where: { userId, courseId },
    });
    if (!inscription) {
      throw new ForbiddenException('No tienes acceso a esta lección.');
    }
  }

  findHistory(userId: string, conversationId: string) {
    return this.prisma.chatMessage.findMany({
      where: { userId, conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async clearHistory(userId: string, conversationId: string) {
    await this.prisma.chatMessage.deleteMany({
      where: { userId, conversationId },
    });
    return { cleared: true };
  }

  /* "Editar y reenviar" de verdad: borra ese mensaje y todo lo que vino
     después en la misma conversación (la respuesta vieja incluida), para
     que al reenviar el texto editado se regenere la respuesta desde ahí —
     no se apila como un mensaje nuevo suelto. */
  async deleteFrom(userId: string, messageId: string) {
    const target = await this.prisma.chatMessage.findUnique({ where: { id: messageId } });
    if (!target || target.userId !== userId) return { deleted: 0 };
    const result = await this.prisma.chatMessage.deleteMany({
      where: { userId, conversationId: target.conversationId, createdAt: { gte: target.createdAt } },
    });
    return { deleted: result.count };
  }

  /* Lista tipo WhatsApp: una fila por conversación real, con el último
     mensaje como preview. Los mensajes ya vienen ordenados desc, así que la
     primera vez que aparece cada conversationId es, por construcción, la
     más reciente de esa conversación — y la última vez que aparece es la
     más vieja, o sea la primera pregunta que se hizo. Un título genérico
     como "Conversación general" no sirve para distinguir una conversación
     de otra en la lista, así que el título real es esa primera pregunta.

     El mensaje de usuario y la respuesta de un mismo turno se guardan en un
     solo createMany() (ver send()), así que comparten el mismo createdAt —
     Postgres no garantiza un orden estable entre filas empatadas, y sin un
     desempate el título salía a veces con la respuesta del bot en vez de la
     pregunta. 'role' asc rompe el empate siempre igual: "assistant" < "user"
     alfabéticamente, así que dentro de cada turno el mensaje del alumno
     siempre queda al final — justo el que necesitamos como título. */
  async listConversations(userId: string) {
    const messages = await this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { role: 'asc' }],
      include: { lesson: { include: { course: true } } },
    });

    const seen = new Map<
      string,
      { id: string; lessonId: string | null; title: string; courseTitle: string | null; lastMessage: string; lastMessageAt: Date }
    >();

    for (const m of messages) {
      const existing = seen.get(m.conversationId);
      if (!existing) {
        seen.set(m.conversationId, {
          id: m.conversationId,
          lessonId: m.lessonId,
          title: truncateTitle(m.content),
          courseTitle: m.lesson?.course.title ?? null,
          lastMessage: m.content,
          lastMessageAt: m.createdAt,
        });
      } else {
        /* Vamos de más nuevo a más viejo, así que el último que pisamos
           (el más viejo) queda como título final. */
        existing.title = truncateTitle(m.content);
      }
    }

    return Array.from(seen.values());
  }

  private buildSystemPrompt(
    lesson: { title: string; content: string; course: { title: string } } | null,
    catalog: { title: string; level: string; description: string }[],
  ) {
    const catalogText = catalog.length
      ? catalog.map((c) => `- "${c.title}" (nivel ${c.level}): ${c.description}`).join('\n')
      : '(no hay cursos publicados actualmente)';
    const validLinksText = this.validLinks().map((link) => `- ${link}`).join('\n');

    let prompt =
      `${SYSTEM_PROMPT}\n\nEnlaces válidos:\n${validLinksText}\n\nCatálogo de cursos disponibles:\n${catalogText}`;

    if (lesson) {
      prompt +=
        `\n\nEl alumno está viendo la lección "${lesson.title}" del curso "${lesson.course.title}". ` +
        `Contenido de la lección:\n${lesson.content}`;
    }

    return prompt;
  }

  private validLinks(): string[] {
    const base = process.env.PUBLIC_APP_URL?.trim().replace(/\/+$/, '');
    return base ? [VALID_CATALOG_PATH, `${base}${VALID_CATALOG_PATH}`] : [VALID_CATALOG_PATH];
  }

  private sanitizeReply(reply: string, validLinks: string[]): string {
    let result = reply;

    const replaceInvalidUrl = (url: string) => (
      validLinks.includes(url) ? url : 'el catálogo de cursos'
    );

    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, url: string) => {
      const cleanUrl = url.trim();
      return validLinks.includes(cleanUrl) ? `[${label}](${cleanUrl})` : label;
    });

    result = result.replace(/https?:\/\/[^\s)]+|\/learning\/[^\s)]+/g, (url) => replaceInvalidUrl(url));
    return result;
  }

  private async callOllama(messages: { role: string; content: string }[]): Promise<string> {
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
        /* keep_alive evita que Ollama descargue el modelo de memoria entre
           mensajes (default: 5 min de inactividad) — sin esto, cada vez que
           el alumno se tardaba en escribir la siguiente pregunta, la
           siguiente respuesta pagaba el costo completo de recargar el
           modelo desde disco antes de generar el primer token. */
        body: JSON.stringify({ model, messages, stream: false, keep_alive: '30m' }),
        signal: controller.signal,
      });
    } catch {
      throw new ServiceUnavailableException(OLLAMA_UNAVAILABLE_MESSAGE);
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      throw new ServiceUnavailableException(OLLAMA_UNAVAILABLE_MESSAGE);
    }

    const data = (await res.json()) as { message?: { content?: string } };
    const reply = data.message?.content?.trim();
    if (!reply) {
      throw new ServiceUnavailableException(OLLAMA_UNAVAILABLE_MESSAGE);
    }
    return reply;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import type { PendingTask, PendingTasksResult } from '@app/contracts';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Tareas del alumno: lo que le falta por hacer en los cursos donde está
 * inscrito. Se arma de dos fuentes reales:
 *
 *  · lecciones      → pendientes salvo que exista LessonCompletion suya
 *  · evaluaciones   → pendientes salvo que exista un EvaluationAttempt suyo
 *
 * Siempre se acota a las inscripciones del propio usuario, así que un alumno
 * nunca ve tareas de cursos ajenos aunque pida un courseId arbitrario.
 */
@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findPending(userId: string, courseId?: string): Promise<PendingTasksResult> {
    if (!userId) return { tasks: [], total: 0, done: 0 };

    const inscriptions = await this.prisma.inscription.findMany({
      where: { userId, ...(courseId ? { courseId } : {}) },
      select: { courseId: true, course: { select: { title: true } } },
    });
    if (inscriptions.length === 0) return { tasks: [], total: 0, done: 0 };

    const courseIds = inscriptions.map((i) => i.courseId);
    const titleByCourse = new Map(inscriptions.map((i) => [i.courseId, i.course.title]));

    const [lessons, completions, evaluations, attempts] = await Promise.all([
      this.prisma.lesson.findMany({
        where: { courseId: { in: courseIds } },
        select: { id: true, title: true, courseId: true, contentType: true, durationMinutes: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.lessonCompletion.findMany({
        where: { userId, lesson: { courseId: { in: courseIds } } },
        select: { lessonId: true },
      }),
      this.prisma.evaluation.findMany({
        where: { courseId: { in: courseIds } },
        select: { id: true, title: true, courseId: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.evaluationAttempt.findMany({
        where: { studentId: userId, evaluation: { courseId: { in: courseIds } } },
        select: { evaluationId: true },
      }),
    ]);

    const seenLessons = new Set(completions.map((c) => c.lessonId));
    const seenEvals = new Set(attempts.map((a) => a.evaluationId));

    const tasks: PendingTask[] = [
      ...lessons.map((l) => ({
        id: l.id,
        kind: 'lesson' as const,
        title: l.title,
        courseId: l.courseId,
        courseTitle: titleByCourse.get(l.courseId) ?? 'Curso',
        contentType: l.contentType,
        durationMinutes: l.durationMinutes,
        done: seenLessons.has(l.id),
      })),
      ...evaluations.map((e) => ({
        id: e.id,
        kind: 'evaluation' as const,
        title: e.title,
        courseId: e.courseId,
        courseTitle: titleByCourse.get(e.courseId) ?? 'Curso',
        done: seenEvals.has(e.id),
      })),
    ];

    /* Lo pendiente primero: es lo que el alumno viene a buscar. */
    tasks.sort((a, b) => Number(a.done) - Number(b.done));

    return { tasks, total: tasks.length, done: tasks.filter((t) => t.done).length };
  }

  /**
   * Marca o desmarca una lección como vista. Se verifica que el alumno esté
   * inscrito en el curso de esa lección: el userId lo pone el gateway desde el
   * JWT, pero el lessonId viene del cliente.
   */
  async setLessonCompleted(userId: string, lessonId: string, done: boolean, actor: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, courseId: true },
    });
    if (!lesson) throw new NotFoundException('Leccion no encontrada');

    const enrolled = await this.prisma.inscription.findFirst({
      where: { userId, courseId: lesson.courseId },
      select: { id: true },
    });
    if (!enrolled) throw new NotFoundException('No estás inscrito en este curso');

    if (done) {
      await this.prisma.lessonCompletion.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: { updatedBy: actor },
        create: { userId, lessonId, createdBy: actor, updatedBy: actor },
      });
    } else {
      await this.prisma.lessonCompletion.deleteMany({ where: { userId, lessonId } });
    }

    return { lessonId, done };
  }
}

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../prisma/generated';
import { CreateEvaluationDto } from './dtos/create-evaluation.dto';
import { SubmitAttemptDto } from './dtos/submit-attempt.dto';

interface KahootQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  timeLimitSeconds?: number;
}

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEvaluationDto, actor: string) {
    return this.prisma.evaluation.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        topic: dto.topic ?? null,
        kind: dto.kind ?? 'kahoot',
        passingScore: dto.passingScore ?? 70,
        questions: (dto.questions ?? []) as unknown as Prisma.InputJsonValue,
        courseId: dto.courseId,
        createdBy: actor,
        updatedBy: actor,
      },
    });
  }

  findByCourse(courseId: string) {
    return this.prisma.evaluation.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ev = await this.prisma.evaluation.findUnique({ where: { id } });
    if (!ev) throw new NotFoundException('Evaluacion no encontrada');
    return ev;
  }

  async submitAttempt(dto: SubmitAttemptDto) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id: dto.evaluationId },
      include: { course: { select: { id: true } } },
    });
    if (!evaluation) throw new NotFoundException('Evaluacion no encontrada');

    const enrolled = await this.prisma.inscription.findFirst({
      where: { userId: dto.studentId, courseId: evaluation.courseId },
      select: { id: true },
    });
    if (!enrolled) throw new ForbiddenException('Solo alumnos inscritos pueden responder este examen');

    const questions = Array.isArray(evaluation.questions) ? evaluation.questions as unknown as KahootQuestion[] : [];
    const correct = questions.reduce((sum, question, index) => {
      const answer = dto.answers[index];
      const selected = typeof answer === 'number' ? answer : Number(answer?.selectedIndex ?? answer);
      return sum + (selected === question.correctIndex ? 1 : 0);
    }, 0);
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : null;

    const attempt = await this.prisma.evaluationAttempt.create({
      data: {
        evaluationId: dto.evaluationId,
        studentId: dto.studentId,
        answers: dto.answers as Prisma.InputJsonValue,
        score,
        createdBy: dto.studentId,
      },
    });
    await this.recalculateCourseProgress(dto.studentId, evaluation.courseId);
    return attempt;
  }

  private async recalculateCourseProgress(userId: string, courseId: string) {
    const inscription = await this.prisma.inscription.findFirst({
      where: { userId, courseId },
      select: { id: true },
    });
    if (!inscription) return;

    const [lessonCount, completedLessons, evaluations, attempts] = await Promise.all([
      this.prisma.lesson.count({ where: { courseId } }),
      this.prisma.lessonCompletion.count({ where: { userId, lesson: { courseId } } }),
      this.prisma.evaluation.findMany({ where: { courseId }, select: { id: true, passingScore: true } }),
      this.prisma.evaluationAttempt.findMany({
        where: { studentId: userId, evaluation: { courseId } },
        select: { evaluationId: true, score: true },
      }),
    ]);
    const bestScore = new Map<string, number>();
    for (const attempt of attempts) {
      const score = Number(attempt.score ?? 0);
      bestScore.set(attempt.evaluationId, Math.max(bestScore.get(attempt.evaluationId) ?? 0, score));
    }
    const evaluationsPassed = evaluations.filter((evaluation) => (bestScore.get(evaluation.id) ?? 0) >= evaluation.passingScore).length;
    const totalItems = lessonCount + evaluations.length;
    const doneItems = completedLessons + evaluationsPassed;
    const progressPercentage = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);
    const complete = lessonCount > 0 && evaluations.length > 0 && completedLessons >= lessonCount && evaluationsPassed >= evaluations.length;
    const averageScore = attempts.length
      ? Math.round(attempts.reduce((sum, attempt) => sum + Number(attempt.score ?? 0), 0) / attempts.length)
      : 0;

    await this.prisma.inscription.update({
      where: { id: inscription.id },
      data: {
        status: complete ? 'completed' : progressPercentage > 0 ? 'in-progress' : 'enrolled',
        progressPercentage,
        completedAt: complete ? new Date() : null,
        updatedBy: userId,
      },
    });

    const existing = await this.prisma.progress.findFirst({ where: { inscriptionId: inscription.id } });
    const data = {
      lessonsCompleted: completedLessons,
      evaluationsCompleted: evaluationsPassed,
      averageScore,
      progressPercentage,
      lastAccessAt: new Date(),
      updatedBy: userId,
    };
    if (existing) await this.prisma.progress.update({ where: { id: existing.id }, data });
    else await this.prisma.progress.create({ data: { ...data, inscriptionId: inscription.id, createdBy: userId } });
  }
}

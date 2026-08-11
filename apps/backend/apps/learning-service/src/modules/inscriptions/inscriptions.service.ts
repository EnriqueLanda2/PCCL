import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DataScope, IDENTITY_PATTERNS } from '@app/contracts';
import { IDENTITY_CLIENT } from '@app/messaging';
import { PrismaService } from '../../prisma/prisma.service';
import { buildUserDirectory } from '../../common/user-directory';
import { inscriptionWhereFor } from '../../common/scope-filter';
import {
  CreateInscriptionDto,
  UpdateInscriptionDto,
} from './dtos/inscription.dto';

@Injectable()
export class InscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(IDENTITY_CLIENT) private readonly identityClient: ClientProxy,
  ) {}

  async create(dto: CreateInscriptionDto, actor: string) {
    const [user, course] = await Promise.all([
      firstValueFrom<unknown>(
        this.identityClient.send(IDENTITY_PATTERNS.USER_FIND_BY_ID, {
          id: dto.userId,
        }),
      ).catch(() => null),
      this.prisma.course.findUnique({ where: { id: dto.courseId } }),
    ]);

    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!course) throw new NotFoundException('Curso no encontrado');

    const isPaidCourse = !course.isFree && Number(course.price) > 0;
    if (isPaidCourse && actor !== 'system') {
      throw new ForbiddenException('Este curso requiere pago');
    }

    const existing = await this.prisma.inscription.findFirst({
      where: { userId: dto.userId, courseId: dto.courseId },
    });
    if (existing) {
      const accessEndsAt = dto.accessEndsAt ? new Date(dto.accessEndsAt) : null;
      if (dto.accessType === 'permanent') {
        return this.prisma.inscription.update({
          where: { id: existing.id },
          data: {
            status: existing.status === 'dropped' ? 'enrolled' : existing.status,
            endDate: null,
            updatedBy: actor,
          },
          include: { course: true },
        });
      }
      if (dto.accessType === 'monthly' && accessEndsAt) {
        return this.prisma.inscription.update({
          where: { id: existing.id },
          data: {
            status: existing.status === 'dropped' ? 'enrolled' : existing.status,
            startDate: new Date(),
            endDate: accessEndsAt,
            updatedBy: actor,
          },
          include: { course: true },
        });
      }
      throw new ConflictException('Ya inscrito');
    }

    const accessEndsAt = dto.accessEndsAt ? new Date(dto.accessEndsAt) : null;

    const insc = await this.prisma.inscription.create({
      data: {
        userId: dto.userId,
        courseId: dto.courseId,
        startDate: new Date(),
        endDate: accessEndsAt,
        createdBy: actor,
        updatedBy: actor,
      },
    });
    return this.findOne(insc.id);
  }

  async findAll(scope?: DataScope) {
    const [inscriptions, directory] = await Promise.all([
      this.prisma.inscription.findMany({
        where: inscriptionWhereFor(scope),
        include: { course: true },
        orderBy: { createdAt: 'desc' },
      }),
      buildUserDirectory(this.identityClient),
    ]);
    return inscriptions.map((insc) => ({
      ...insc,
      user: directory.get(insc.userId) ?? null,
    }));
  }

  /**
   * IDs de inscripción que caen dentro de un alcance. Lo usa
   * certification-service para filtrar constancias por instructor, ya que
   * vive en otra base y no puede unir contra `courses`.
   */
  async findIdsByScope(scope?: DataScope): Promise<string[]> {
    const rows = await this.prisma.inscription.findMany({
      where: inscriptionWhereFor(scope),
      select: { id: true },
    });
    return rows.map((r) => r.id);
  }

  async findOne(id: string) {
    const insc = await this.prisma.inscription.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!insc) throw new NotFoundException('Inscripcion no encontrada');
    return insc;
  }

  async update(id: string, dto: UpdateInscriptionDto, actor: string) {
    await this.findOne(id);
    if (dto.status === 'completed') {
      const eligibility = await this.certificateEligibility(id);
      if (!eligibility.eligible) {
        throw new BadRequestException(eligibility.reason);
      }
    }
    await this.prisma.inscription.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: actor,
        ...(dto.status === 'completed'
          ? { completedAt: new Date(), progressPercentage: 100 }
          : {}),
      },
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.inscription.delete({ where: { id } });
    return { id, deleted: true };
  }

  /** Tasa de finalización global — para las estadísticas públicas del landing. */
  async completionRateStats() {
    const [total, completed] = await Promise.all([
      this.prisma.inscription.count(),
      this.prisma.inscription.count({ where: { status: 'completed' } }),
    ]);
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, rate };
  }

  async certificateEligibility(inscriptionId: string) {
    const inscription = await this.prisma.inscription.findUnique({
      where: { id: inscriptionId },
      select: { id: true, userId: true, courseId: true },
    });
    if (!inscription) throw new NotFoundException('Inscripcion no encontrada');

    const [lessonCount, completedLessons, evaluations, attempts] = await Promise.all([
      this.prisma.lesson.count({ where: { courseId: inscription.courseId } }),
      this.prisma.lessonCompletion.count({
        where: { userId: inscription.userId, lesson: { courseId: inscription.courseId } },
      }),
      this.prisma.evaluation.findMany({
        where: { courseId: inscription.courseId },
        select: { id: true, title: true, passingScore: true },
      }),
      this.prisma.evaluationAttempt.findMany({
        where: { studentId: inscription.userId, evaluation: { courseId: inscription.courseId } },
        select: { evaluationId: true, score: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const bestScore = new Map<string, number>();
    for (const attempt of attempts) {
      const score = Number(attempt.score ?? 0);
      bestScore.set(attempt.evaluationId, Math.max(bestScore.get(attempt.evaluationId) ?? 0, score));
    }

    const missingEvaluations = evaluations
      .filter((evaluation) => (bestScore.get(evaluation.id) ?? 0) < evaluation.passingScore)
      .map((evaluation) => evaluation.title);
    const evaluationsPassed = evaluations.length - missingEvaluations.length;
    const lessonsDone = lessonCount === 0 || completedLessons >= lessonCount;
    const evaluationsDone = evaluations.length > 0 && evaluationsPassed >= evaluations.length;
    const eligible = lessonsDone && evaluationsDone;

    return {
      inscriptionId,
      courseId: inscription.courseId,
      userId: inscription.userId,
      eligible,
      lessonsCompleted: completedLessons,
      lessonsTotal: lessonCount,
      evaluationsPassed,
      evaluationsTotal: evaluations.length,
      missingEvaluations,
      reason: eligible
        ? null
        : 'Completa todas las lecciones y aprueba todos los exámenes tipo Kahoot del curso.',
    };
  }
}

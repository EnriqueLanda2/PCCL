import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DataScope, IDENTITY_PATTERNS } from '@app/contracts';
import { IDENTITY_CLIENT } from '@app/messaging';
import type { Prisma } from '../../prisma/generated';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLiveSessionDto } from './dtos/create-live-session.dto';
import { UpdateLiveSessionDto } from './dtos/update-live-session.dto';

@Injectable()
export class LiveSessionsService {
  private readonly logger = new Logger(LiveSessionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(IDENTITY_CLIENT) private readonly identityClient: ClientProxy,
  ) {}

  /** Si la clase se ata a un curso, la fase es obligatoria — es lo que le
      permite al alumno saber si esta clase corresponde a donde va en el
      camino del curso o está más adelante. Sin curso, no hay camino al que
      atarla, así que tampoco tiene sentido pedir fase. */
  private async assertPhase(courseId: string | undefined, phaseId: string | undefined) {
    if (!courseId) return;
    if (!phaseId) throw new BadRequestException('Selecciona la fase del curso a la que pertenece esta clase');
    const phase = await this.prisma.phase.findUnique({ where: { id: phaseId }, select: { courseId: true } });
    if (!phase || phase.courseId !== courseId) {
      throw new BadRequestException('La fase seleccionada no pertenece a este curso');
    }
  }

  async create(dto: CreateLiveSessionDto, actor: string) {
    await this.assertPhase(dto.courseId, dto.phaseId);
    const safeDto = { ...dto };
    delete safeDto.hostName;
    return this.prisma.liveSession.create({
      data: {
        ...safeDto,
        hostName: actor,
        createdBy: actor,
        updatedBy: actor,
      },
      include: { course: { select: { title: true } }, phase: true },
    });
  }

  private whereFor(scope?: DataScope): Prisma.LiveSessionWhereInput {
    const activeInscriptionWhere: Prisma.InscriptionWhereInput = {
      status: { in: ['enrolled', 'active', 'in_progress', 'completed'] },
      OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
    };

    switch (scope?.kind) {
      case 'all':
        return {};
      case 'instructor':
        return scope.instructorEmail
          ? {
              OR: [
                { createdBy: scope.instructorEmail },
                { course: { createdBy: scope.instructorEmail } },
              ],
            }
          : { id: '00000000-0000-0000-0000-000000000000' };
      case 'user':
        return scope.userId
          ? {
              courseId: { not: null },
              course: {
                inscriptions: {
                  some: {
                    ...activeInscriptionWhere,
                    userId: scope.userId,
                  },
                },
              },
            }
          : { id: '00000000-0000-0000-0000-000000000000' };
      default:
        return { id: '00000000-0000-0000-0000-000000000000' };
    }
  }

  findAll(scope?: DataScope) {
    return this.prisma.liveSession.findMany({
      where: this.whereFor(scope),
      include: { course: { select: { title: true } }, phase: true },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.liveSession.findUnique({
      where: { id },
      include: { course: { select: { title: true } }, phase: true },
    });
    if (!session) throw new NotFoundException('Clase en vivo no encontrada');
    return session;
  }

  async update(id: string, dto: UpdateLiveSessionDto, actor: string) {
    const existing = await this.findOne(id);
    const safeDto = { ...(dto as UpdateLiveSessionDto & {
      createdBy?: string | null;
      updatedBy?: string | null;
    }) };
    delete safeDto.hostName;
    delete safeDto.createdBy;
    delete safeDto.updatedBy;
    const nextCourseId = safeDto.courseId ?? existing.courseId ?? undefined;
    if (safeDto.courseId !== undefined || safeDto.phaseId !== undefined) {
      await this.assertPhase(nextCourseId, safeDto.phaseId ?? existing.phaseId ?? undefined);
    }
    await this.prisma.liveSession.update({ where: { id }, data: { ...safeDto, updatedBy: actor } });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.liveSession.delete({ where: { id } });
    return { id, deleted: true };
  }

  /** Se marca "en vivo" solo cuando el anfitrión (quien creó la clase)
      efectivamente entra a la sala — nunca por el solo hecho de haber
      llegado la hora programada. Llamado desde el frontend al conectarse
      a Jitsi. Recién ahí se avisa a los inscritos del curso: antes no,
      porque hasta ese momento no hay nada a lo que unirse de verdad. */
  async start(id: string, actor: string) {
    const session = await this.findOne(id);
    if (session.createdBy !== actor) {
      throw new ForbiddenException('Solo quien creó la clase puede iniciarla');
    }
    if (session.status === 'scheduled') {
      await this.prisma.liveSession.update({
        where: { id },
        data: { status: 'live', updatedBy: actor },
      });
      void this.notifyCourseStarted(id).catch((err) =>
        this.logger.warn(`No se pudo notificar el inicio de ${id}: ${(err as Error).message}`),
      );
    }
    return this.findOne(id);
  }

  private async notifyCourseStarted(sessionId: string) {
    const session = await this.prisma.liveSession.findUnique({
      where: { id: sessionId },
      include: {
        course: {
          select: { title: true, inscriptions: { select: { userId: true } } },
        },
      },
    });
    const userIds = session?.course?.inscriptions.map((i) => i.userId) ?? [];
    if (userIds.length === 0) return;

    const courseTitle = session?.course?.title ?? 'tu curso';
    await firstValueFrom(
      this.identityClient.send(IDENTITY_PATTERNS.PUSH_NOTIFY_USERS, {
        userIds,
        title: 'Clase en vivo',
        body: `"${session?.title}" (${courseTitle}) ya está en vivo — ¡unite!`,
      }),
    );
  }

  /** Cada minuto: cualquier clase que sigue "scheduled" 15 minutos después de
      su hora de inicio se cancela — el anfitrión nunca llegó a abrir la
      sala — y se avisa por push a los inscritos del curso de que se va a
      reagendar. Los 15 minutos son el mismo margen que se le avisa al
      alumno en el formulario de programar la clase. */
  @Cron('0 * * * * *')
  async cancelExpiredSessions() {
    const deadline = new Date(Date.now() - 15 * 60_000);
    const expired = await this.prisma.liveSession.findMany({
      where: { status: 'scheduled', scheduledAt: { lte: deadline } },
      include: {
        course: {
          select: {
            title: true,
            inscriptions: { select: { userId: true } },
          },
        },
      },
    });

    for (const session of expired) {
      await this.prisma.liveSession.update({
        where: { id: session.id },
        data: { status: 'canceled', updatedBy: 'system:cron' },
      });

      const userIds = session.course?.inscriptions.map((i) => i.userId) ?? [];
      if (userIds.length === 0) continue;

      const courseTitle = session.course?.title ?? 'tu curso';
      try {
        await firstValueFrom(
          this.identityClient.send(IDENTITY_PATTERNS.PUSH_NOTIFY_USERS, {
            userIds,
            title: 'Clase en vivo cancelada',
            body: `"${session.title}" (${courseTitle}) se canceló porque el anfitrión no se conectó. Se va a reagendar.`,
          }),
        );
      } catch (err) {
        this.logger.warn(`No se pudo notificar la cancelación de ${session.id}: ${(err as Error).message}`);
      }
    }
  }

  /** Próxima sesión en vivo o programada — para la tarjeta pública del landing. */
  async findNextPublic() {
    const sessions = await this.prisma.liveSession.findMany({
      where: {
        OR: [
          { status: 'live' },
          { status: 'scheduled', scheduledAt: { gt: new Date() } },
        ],
      },
      select: {
        id: true,
        title: true,
        hostName: true,
        scheduledAt: true,
        durationMinutes: true,
        status: true,
        course: { select: { title: true } },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 1,
    });
    return sessions[0] ?? null;
  }
}

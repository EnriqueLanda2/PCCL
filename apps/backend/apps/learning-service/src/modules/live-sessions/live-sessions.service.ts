import { Injectable, NotFoundException } from '@nestjs/common';
import { DataScope } from '@app/contracts';
import type { Prisma } from '../../prisma/generated';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLiveSessionDto } from './dtos/create-live-session.dto';
import { UpdateLiveSessionDto } from './dtos/update-live-session.dto';

@Injectable()
export class LiveSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateLiveSessionDto, actor: string) {
    return this.prisma.liveSession.create({
      data: { ...dto, createdBy: actor, updatedBy: actor },
    });
  }

  private whereFor(scope?: DataScope): Prisma.LiveSessionWhereInput {
    switch (scope?.kind) {
      case 'all':
        return {};
      case 'instructor':
        return scope.instructorEmail
          ? { course: { createdBy: scope.instructorEmail } }
          : { id: '00000000-0000-0000-0000-000000000000' };
      case 'user':
        return scope.userId
          ? { course: { inscriptions: { some: { userId: scope.userId } } } }
          : { id: '00000000-0000-0000-0000-000000000000' };
      default:
        return { id: '00000000-0000-0000-0000-000000000000' };
    }
  }

  findAll(scope?: DataScope) {
    return this.prisma.liveSession.findMany({
      where: this.whereFor(scope),
      include: { course: { select: { title: true } } },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.liveSession.findUnique({
      where: { id },
      include: { course: { select: { title: true } } },
    });
    if (!session) throw new NotFoundException('Clase en vivo no encontrada');
    return session;
  }

  async update(id: string, dto: UpdateLiveSessionDto, actor: string) {
    await this.findOne(id);
    await this.prisma.liveSession.update({ where: { id }, data: { ...dto, updatedBy: actor } });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.liveSession.delete({ where: { id } });
    return { id, deleted: true };
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

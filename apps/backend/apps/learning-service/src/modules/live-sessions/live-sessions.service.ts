import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll() {
    return this.prisma.liveSession.findMany({
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

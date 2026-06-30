import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCalificationDto } from './dtos/create-calification.dto';

@Injectable()
export class CalificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCalificationDto, actor: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: dto.lessonId } });
    if (!lesson) throw new NotFoundException('Leccion no encontrada');
    const c = await this.prisma.calification.create({
      data: { ...dto, createdBy: actor, updatedBy: actor },
    });
    return this.findOne(c.id);
  }

  findAll() {
    return this.prisma.calification.findMany({ include: { lesson: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const c = await this.prisma.calification.findUnique({ where: { id }, include: { lesson: true } });
    if (!c) throw new NotFoundException('Calificacion no encontrada');
    return c;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.calification.delete({ where: { id } });
    return { id, deleted: true };
  }
}

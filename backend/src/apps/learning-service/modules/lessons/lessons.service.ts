import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateLessonDto, actor: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    const lesson = await this.prisma.lesson.create({
      data: {
        title: dto.title,
        content: dto.content,
        contentType: dto.contentType,
        courseId: dto.courseId,
        createdBy: actor,
        updatedBy: actor,
      },
    });
    return this.findOne(lesson.id);
  }

  findAll() {
    return this.prisma.lesson.findMany({
      include: { course: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!lesson) {
      throw new NotFoundException('Leccion no encontrada');
    }
    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto, actor: string) {
    const lesson = await this.findOne(id);

    if (dto.courseId && dto.courseId !== lesson.course.id) {
      const course = await this.prisma.course.findUnique({
        where: { id: dto.courseId },
      });
      if (!course) {
        throw new NotFoundException('Curso no encontrado');
      }
    }

    await this.prisma.lesson.update({
      where: { id },
      data: {
        title: dto.title ?? lesson.title,
        content: dto.content ?? lesson.content,
        contentType: dto.contentType ?? lesson.contentType,
        courseId: dto.courseId ?? lesson.course.id,
        updatedBy: actor,
      },
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.lesson.delete({ where: { id } });
    return { id, deleted: true };
  }
}



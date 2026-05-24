import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCourseDto, actor: string) {
    return this.prisma.course.create({
      data: {
        ...dto,
        createdBy: actor,
        updatedBy: actor,
      },
    });
  }

  findAll() {
    return this.prisma.course.findMany({
      include: { lessons: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { lessons: true },
    });
    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, actor: string) {
    await this.findOne(id);
    await this.prisma.course.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: actor,
      },
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.course.delete({ where: { id } });
    return { id, deleted: true };
  }

  async publish(id: string, actor: string) {
    await this.findOne(id);
    await this.prisma.course.update({
      where: { id },
      data: {
        status: 'published',
        updatedBy: actor,
      },
    });
    return this.findOne(id);
  }
}



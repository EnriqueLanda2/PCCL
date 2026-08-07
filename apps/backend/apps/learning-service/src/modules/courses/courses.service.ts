import { Injectable, NotFoundException } from '@nestjs/common';
import { DataScope } from '@app/contracts';
import { PrismaService } from '../../prisma/prisma.service';
import { courseWhereFor } from '../../common/scope-filter';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCourseDto, actor: string) {
    return this.prisma.course.create({
      data: { ...dto, createdBy: actor, updatedBy: actor },
    });
  }

  findAll(scope?: DataScope) {
    return this.prisma.course.findMany({
      where: courseWhereFor(scope),
      include: { lessons: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Cursos publicados, con campos mínimos — alimenta el carrusel público del
   * landing y el catálogo de inscripción del portal. Es la única lista de
   * cursos que NO se acota por alcance: sirve para descubrir cursos ajenos,
   * así que solo expone lo que se imprime en la tarjeta.
   */
  findPublished() {
    return this.prisma.course.findMany({
      where: { status: 'published' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        level: true,
        coverImageUrl: true,
        durationMinutes: true,
        price: true,
        currency: true,
        isFree: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Total de cursos publicados — para las estadísticas públicas del landing. */
  countPublished() {
    return this.prisma.course.count({ where: { status: 'published' } });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id }, include: { lessons: true } });
    if (!course) throw new NotFoundException('Curso no encontrado');
    return course;
  }

  async update(id: string, dto: UpdateCourseDto, actor: string) {
    await this.findOne(id);
    await this.prisma.course.update({ where: { id }, data: { ...dto, updatedBy: actor } });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.course.delete({ where: { id } });
    return { id, deleted: true };
  }

  async publish(id: string, actor: string) {
    await this.findOne(id);
    await this.prisma.course.update({ where: { id }, data: { status: 'published', updatedBy: actor } });
    return this.findOne(id);
  }
}

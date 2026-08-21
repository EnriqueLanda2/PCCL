import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DataScope } from '@app/contracts';
import { PrismaService } from '../../prisma/prisma.service';
import { lessonWhereFor } from '../../common/scope-filter';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLessonDto, actor: string) {
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException('Curso no encontrado');
    const lesson = await this.prisma.lesson.create({
      data: { title: dto.title, content: dto.content, contentType: dto.contentType, fileUrl: dto.fileUrl, durationMinutes: dto.durationMinutes, courseId: dto.courseId, phaseId: dto.phaseId, createdBy: actor, updatedBy: actor },
    });
    return this.findOne(lesson.id);
  }

  findAll(scope?: DataScope) {
    return this.prisma.lesson.findMany({
      where: lessonWhereFor(scope),
      include: { course: true, phase: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id }, include: { course: true } });
    if (!lesson) throw new NotFoundException('Leccion no encontrada');
    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto, actor: string) {
    const lesson = await this.findOne(id);
    if (dto.courseId && dto.courseId !== lesson.courseId) {
      const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
      if (!course) throw new NotFoundException('Curso no encontrado');
    }
    await this.prisma.lesson.update({
      where: { id },
      data: { title: dto.title ?? lesson.title, content: dto.content ?? lesson.content, contentType: dto.contentType ?? lesson.contentType, fileUrl: dto.fileUrl ?? lesson.fileUrl, durationMinutes: dto.durationMinutes ?? lesson.durationMinutes, courseId: dto.courseId ?? lesson.courseId, phaseId: dto.phaseId ?? lesson.phaseId, updatedBy: actor },
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.lesson.delete({ where: { id } });
    return { id, deleted: true };
  }

  /* ─── Entregas de tareas (contentType 'assignment') ───
     El alumno sube un archivo como entrega; el instructor del curso la
     califica a mano. Una entrega por alumno/lección: re-entregar reemplaza
     el archivo y borra la calificación anterior. */

  async submitAssignment(p: {
    lessonId: string;
    userId: string;
    userEmail: string | null;
    fileUrl: string;
    fileName?: string | null;
    comment?: string | null;
  }) {
    const lesson = await this.findOne(p.lessonId);
    if (lesson.contentType !== 'assignment') {
      throw new BadRequestException('Esta lección no es una tarea con entrega de archivo.');
    }
    if (!p.fileUrl?.trim()) {
      throw new BadRequestException('Falta el archivo de la entrega.');
    }
    const enrolled = await this.prisma.inscription.findFirst({
      where: { userId: p.userId, courseId: lesson.courseId },
      select: { id: true },
    });
    if (!enrolled) {
      throw new BadRequestException('No estás inscrito en este curso.');
    }
    const data = {
      fileUrl: p.fileUrl,
      fileName: p.fileName ?? null,
      comment: p.comment?.trim() || null,
      submittedAt: new Date(),
      /* Entrega nueva = calificación de cero: lo que calificó el instructor
         ya no es lo que está entregado. */
      score: null,
      feedback: null,
      gradedBy: null,
      gradedAt: null,
    };
    return this.prisma.assignmentSubmission.upsert({
      where: { lessonId_userId: { lessonId: p.lessonId, userId: p.userId } },
      create: { lessonId: p.lessonId, userId: p.userId, userEmail: p.userEmail, ...data },
      update: { userEmail: p.userEmail, ...data },
    });
  }

  findMyAssignmentSubmission(lessonId: string, userId: string) {
    return this.prisma.assignmentSubmission.findUnique({
      where: { lessonId_userId: { lessonId, userId } },
    });
  }

  /** Solo el instructor dueño del curso (o admin, scope 'all') ve las
      entregas — el gateway ya filtró por rol, acá se verifica pertenencia. */
  private async assertCanGradeLesson(lessonId: string, scope: DataScope | undefined) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { course: { select: { createdBy: true } } },
    });
    if (!lesson) throw new NotFoundException('Leccion no encontrada');
    if (scope?.kind === 'all') return lesson;
    if (scope?.kind === 'instructor' && scope.instructorEmail && lesson.course.createdBy === scope.instructorEmail) {
      return lesson;
    }
    throw new ForbiddenException('Solo el instructor de este curso puede ver o calificar sus entregas.');
  }

  async findAssignmentSubmissionsByLesson(lessonId: string, scope: DataScope | undefined) {
    await this.assertCanGradeLesson(lessonId, scope);
    return this.prisma.assignmentSubmission.findMany({
      where: { lessonId },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async gradeAssignment(p: {
    submissionId: string;
    score: number;
    feedback?: string | null;
    scope?: DataScope;
    actor: string;
  }) {
    const submission = await this.prisma.assignmentSubmission.findUnique({ where: { id: p.submissionId } });
    if (!submission) throw new NotFoundException('Entrega no encontrada');
    await this.assertCanGradeLesson(submission.lessonId, p.scope);
    if (!Number.isInteger(p.score) || p.score < 0 || p.score > 100) {
      throw new BadRequestException('La calificación debe ser un entero entre 0 y 100.');
    }
    return this.prisma.assignmentSubmission.update({
      where: { id: p.submissionId },
      data: {
        score: p.score,
        feedback: p.feedback?.trim() || null,
        gradedBy: p.actor,
        gradedAt: new Date(),
      },
    });
  }
}

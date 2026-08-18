import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataScope } from '@app/contracts';
import { PrismaService } from '../../prisma/prisma.service';
import { courseWhereFor } from '../../common/scope-filter';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  private async withCourseStats<T extends { id: string }>(courses: T[]) {
    if (courses.length === 0) return courses;
    const ids = courses.map((course) => course.id);
    const [students, reviews, evaluations] = await Promise.all([
      this.prisma.inscription.groupBy({
        by: ['courseId'],
        where: { courseId: { in: ids }, status: { not: 'dropped' } },
        _count: { _all: true },
      }),
      this.prisma.courseReview.groupBy({
        by: ['courseId'],
        where: { courseId: { in: ids } },
        _count: { _all: true },
        _avg: { rating: true },
      }),
      this.prisma.evaluation.groupBy({
        by: ['courseId'],
        where: { courseId: { in: ids } },
        _count: { _all: true },
      }),
    ]);
    const studentsByCourse = new Map(students.map((item) => [item.courseId, item._count._all]));
    const reviewsByCourse = new Map(reviews.map((item) => [item.courseId, item]));
    const evaluationsByCourse = new Map(evaluations.map((item) => [item.courseId, item._count._all]));

    return courses.map((course) => {
      const review = reviewsByCourse.get(course.id);
      return {
        ...course,
        studentsCount: studentsByCourse.get(course.id) ?? 0,
        rating: review?._avg.rating ? Number(review._avg.rating.toFixed(1)) : null,
        reviewCount: review?._count._all ?? 0,
        certificateIncluded: (evaluationsByCourse.get(course.id) ?? 0) > 0,
      };
    });
  }

  create(dto: CreateCourseDto, actor: string) {
    return this.prisma.course.create({
      data: { ...dto, createdBy: actor, updatedBy: actor },
    });
  }

  async findAll(scope?: DataScope) {
    const courses = await this.prisma.course.findMany({
      where: courseWhereFor(scope),
      include: { lessons: true, phases: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return this.withCourseStats(courses);
  }

  /**
   * Cursos publicados, con campos mínimos — alimenta el carrusel público del
   * landing y el catálogo de inscripción del portal. Es la única lista de
   * cursos que NO se acota por alcance: sirve para descubrir cursos ajenos,
   * así que solo expone lo que se imprime en la tarjeta.
   */
  async findPublished() {
    const courses = await this.prisma.course.findMany({
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
    return this.withCourseStats(courses);
  }

  /**
   * Un curso publicado con su temario — alimenta la vista previa del catálogo,
   * donde el usuario todavía NO está inscrito.
   *
   * Dos cosas que no pueden cambiarse a la ligera:
   *  · Solo `status: 'published'`. Un borrador debe responder 404 igual que un
   *    id inexistente; si filtráramos después de leerlo, la diferencia entre
   *    "no existe" y "existe pero no está publicado" ya sería observable.
   *  · De cada lección solo salen título, tipo y duración. `content` y
   *    `fileUrl` son el material del curso: son exactamente lo que se paga al
   *    inscribirse, así que no viajan por una ruta pública.
   */
  async findPublishedOne(id: string) {
    const course = await this.prisma.course.findFirst({
      where: { id, status: 'published' },
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
        lessons: {
          select: {
            id: true,
            title: true,
            contentType: true,
            durationMinutes: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!course) throw new NotFoundException('Curso no encontrado');
    return course;
  }

  /** Total de cursos publicados — para las estadísticas públicas del landing. */
  countPublished() {
    return this.prisma.course.count({ where: { status: 'published' } });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { lessons: true, phases: { orderBy: { order: 'asc' } } },
    });
    if (!course) throw new NotFoundException('Curso no encontrado');
    const [decorated] = await this.withCourseStats([course]);
    return decorated;
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

  async findReviews(courseId: string, viewerId?: string) {
    await this.findOne(courseId);
    const reviews = await this.prisma.courseReview.findMany({
      where: { courseId },
      orderBy: { updatedAt: 'desc' },
    });
    return reviews.map((review) => ({
      ...review,
      mine: viewerId ? review.userId === viewerId : false,
    }));
  }

  async upsertReview(courseId: string, userId: string, rating: number, comment: string | null, actor: string) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException('La reseña debe estar entre 1 y 5 estrellas');
    }
    const enrolled = await this.prisma.inscription.findFirst({
      where: { courseId, userId, status: { not: 'dropped' } },
      select: { id: true },
    });
    if (!enrolled) throw new NotFoundException('Solo alumnos inscritos pueden reseñar este curso');

    await this.prisma.courseReview.upsert({
      where: { courseId_userId: { courseId, userId } },
      update: { rating, comment, updatedBy: actor },
      create: { courseId, userId, rating, comment, createdBy: actor, updatedBy: actor },
    });
    return this.findReviews(courseId, userId);
  }

  async certificateEligibility(courseId: string, userId: string) {
    const inscription = await this.prisma.inscription.findFirst({
      where: { courseId, userId },
      select: { id: true },
    });
    if (!inscription) throw new NotFoundException('No estás inscrito en este curso');
    return this.computeCertificateEligibility(inscription.id);
  }

  async computeCertificateEligibility(inscriptionId: string) {
    const inscription = await this.prisma.inscription.findUnique({
      where: { id: inscriptionId },
      select: { id: true, userId: true, courseId: true, status: true },
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
    const evaluationsPassed = evaluations.filter((evaluation) => (bestScore.get(evaluation.id) ?? 0) >= evaluation.passingScore).length;
    const missingEvaluations = evaluations
      .filter((evaluation) => (bestScore.get(evaluation.id) ?? 0) < evaluation.passingScore)
      .map((evaluation) => evaluation.title);
    const lessonsDone = lessonCount === 0 || completedLessons >= lessonCount;
    /* Mismo criterio que `lessonsDone`: un curso sin exámenes no debe quedar
       eternamente inelegible por "faltan exámenes" que no existen. */
    const evaluationsDone = evaluations.length === 0 || evaluationsPassed >= evaluations.length;
    const eligible = lessonsDone && evaluationsDone;

    return {
      inscriptionId: inscription.id,
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
        : 'Completa todas las lecciones y aprueba todos los exámenes  del curso.',
    };
  }

  /** "Guardado" en la ficha de curso — un bookmark, no una inscripción.
      Upsert/delete igual que `setLessonCompleted`: el toggle vive del lado
      del cliente, acá solo se persiste el estado final. */
  async setFavorite(userId: string, courseId: string, saved: boolean, actor: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId }, select: { id: true } });
    if (!course) throw new NotFoundException('Curso no encontrado');

    if (saved) {
      await this.prisma.courseFavorite.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: { updatedBy: actor },
        create: { userId, courseId, createdBy: actor, updatedBy: actor },
      });
    } else {
      await this.prisma.courseFavorite.deleteMany({ where: { userId, courseId } });
    }

    return { courseId, saved };
  }

  /** IDs de los cursos que el usuario tiene guardados — para pintar el
      estado del botón "Guardar" en cada ficha sin pedir curso por curso. */
  async findMyFavoriteCourseIds(userId: string): Promise<string[]> {
    const favorites = await this.prisma.courseFavorite.findMany({
      where: { userId },
      select: { courseId: true },
    });
    return favorites.map((f) => f.courseId);
  }

  /** Alta de una fase del curso — el `order` se asigna solo, correlativo a
      las fases que ya existen (nunca lo elige quien la crea). */
  async createPhase(courseId: string, title: string, actor: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId }, select: { id: true } });
    if (!course) throw new NotFoundException('Curso no encontrado');
    const trimmed = title.trim();
    /* Idempotente por título: un doble clic en "Crear" (o reintentar con el
       mismo nombre) reusa la fase existente en vez de crear un duplicado con
       el mismo "Fase N: título" en el desplegable. */
    const existing = await this.prisma.phase.findFirst({
      where: { courseId, title: { equals: trimmed, mode: 'insensitive' } },
    });
    if (existing) return existing;
    const count = await this.prisma.phase.count({ where: { courseId } });
    return this.prisma.phase.create({
      data: { courseId, title: trimmed, order: count + 1, createdBy: actor, updatedBy: actor },
    });
  }

  findPhases(courseId: string) {
    return this.prisma.phase.findMany({ where: { courseId }, orderBy: { order: 'asc' } });
  }

  async removePhase(id: string) {
    const phase = await this.prisma.phase.findUnique({ where: { id } });
    if (!phase) throw new NotFoundException('Fase no encontrada');
    await this.prisma.phase.delete({ where: { id } });
    return { id, deleted: true };
  }
}

import type { Prisma } from '../prisma/generated';
import { DataScope } from '@app/contracts';

/**
 * Traduce un DataScope al `where` de Inscription.
 *
 *  · all        → sin filtro.
 *  · instructor → inscripciones de los cursos que creó (courses.created_by
 *                 guarda el correo del actor, no su UUID).
 *  · user       → solo las del propio usuario.
 *
 * Si el alcance viene ausente o mal formado se devuelve un filtro que no
 * puede satisfacer ninguna fila: ante la duda se muestra de menos, no de más.
 */
const MATCH_NOTHING: Prisma.InscriptionWhereInput = {
  id: '00000000-0000-0000-0000-000000000000',
};

export function inscriptionWhereFor(
  scope: DataScope | undefined,
): Prisma.InscriptionWhereInput {
  switch (scope?.kind) {
    case 'all':
      return {};
    case 'instructor':
      return scope.instructorEmail
        ? { course: { createdBy: scope.instructorEmail } }
        : MATCH_NOTHING;
    case 'user':
      return scope.userId ? { userId: scope.userId } : MATCH_NOTHING;
    default:
      return MATCH_NOTHING;
  }
}

const COURSE_MATCH_NOTHING: Prisma.CourseWhereInput = {
  id: '00000000-0000-0000-0000-000000000000',
};

/**
 * Traduce un DataScope al `where` de Course.
 *
 *  · all        → todos los cursos de la plataforma.
 *  · instructor → los que él creó.
 *  · user       → solo aquellos en los que está inscrito.
 *
 * Nota: esto acota el catálogo *dentro del portal*. El descubrimiento de
 * cursos nuevos vive en el landing público (COURSE_FIND_PUBLISHED), que no
 * pasa por este filtro.
 */
export function courseWhereFor(
  scope: DataScope | undefined,
): Prisma.CourseWhereInput {
  switch (scope?.kind) {
    case 'all':
      return {};
    case 'instructor':
      return scope.instructorEmail
        ? { createdBy: scope.instructorEmail }
        : COURSE_MATCH_NOTHING;
    case 'user':
      return scope.userId
        ? { inscriptions: { some: { userId: scope.userId } } }
        : COURSE_MATCH_NOTHING;
    default:
      return COURSE_MATCH_NOTHING;
  }
}

/** Lecciones visibles = las de los cursos visibles bajo el mismo alcance. */
export function lessonWhereFor(
  scope: DataScope | undefined,
): Prisma.LessonWhereInput {
  return scope?.kind === 'all' ? {} : { course: courseWhereFor(scope) };
}

/**
 * Alcance de datos de una consulta — lo resuelve el gateway a partir del
 * JWT y viaja por NATS a cada microservicio, que lo traduce a un filtro.
 *
 *  · all        → admin: estadísticas generales de toda la plataforma.
 *  · instructor → docente: solo los alumnos inscritos en los cursos que creó
 *                 (`courses.created_by` guarda el correo del actor).
 *  · user       → alumno: únicamente sus propios registros.
 */
export type DataScope =
  | { kind: 'all' }
  | { kind: 'instructor'; instructorEmail: string }
  | { kind: 'user'; userId: string }
  | { kind: 'none' };

/** Alcance por defecto cuando no llega ninguno: no devuelve nada. */
export const DENY_ALL_SCOPE: DataScope = { kind: 'none' };

/**
 * enrollableCourses.ts — helpers del catálogo de inscripción.
 * Los comparten la sección de "Mis cursos" y la página /learning/catalog.
 */

import type { Course, Inscription, PublicCourse } from './types';

/** Ids de curso en los que el usuario ya está inscrito. */
export function enrolledCourseIds(inscriptions: Inscription[]): Set<string> {
  return new Set(
    inscriptions
      .map((i) => i.course?.id)
      .filter((id): id is string => Boolean(id)),
  );
}

/** Cursos publicados que el usuario todavía no cursa. */
export function enrollableCourses(
  published: PublicCourse[],
  inscriptions: Inscription[],
): PublicCourse[] {
  const taken = enrolledCourseIds(inscriptions);
  return published.filter((c) => !taken.has(c.id));
}

/**
 * Adapta la proyección pública al modelo completo que esperan CheckoutModal y
 * CourseContentView. Los campos que la proyección no trae se rellenan con
 * valores neutros — nunca inventados.
 */
export function toCourse(c: PublicCourse): Course {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    status: c.status,
    level: c.level,
    coverImageUrl: c.coverImageUrl ?? null,
    durationMinutes: c.durationMinutes ?? undefined,
    price: c.price,
    currency: c.currency,
    isFree: c.isFree,
  };
}

/** Un curso exige pago cuando no es gratuito y tiene precio mayor a cero. */
export function requiresPayment(c: Pick<PublicCourse, 'isFree' | 'price'>): boolean {
  return !c.isFree && (c.price ?? 0) > 0;
}

/** Etiqueta de precio para la tarjeta. */
export function priceLabel(c: Pick<PublicCourse, 'isFree' | 'price' | 'currency'>): string {
  if (!requiresPayment(c)) return 'Gratis';
  return new Intl.NumberFormat('es', {
    style: 'currency',
    currency: c.currency ?? 'USD',
  }).format(c.price ?? 0);
}

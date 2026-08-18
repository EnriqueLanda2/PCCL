import type { Lesson, Phase } from './types';

/**
 * Orden de la fase en la que va el alumno dentro de un curso: la más baja
 * entre las fases que todavía tienen alguna lección sin completar. Si no hay
 * fases, o ya no queda ninguna lección de fase pendiente, devuelve Infinity
 * — nada queda "por delante" y no hay nada que advertir.
 */
export function currentPhaseOrder(
  phases: Phase[] | undefined,
  lessons: Lesson[],
  completedIds?: ReadonlySet<string>,
): number {
  if (!phases || phases.length === 0) return Infinity;
  const orderByPhase = new Map(phases.map((p) => [p.id, p.order]));
  const incompleteOrders = lessons
    .filter((l) => l.phaseId && !(l.completed || completedIds?.has(l.id)))
    .map((l) => orderByPhase.get(l.phaseId as string) ?? Infinity);
  return incompleteOrders.length ? Math.min(...incompleteOrders) : Infinity;
}

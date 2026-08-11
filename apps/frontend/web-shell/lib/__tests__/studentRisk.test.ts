/* Reglas de riesgo de abandono. Son reglas de negocio con umbrales exactos,
   así que se prueban los bordes: justo en 50 % y justo en 20 días. */

import { describe, expect, it } from 'vitest';
import {
  RISK_MAX_PROGRESS,
  RISK_MIN_DAYS,
  accessTypeOf,
  assessInscription,
  assessStudent,
  riskMessage,
} from '../studentRisk';
import type { Inscription } from '../types';

const NOW = new Date('2026-08-10T12:00:00Z').getTime();

function daysAgo(days: number): string {
  return new Date(NOW - days * 86_400_000).toISOString();
}

/** Inscripción mensual por defecto: `endDate` marca la mensualidad. */
function inscription(overrides: Partial<Inscription> = {}): Inscription {
  return {
    id: 'ins-1',
    status: 'in-progress',
    progressPercentage: 20,
    completedAt: null,
    createdAt: daysAgo(30),
    startDate: daysAgo(30),
    endDate: daysAgo(-1), // acceso vigente → mensualidad
    course: { id: 'c-1', title: 'Bases de datos con PostgreSQL' } as Inscription['course'],
    ...overrides,
  };
}

describe('tipo de acceso', () => {
  it('con endDate es mensualidad', () => {
    expect(accessTypeOf({ endDate: daysAgo(-5) })).toBe('monthly');
  });

  it('sin endDate es acceso permanente', () => {
    expect(accessTypeOf({ endDate: null })).toBe('permanent');
    expect(accessTypeOf({ endDate: undefined })).toBe('permanent');
  });
});

describe('riesgo de abandono', () => {
  it('marca riesgo con poco avance y mensualidad antigua', () => {
    const result = assessInscription(inscription({ progressPercentage: 20, createdAt: daysAgo(30) }), NOW);
    expect(result.risk).toBe('at-risk');
    expect(result.reason).toContain('30 días');
  });

  it('NO marca riesgo si el avance llega al umbral', () => {
    const result = assessInscription(
      inscription({ progressPercentage: RISK_MAX_PROGRESS, createdAt: daysAgo(60) }),
      NOW,
    );
    expect(result.risk).toBe('none');
  });

  it('NO marca riesgo justo en el día límite: hacen falta MÁS de 20', () => {
    const atLimit = assessInscription(
      inscription({ progressPercentage: 10, createdAt: daysAgo(RISK_MIN_DAYS) }),
      NOW,
    );
    expect(atLimit.risk).toBe('none');

    const pastLimit = assessInscription(
      inscription({ progressPercentage: 10, createdAt: daysAgo(RISK_MIN_DAYS + 1) }),
      NOW,
    );
    expect(pastLimit.risk).toBe('at-risk');
  });

  it('NO marca riesgo en cursos de acceso permanente, por bajo que sea el avance', () => {
    const result = assessInscription(
      inscription({ endDate: null, progressPercentage: 3, createdAt: daysAgo(400) }),
      NOW,
    );
    expect(result.risk).toBe('none');
    expect(result.accessType).toBe('permanent');
  });

  it('NO marca riesgo si el curso está terminado', () => {
    expect(assessInscription(inscription({ status: 'completed', progressPercentage: 10 }), NOW).risk)
      .toBe('none');
    expect(assessInscription(inscription({ progressPercentage: 100 }), NOW).risk).toBe('none');
  });

  it('sin fecha de compra no afirma riesgo', () => {
    /* No se puede sostener que hayan pasado 20 días si no se sabe cuándo
       compró. Es preferible no señalar a señalar en falso. */
    const result = assessInscription(
      inscription({ createdAt: undefined, startDate: null, progressPercentage: 5 }),
      NOW,
    );
    expect(result.risk).toBe('none');
    expect(result.daysSincePurchase).toBeNull();
  });
});

describe('abandono', () => {
  it('una mensualidad dada de baja cuenta como abandono', () => {
    const result = assessInscription(inscription({ status: 'dropped' }), NOW);
    expect(result.risk).toBe('abandoned');
    expect(result.reason).toContain('baja');
  });

  it('una baja en acceso permanente NO cuenta como abandono de mensualidad', () => {
    const result = assessInscription(inscription({ status: 'dropped', endDate: null }), NOW);
    expect(result.risk).toBe('none');
  });
});

describe('resumen por alumno', () => {
  it('el abandono pesa más que el riesgo', () => {
    const summary = assessStudent(
      [
        inscription({ id: 'a', progressPercentage: 10, createdAt: daysAgo(40) }),
        inscription({ id: 'b', status: 'dropped', course: { id: 'c-2', title: 'APIs REST' } as Inscription['course'] }),
      ],
      NOW,
    );
    expect(summary.level).toBe('abandoned');
    expect(summary.atRisk).toHaveLength(1);
    expect(summary.abandoned).toHaveLength(1);
  });

  it('sin cursos problemáticos no hay riesgo', () => {
    const summary = assessStudent([inscription({ progressPercentage: 90 })], NOW);
    expect(summary.level).toBe('none');
    expect(riskMessage(summary)).toBeNull();
  });

  it('el mensaje nombra el curso concreto en riesgo', () => {
    const summary = assessStudent(
      [inscription({ progressPercentage: 12, createdAt: daysAgo(45) })],
      NOW,
    );
    const message = riskMessage(summary);
    expect(message).toContain('Bases de datos con PostgreSQL');
    expect(message).toContain('12 % de avance');
  });

  it('con varios cursos afectados los nombra todos', () => {
    const summary = assessStudent(
      [
        inscription({ id: 'a', progressPercentage: 12, createdAt: daysAgo(45) }),
        inscription({
          id: 'b',
          progressPercentage: 5,
          createdAt: daysAgo(50),
          course: { id: 'c-2', title: 'APIs REST' } as Inscription['course'],
        }),
      ],
      NOW,
    );
    const message = riskMessage(summary);
    expect(message).toContain('Bases de datos con PostgreSQL');
    expect(message).toContain('APIs REST');
    expect(message).toContain('2 cursos');
  });
});

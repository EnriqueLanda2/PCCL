/* ───────────────────────────────────────────
   Catálogo versionado de componentes del avatar
   ───────────────────────────────────────────
   Todo lo de aquí es local y determinista: expresiones, poses y fondos no
   dependen de red, así que el editor sigue siendo usable aunque el proveedor
   de mallas esté caído.

   Deliberadamente NO hay URLs de avatar hardcodeadas. Un identificador de
   Ready Player Me solo es válido si existe de verdad en su servicio, y enviar
   IDs sin comprobar produciría 404 silenciosos en producción. Los avatares
   entran por el creador (ver services/avatar-provider.ts).
   ─────────────────────────────────────────── */

import type {
  AnyCatalogEntry,
  AvatarCategory,
  BackgroundEntry,
  ExpressionEntry,
  PoseEntry,
} from './types';

/* ── Expresiones ──
   Los nombres de morph target siguen la convención ARKit, que es la que
   exportan las mallas de Ready Player Me. Si un modelo no trae alguno, el
   aplicador lo ignora en vez de fallar. */
export const EXPRESSIONS: ExpressionEntry[] = [
  {
    id: 'neutral', category: 'expression', label: 'Neutral', available: true, version: 1,
    morphTargets: {},
  },
  {
    id: 'smile', category: 'expression', label: 'Sonrisa', available: true, version: 1,
    morphTargets: { mouthSmileLeft: 0.75, mouthSmileRight: 0.75, cheekSquintLeft: 0.3, cheekSquintRight: 0.3, smile: 1 },
  },
  {
    id: 'blink-left', category: 'expression', label: 'Guiño izquierdo', available: true, version: 1,
    morphTargets: { eyeBlinkLeft: 1, blinkLeft: 1 },
  },
  {
    id: 'blink-right', category: 'expression', label: 'Guiño derecho', available: true, version: 1,
    morphTargets: { eyeBlinkRight: 1, blinkRight: 1 },
  },
  {
    id: 'surprise', category: 'expression', label: 'Sorpresa', available: true, version: 1,
    morphTargets: { eyeWideLeft: 0.7, eyeWideRight: 0.7, jawOpen: 0.35, browInnerUp: 0.8, surprised: 1, mouthOpen: 0.35, browUp: 0.8 },
  },
  {
    id: 'sad', category: 'expression', label: 'Tristeza leve', available: true, version: 1,
    morphTargets: { mouthFrownLeft: 0.5, mouthFrownRight: 0.5, browInnerUp: 0.55, sad: 1, browUp: 0.35 },
  },
  {
    id: 'mouth-open', category: 'expression', label: 'Boca abierta', available: true, version: 1,
    morphTargets: { jawOpen: 0.6, mouthOpen: 1 },
  },
  {
    id: 'brows-up', category: 'expression', label: 'Cejas arriba', available: true, version: 1,
    morphTargets: { browOuterUpLeft: 0.7, browOuterUpRight: 0.7, browInnerUp: 0.4, browUp: 1 },
  },
];

/* ── Poses ──
   Rotaciones en radianes sobre la pose de descanso. Se mantienen discretas a
   propósito: una rotación agresiva sin corrección de pesos produce
   deformaciones feas en hombro y codo. */
export const POSES: PoseEntry[] = [
  {
    id: 'idle', category: 'pose', label: 'Reposo', available: true, version: 1,
    boneRotations: {},
  },
  {
    id: 'relaxed', category: 'pose', label: 'Relajada', available: true, version: 1,
    boneRotations: {
      LeftArm:  [0, 0, 0.18],
      RightArm: [0, 0, -0.18],
      LeftForeArm:  [0.12, 0, 0],
      RightForeArm: [0.12, 0, 0],
    },
  },
  {
    id: 'presenting', category: 'pose', label: 'Presentación', available: true, version: 1,
    boneRotations: {
      LeftArm:   [0, 0, 0.30],
      RightArm:  [0, 0, -0.30],
      LeftForeArm:  [0.45, 0, 0],
      RightForeArm: [0.45, 0, 0],
      Spine1: [0, 0.06, 0],
    },
  },
  {
    id: 'wave', category: 'pose', label: 'Saludo', available: true, version: 1,
    boneRotations: {
      RightArm:     [0, 0, -1.15],
      RightForeArm: [0, 0, -0.85],
      LeftArm:      [0, 0, 0.15],
    },
  },
];

/* ── Fondos ──
   Degradados neutros; ninguno satura el tono de piel ni introduce dominante de
   color que falsee el retrato exportado. */
export const BACKGROUNDS: BackgroundEntry[] = [
  { id: 'studio',  category: 'background', label: 'Estudio',  available: true, version: 1, from: '#F4F7EF', to: '#DDE7D7' },
  { id: 'mint',    category: 'background', label: 'Menta',    available: true, version: 1, from: '#EBFAF0', to: '#C9E9D6' },
  { id: 'sky',     category: 'background', label: 'Cielo',    available: true, version: 1, from: '#EDF5FF', to: '#C9DDF7' },
  { id: 'sand',    category: 'background', label: 'Arena',    available: true, version: 1, from: '#FBF6EC', to: '#EADFC8' },
  { id: 'slate',   category: 'background', label: 'Pizarra',  available: true, version: 1, from: '#EEF1F4', to: '#CFD6DE' },
  { id: 'dusk',    category: 'background', label: 'Atardecer', available: true, version: 1, from: '#17324D', to: '#0E1A26' },
];

const ALL: AnyCatalogEntry[] = [...EXPRESSIONS, ...POSES, ...BACKGROUNDS];

const INDEX = new Map<string, AnyCatalogEntry>(ALL.map((entry) => [`${entry.category}:${entry.id}`, entry]));

/** Identificadores por defecto. Se usan tanto al crear un avatar nuevo como al
 *  reparar una configuración que apunta a una entrada retirada. */
export const CATALOG_DEFAULTS = {
  expression: 'neutral',
  pose: 'idle',
  background: 'studio',
} as const;

export function getEntry<T extends AnyCatalogEntry>(category: AvatarCategory, id: string): T | null {
  return (INDEX.get(`${category}:${id}`) as T | undefined) ?? null;
}

export function listEntries(category: AvatarCategory): AnyCatalogEntry[] {
  return ALL.filter((entry) => entry.category === category && entry.available);
}

/** Resuelve un id contra el catálogo y cae al valor por defecto si no existe o
 *  fue retirado. Nunca lanza: una entrada ausente no debe romper el editor. */
export function resolveOrDefault(
  category: 'expression' | 'pose' | 'background',
  id: string | undefined,
): string {
  const entry = id ? getEntry(category, id) : null;
  return entry?.available ? entry.id : CATALOG_DEFAULTS[category];
}

export function getExpression(id: string): ExpressionEntry {
  return getEntry<ExpressionEntry>('expression', resolveOrDefault('expression', id))!;
}

export function getPose(id: string): PoseEntry {
  return getEntry<PoseEntry>('pose', resolveOrDefault('pose', id))!;
}

export function getBackground(id: string): BackgroundEntry {
  return getEntry<BackgroundEntry>('background', resolveOrDefault('background', id))!;
}

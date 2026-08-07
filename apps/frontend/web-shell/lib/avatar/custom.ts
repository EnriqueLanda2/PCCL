/* ───────────────────────────────────────────
   Proveedor `custom` — catálogo propio de PCCL
   ───────────────────────────────────────────
   Todo lo que aquí se lee sale de `public/avatars/custom/manifest.json`, que
   genera el pipeline a partir de los reportes reales de Blender. Ninguna cifra
   ni ruta se escribe a mano: si el manifest y los assets se desincronizan, lo
   detecta `avatar:validate` antes de llegar al navegador.

   La configuración del usuario guarda SIEMPRE identificadores estables
   (`pieceId`), nunca rutas ni mallas. Así una revisión del catálogo puede mover
   archivos sin invalidar lo que la gente tenga guardado.
   ─────────────────────────────────────────── */

import manifest from '@/public/avatars/custom/manifest.json';
import type { AvatarGender } from './types';

export const CUSTOM_RIG_ID = 'pccl-human-rig-v1';

/** Nombres semánticos → huesos reales del rig propio. Las poses del catálogo
 *  se expresan en huesos semánticos y se resuelven aquí. */
export const CUSTOM_BONE_MAP = {
  hips: 'Hips',
  spine: 'Spine',
  chest: 'Spine1',
  neck: 'Neck',
  head: 'Head',
  leftShoulder: 'LeftShoulder',
  leftUpperArm: 'LeftArm',
  leftLowerArm: 'LeftForeArm',
  leftHand: 'LeftHand',
  rightShoulder: 'RightShoulder',
  rightUpperArm: 'RightArm',
  rightLowerArm: 'RightForeArm',
  rightHand: 'RightHand',
  leftUpperLeg: 'LeftUpLeg',
  leftLowerLeg: 'LeftLeg',
  leftFoot: 'LeftFoot',
  rightUpperLeg: 'RightUpLeg',
  rightLowerLeg: 'RightLeg',
  rightFoot: 'RightFoot',
} as const;

/** Nombres canónicos propios de los morph targets. La traducción desde ARKit
 *  (que es lo que expone Ready Player Me) vive en `provider.ts`, de modo que el
 *  catálogo no depende de la convención de ningún proveedor externo. */
export const CUSTOM_MORPH_MAP = {
  blinkLeft: 'blinkLeft',
  blinkRight: 'blinkRight',
  smile: 'smile',
  mouthOpen: 'mouthOpen',
  browUp: 'browUp',
  surprised: 'surprised',
  sad: 'sad',
} as const;

export type CustomCategory = 'hair' | 'tops' | 'bottoms' | 'shoes' | 'accessories';

export interface CustomBodyEntry {
  id: string;
  revision: number;
  label: string;
  url: string;
  thumbnail: string;
  genders: string[];
  triangles: number;
  bytes: number;
}

export interface CustomPieceEntry {
  /** Id único dentro del manifest (incluye el cuerpo si la pieza es modular). */
  id: string;
  /** Id estable de la pieza, común a todos los cuerpos. Es lo que se persiste. */
  pieceId: string;
  revision: number;
  label: string;
  /** `bundled` viaja dentro del GLB del cuerpo; `lazy` se descarga aparte. */
  delivery: 'bundled' | 'lazy';
  /** Nodo dentro del GLB del cuerpo (solo `bundled`). */
  meshName?: string;
  /** URL propia (solo `lazy`). */
  url?: string;
  /** Nodo empaquetado que hay que ocultar al usar esta pieza (solo `lazy`). */
  hidesMesh?: string;
  thumbnail?: string;
  compatibleBodies: string[];
  triangles: number;
  bytes: number;
}

/* ── Seguridad de rutas ── */

/**
 * Toda ruta del catálogo propio debe vivir bajo un prefijo permitido. Se
 * rechaza cualquier intento de traversal y cualquier extensión inesperada: una
 * URL de avatar termina en un fetch y en el grafo de la escena.
 */
export function validateCustomPath(path: string, extension = '.glb'): boolean {
  return (
    typeof path === 'string' &&
    path.startsWith('/avatars/custom/') &&
    !path.includes('..') &&
    !path.includes('\\') &&
    path.toLowerCase().endsWith(extension)
  );
}

/* ── Cuerpos ── */

export function listCustomBodies(): CustomBodyEntry[] {
  return (manifest.bodies as CustomBodyEntry[]).filter((body) => validateCustomPath(body.url));
}

export function resolveCustomBody(
  bodyId: string | undefined,
  gender: AvatarGender = 'androgynous',
): CustomBodyEntry {
  const bodies = listCustomBodies();
  const exact = bodies.find((body) => body.id === bodyId);
  if (exact) return exact;
  /* Sin coincidencia exacta se prefiere el cuerpo cuyo género PRINCIPAL es el
     pedido; sólo después uno que lo admita como secundario. */
  const byPrimaryGender = bodies.find((body) => body.genders[0] === gender);
  const byGender = byPrimaryGender ?? bodies.find((body) => body.genders.includes(gender));
  const fallback = byGender ?? bodies.find((body) => body.id === 'neutral-base') ?? bodies[0];
  if (!fallback) throw new Error('No hay modelos custom de avatar disponibles.');
  return fallback;
}

export function bodyIdForGender(gender: AvatarGender): string {
  return resolveCustomBody(undefined, gender).id;
}

export function resolveCustomAvatarUrl(bodyId: string | undefined, gender: AvatarGender): string | null {
  const body = resolveCustomBody(bodyId, gender);
  return validateCustomPath(body.url) ? body.url : null;
}

/* ── Piezas del catálogo ── */

function normalisePiece(raw: Record<string, unknown>): CustomPieceEntry {
  return {
    id: String(raw.id),
    pieceId: String(raw.pieceId ?? raw.id),
    revision: Number(raw.revision ?? 1),
    label: String(raw.label ?? raw.id),
    delivery: raw.delivery === 'lazy' ? 'lazy' : 'bundled',
    meshName: typeof raw.meshName === 'string' ? raw.meshName : undefined,
    url: typeof raw.url === 'string' ? raw.url : undefined,
    hidesMesh: typeof raw.hidesMesh === 'string' ? raw.hidesMesh : undefined,
    thumbnail: typeof raw.thumbnail === 'string' ? raw.thumbnail : undefined,
    compatibleBodies: Array.isArray(raw.compatibleBodies) ? raw.compatibleBodies.map(String) : [],
    triangles: Number(raw.triangles ?? 0),
    bytes: Number(raw.bytes ?? 0),
  };
}

/** Piezas de una categoría que encajan en un cuerpo concreto. */
export function listCustomPieces(category: CustomCategory, bodyId: string): CustomPieceEntry[] {
  const raw = (manifest as unknown as Record<string, Record<string, unknown>[]>)[category] ?? [];
  return raw
    .filter((entry) => entry.id !== 'none')
    .map(normalisePiece)
    .filter((piece) => piece.compatibleBodies.includes(bodyId))
    /* Una pieza modular con URL inválida se descarta en lugar de llegar al
       cargador: es la última barrera antes de un fetch. */
    .filter((piece) => piece.delivery === 'bundled' || validateCustomPath(piece.url ?? ''));
}

/** Pieza por defecto de una categoría: la empaquetada en el propio cuerpo. */
export function defaultPieceId(category: CustomCategory, bodyId: string): string {
  const pieces = listCustomPieces(category, bodyId);
  const bundled = pieces.find((piece) => piece.delivery === 'bundled');
  return (bundled ?? pieces[0])?.pieceId ?? 'none';
}

/**
 * Resuelve un `pieceId` guardado contra el catálogo actual. Si la pieza ya no
 * existe (o nunca fue compatible con este cuerpo) se devuelve la de por
 * defecto: una revisión antigua del catálogo no debe romper el editor.
 */
export function resolveCustomPiece(
  category: CustomCategory,
  bodyId: string,
  pieceId: string | undefined,
): CustomPieceEntry | null {
  const pieces = listCustomPieces(category, bodyId);
  if (pieces.length === 0) return null;
  if (pieceId === 'none' && category === 'accessories') return null;
  const exact = pieces.find((piece) => piece.pieceId === pieceId);
  if (exact) return exact;
  return pieces.find((piece) => piece.delivery === 'bundled') ?? pieces[0];
}

/** Nodos empaquetados que deben ocultarse dado un conjunto de piezas elegidas. */
export function hiddenMeshNames(bodyId: string, selected: Partial<Record<CustomCategory, string>>): string[] {
  const hidden: string[] = [];
  for (const category of ['hair', 'tops', 'bottoms', 'shoes'] as CustomCategory[]) {
    const chosen = resolveCustomPiece(category, bodyId, selected[category]);
    for (const piece of listCustomPieces(category, bodyId)) {
      /* Se oculta toda pieza empaquetada que no sea la elegida. Es lo que
         permite que el GLB del cuerpo traiga el conjunto por defecto puesto y
         aun así se pueda cambiar de prenda. */
      if (piece.delivery === 'bundled' && piece.meshName && piece.pieceId !== chosen?.pieceId) {
        hidden.push(piece.meshName);
      }
    }
    if (chosen?.delivery === 'lazy' && chosen.hidesMesh) hidden.push(chosen.hidesMesh);
  }
  return [...new Set(hidden)];
}

/** Piezas modulares que hay que descargar para la selección actual. */
export function lazyPieces(bodyId: string, selected: Partial<Record<CustomCategory, string>>): CustomPieceEntry[] {
  const pieces: CustomPieceEntry[] = [];
  for (const category of ['hair', 'tops', 'bottoms', 'shoes', 'accessories'] as CustomCategory[]) {
    const chosen = resolveCustomPiece(category, bodyId, selected[category]);
    if (chosen?.delivery === 'lazy' && chosen.url) pieces.push(chosen);
  }
  return pieces;
}

/* ── Tintes de material ──
   El color no genera assets nuevos: se aplica como tinte sobre el material del
   GLB (README §7.2). Los nombres coinciden con los materiales que crea
   `tools/blender/create_materials.py`. */

export interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

export const SKIN_TONES: ColorOption[] = [
  { id: 'porcelain', label: 'Porcelana', hex: '#F2C6A0' },
  { id: 'sand', label: 'Arena', hex: '#E0A578' },
  { id: 'amber', label: 'Ámbar', hex: '#C8814E' },
  { id: 'umber', label: 'Umbra', hex: '#8E5632' },
  { id: 'espresso', label: 'Espresso', hex: '#5E3620' },
];

export const HAIR_COLORS: ColorOption[] = [
  { id: 'ink', label: 'Tinta', hex: '#1B1614' },
  { id: 'chestnut', label: 'Castaño', hex: '#4A2A18' },
  { id: 'auburn', label: 'Caoba', hex: '#8A3E1C' },
  { id: 'sand', label: 'Rubio', hex: '#C9974A' },
  { id: 'ash', label: 'Ceniza', hex: '#6E6A66' },
];

export const EYE_COLORS: ColorOption[] = [
  { id: 'forest', label: 'Verde', hex: '#3A6B52' },
  { id: 'ocean', label: 'Azul', hex: '#2E5C7A' },
  { id: 'hazel', label: 'Miel', hex: '#7A5326' },
  { id: 'slate', label: 'Gris', hex: '#4C555C' },
];

export const GARMENT_COLORS: ColorOption[] = [
  { id: 'lagoon', label: 'Laguna', hex: '#2F6E8F' },
  { id: 'moss', label: 'Musgo', hex: '#57C43A' },
  { id: 'ember', label: 'Ámbar', hex: '#E08A2E' },
  { id: 'plum', label: 'Ciruela', hex: '#6B3F63' },
  { id: 'slate', label: 'Pizarra', hex: '#2B3242' },
];

/** Materiales del GLB afectados por cada control de color de la UI. */
export const TINT_TARGETS = {
  skin: ['PCCL_Skin'],
  hair: ['PCCL_Hair'],
  eyes: ['PCCL_EyeIris'],
  top: ['PCCL_TopA', 'PCCL_TopB'],
  bottom: ['PCCL_BottomA', 'PCCL_BottomB'],
  shoes: ['PCCL_ShoeA', 'PCCL_ShoeB'],
} as const;

export type TintChannel = keyof typeof TINT_TARGETS;

const PALETTE_BY_CHANNEL: Record<TintChannel, ColorOption[]> = {
  skin: SKIN_TONES,
  hair: HAIR_COLORS,
  eyes: EYE_COLORS,
  top: GARMENT_COLORS,
  bottom: GARMENT_COLORS,
  shoes: GARMENT_COLORS,
};

export function listColorOptions(channel: TintChannel): ColorOption[] {
  return PALETTE_BY_CHANNEL[channel];
}

/** Resuelve un id de color a hex, cayendo al primero de la paleta si no existe. */
export function resolveColor(channel: TintChannel, id: string | undefined): ColorOption {
  const palette = PALETTE_BY_CHANNEL[channel];
  return palette.find((option) => option.id === id) ?? palette[0];
}

/* ── Validación del manifest ── */

/**
 * Comprobación defensiva del manifest antes de consumirlo. No sustituye a
 * `avatar:validate` (que es exhaustivo y corre en el pipeline); cubre el caso
 * de que se despliegue un manifest corrupto o de otra versión.
 */
export function validateCustomManifest(): boolean {
  if (manifest.schemaVersion !== 1) return false;
  if (manifest.rig?.id !== CUSTOM_RIG_ID) return false;

  const bodies = listCustomBodies();
  if (bodies.length < 3) return false;
  const wellFormed = bodies.every(
    (body) =>
      body.revision > 0 &&
      body.bytes > 0 &&
      body.triangles > 0 &&
      body.triangles <= 60000 &&
      validateCustomPath(body.thumbnail, '.png'),
  );
  if (!wellFormed) return false;

  /* Cada cuerpo debe tener al menos una opción por categoría vestible, o el
     editor mostraría categorías vacías. */
  return bodies.every((body) =>
    (['hair', 'tops', 'bottoms', 'shoes'] as CustomCategory[]).every(
      (category) => listCustomPieces(category, body.id).length > 0,
    ),
  );
}

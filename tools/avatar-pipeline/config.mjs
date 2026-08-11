/**
 * Configuración compartida del pipeline de avatares.
 *
 * Los scripts se invocan desde el workspace `frontend` (vía `pnpm --filter`) o
 * desde la raíz del repositorio, así que la raíz se deriva de la ubicación de
 * este archivo y no del directorio de trabajo.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(HERE, '../..');
export const WEB_SHELL = path.join(REPO_ROOT, 'apps/frontend/web-shell');
export const PUBLIC_DIR = path.join(WEB_SHELL, 'public/avatars/custom');
export const REPORTS_DIR = path.join(PUBLIC_DIR, 'reports');

/**
 * Blender exporta aquí, fuera de `public/`. Solo el resultado optimizado se
 * publica, de modo que el cliente nunca descarga el GLB sin comprimir ni queda
 * un duplicado pesado servido por accidente.
 */
export const RAW_DIR = path.join(REPO_ROOT, 'assets/avatar-source/glb-raw');

/** Subcarpetas de assets, en el orden en que se generan. */
export const ASSET_DIRS = [
  'bodies', 'hair', 'clothing', 'accessories', 'thumbnails', 'portraits', 'figures',
];

/**
 * Retratos por cuerpo de la galería compartida.
 *
 * Es la reserva de avatares que usa toda la aplicación para un alumno que
 * todavía no ha personalizado el suyo. Se pre-renderizan con cámara y luz
 * idénticas para que todos los avatares de la app se vean del mismo sistema.
 */
export const PORTRAITS_PER_BODY = 8;

/** Prefijo permitido para cualquier URL del catálogo propio (README §15). */
export const SAFE_URL_PREFIX = '/avatars/custom/';

export const RIG_ID = 'pccl-human-rig-v1';

export const REQUIRED_BONES = [
  'Root', 'Hips', 'Spine', 'Spine1', 'Neck', 'Head',
  'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand',
  'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand',
  'LeftUpLeg', 'LeftLeg', 'LeftFoot',
  'RightUpLeg', 'RightLeg', 'RightFoot',
];

export const REQUIRED_MORPHS = [
  'blinkLeft', 'blinkRight', 'smile', 'mouthOpen', 'browUp', 'surprised', 'sad',
];

export const REQUIRED_ANIMATIONS = ['Idle', 'Breathing', 'Wave', 'Presentation'];

/** Presupuestos de entrega (README §9). */
export const BUDGETS = {
  /** Descarga del avatar visible inicial. */
  bodyBytesMax: 12 * 1024 * 1024,
  bodyBytesTarget: 8 * 1024 * 1024,
  /** Triángulos del conjunto visible simultáneamente. */
  visibleTrianglesMax: 60000,
  textureMaxSize: 2048,
};

export const VARIANTS = [
  {
    bodyId: 'female-base',
    variant: 'feminine',
    blend: 'avatar-female.blend',
    label: 'Humana femenina PCCL',
    gender: 'feminine',
    skinTone: 'porcelain',
    hairTone: 'auburn',
  },
  {
    bodyId: 'male-base',
    variant: 'masculine',
    blend: 'avatar-male.blend',
    label: 'Humano masculino PCCL',
    gender: 'masculine',
    skinTone: 'umber',
    hairTone: 'ink',
  },
  {
    bodyId: 'neutral-base',
    variant: 'androgynous',
    blend: 'avatar-neutral.blend',
    label: 'Base neutral PCCL',
    gender: 'androgynous',
    skinTone: 'sand',
    hairTone: 'chestnut',
  },
];

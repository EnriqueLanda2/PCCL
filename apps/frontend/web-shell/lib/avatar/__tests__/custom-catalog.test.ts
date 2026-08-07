/* Contrato del catálogo propio: vestuario, tintes, compatibilidad de rig y
   degradación cuando una pieza desaparece. Complementa `avatar.test.ts`, que
   cubre serialización, migraciones, store y Ready Player Me. */

import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest';
import manifest from '@/public/avatars/custom/manifest.json';
import {
  CUSTOM_BONE_MAP,
  CUSTOM_MORPH_MAP,
  CUSTOM_RIG_ID,
  defaultPieceId,
  hiddenMeshNames,
  lazyPieces,
  listColorOptions,
  listCustomBodies,
  listCustomPieces,
  resolveColor,
  resolveCustomBody,
  resolveCustomPiece,
  validateCustomManifest,
  validateCustomPath,
  type CustomCategory,
} from '../custom';
import { adaptMorphTargets, resolveBoneName } from '../provider';
import { createDefaultConfiguration, defaultWardrobe, parseConfiguration } from '../serialization';
import { useAvatarStore } from '../store';
import { AVATAR_SCHEMA_VERSION } from '../types';

const WEARABLE: CustomCategory[] = ['hair', 'tops', 'bottoms', 'shoes'];
const BODY_IDS = ['female-base', 'male-base', 'neutral-base'];

describe('manifest del catálogo propio', () => {
  it('pasa la validación defensiva', () => {
    expect(validateCustomManifest()).toBe(true);
  });

  it('declara los tres cuerpos con assets reales y miniatura PNG', () => {
    const bodies = listCustomBodies();
    expect(bodies.map((body) => body.id).sort()).toEqual([...BODY_IDS].sort());
    for (const body of bodies) {
      expect(validateCustomPath(body.url)).toBe(true);
      expect(validateCustomPath(body.thumbnail, '.png')).toBe(true);
      expect(body.bytes).toBeGreaterThan(0);
      expect(body.triangles).toBeGreaterThan(0);
    }
  });

  it('respeta el presupuesto de triángulos visibles y de descarga inicial', () => {
    for (const body of listCustomBodies()) {
      expect(body.triangles).toBeLessThanOrEqual(60_000);
      expect(body.bytes).toBeLessThanOrEqual(12 * 1024 * 1024);
    }
  });

  it('todas las URLs del catálogo quedan bajo el prefijo permitido', () => {
    const urls = [
      ...manifest.bodies.map((body) => body.url),
      ...['hair', 'tops', 'bottoms', 'shoes', 'accessories'].flatMap((category) =>
        ((manifest as unknown as Record<string, { url?: string }[]>)[category] ?? [])
          .map((entry) => entry.url)
          .filter((url): url is string => typeof url === 'string'),
      ),
    ];
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(validateCustomPath(url)).toBe(true);
  });
});

describe('resolución de piezas', () => {
  it('cada cuerpo ofrece al menos dos opciones por categoría vestible', () => {
    for (const bodyId of BODY_IDS) {
      for (const category of WEARABLE) {
        const distinct = new Set(listCustomPieces(category, bodyId).map((piece) => piece.pieceId));
        expect(distinct.size).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('la pieza por defecto viaja empaquetada dentro del GLB del cuerpo', () => {
    for (const bodyId of BODY_IDS) {
      for (const category of WEARABLE) {
        const piece = resolveCustomPiece(category, bodyId, defaultPieceId(category, bodyId));
        expect(piece?.delivery).toBe('bundled');
        expect(piece?.meshName).toBeTruthy();
      }
    }
  });

  it('un pieceId desconocido cae a la pieza por defecto en vez de romper', () => {
    const piece = resolveCustomPiece('tops', 'neutral-base', 'prenda-que-no-existe');
    expect(piece).not.toBeNull();
    expect(piece?.pieceId).toBe(defaultPieceId('tops', 'neutral-base'));
  });

  it('no ofrece piezas de un cuerpo distinto', () => {
    for (const bodyId of BODY_IDS) {
      for (const piece of listCustomPieces('tops', bodyId)) {
        expect(piece.compatibleBodies).toContain(bodyId);
      }
    }
  });

  it('todas las piezas declaran compatibilidad con el rig publicado', () => {
    expect(manifest.rig.id).toBe(CUSTOM_RIG_ID);
    for (const body of manifest.bodies) {
      expect(body.compatibleRigs).toContain(CUSTOM_RIG_ID);
    }
  });
});

describe('visibilidad y descarga bajo demanda', () => {
  it('oculta las prendas empaquetadas que no están seleccionadas', () => {
    const bodyId = 'neutral-base';
    const alternate = listCustomPieces('tops', bodyId).find((piece) => piece.delivery === 'lazy');
    expect(alternate).toBeDefined();

    const hidden = hiddenMeshNames(bodyId, { tops: alternate!.pieceId });
    expect(hidden).toContain(alternate!.hidesMesh);
  });

  it('con el conjunto por defecto no hay nada que descargar aparte', () => {
    const bodyId = 'neutral-base';
    const wardrobe = defaultWardrobe(bodyId);
    const pending = lazyPieces(bodyId, {
      hair: wardrobe.hairId,
      tops: wardrobe.topId,
      bottoms: wardrobe.bottomId,
      shoes: wardrobe.shoesId,
      accessories: wardrobe.accessoryId,
    });
    expect(pending).toHaveLength(0);
  });

  it('elegir una alternativa produce exactamente una descarga con URL segura', () => {
    const bodyId = 'neutral-base';
    const alternate = listCustomPieces('hair', bodyId).find((piece) => piece.delivery === 'lazy');
    const pending = lazyPieces(bodyId, { hair: alternate!.pieceId });
    expect(pending).toHaveLength(1);
    expect(validateCustomPath(pending[0].url ?? '')).toBe(true);
  });
});

describe('adaptador del proveedor', () => {
  it('traduce nombres ARKit a los morph targets propios', () => {
    const adapted = adaptMorphTargets('custom', { eyeBlinkLeft: 1, jawOpen: 0.6 });
    expect(adapted.blinkLeft).toBe(1);
    expect(adapted.mouthOpen).toBe(0.6);
  });

  it('al colapsar varios ARKit en un morph propio conserva el peso mayor', () => {
    const adapted = adaptMorphTargets('custom', { mouthSmileLeft: 0.4, mouthSmileRight: 0.9 });
    expect(adapted.smile).toBe(0.9);
  });

  it('no toca los pesos de proveedores externos', () => {
    const original = { eyeBlinkLeft: 1 };
    expect(adaptMorphTargets('readyplayerme', original)).toEqual(original);
  });

  it('resuelve nombres semánticos y deja pasar los concretos', () => {
    expect(resolveBoneName('custom', 'leftUpperArm')).toBe('LeftArm');
    expect(resolveBoneName('custom', 'LeftArm')).toBe('LeftArm');
    expect(resolveBoneName('readyplayerme', 'leftUpperArm')).toBe('leftUpperArm');
  });

  it('todo el bone map apunta a huesos que el rig publicado declara', () => {
    for (const bone of Object.values(CUSTOM_BONE_MAP)) {
      expect(manifest.rig.bones).toContain(bone);
    }
  });

  it('todo el morph map existe en los morph targets publicados', () => {
    for (const morph of Object.values(CUSTOM_MORPH_MAP)) {
      expect(manifest.morphTargets).toContain(morph);
    }
  });
});

describe('tintes de material', () => {
  it('cada canal ofrece paleta y resuelve a un hex válido', () => {
    for (const channel of ['skin', 'hair', 'eyes', 'top', 'bottom', 'shoes'] as const) {
      const options = listColorOptions(channel);
      expect(options.length).toBeGreaterThan(0);
      expect(resolveColor(channel, options[0].id).hex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('un color desconocido cae al primero de su paleta', () => {
    expect(resolveColor('skin', 'no-existe').id).toBe(listColorOptions('skin')[0].id);
  });
});

describe('configuración con vestuario', () => {
  it('la configuración por defecto trae vestuario y colores resueltos', () => {
    const config = createDefaultConfiguration('feminine');
    expect(config.schemaVersion).toBe(AVATAR_SCHEMA_VERSION);
    expect(config.wardrobe.topId).toBeTruthy();
    expect(config.colors.skin).toBeTruthy();
  });

  it('migra una configuración v3 sin vestuario rellenando el conjunto por defecto', () => {
    const legacy = {
      schemaVersion: 3,
      gender: 'masculine',
      source: { provider: 'custom', id: 'male-base', bodyId: 'male-base', revision: 1, url: '/avatars/custom/bodies/male-base.glb' },
      presentation: { expressionId: 'neutral', poseId: 'idle', backgroundId: 'studio' },
      quality: 'medium',
      updatedAt: new Date().toISOString(),
    };
    const config = parseConfiguration(legacy);
    expect(config.schemaVersion).toBe(AVATAR_SCHEMA_VERSION);
    expect(config.wardrobe).toEqual(defaultWardrobe('male-base'));
    expect(config.colors.skin).toBeTruthy();
  });

  it('sustituye una pieza retirada del catálogo por la de reemplazo', () => {
    const config = parseConfiguration({
      ...createDefaultConfiguration('androgynous'),
      wardrobe: { hairId: 'peinado-retirado', topId: 'top-b', bottomId: 'x', shoesId: 'y', accessoryId: 'z' },
    });
    expect(config.wardrobe.hairId).toBe(defaultPieceId('hair', 'neutral-base'));
    /* La pieza que sí existe se conserva: reparar no debe descartar lo válido. */
    expect(config.wardrobe.topId).toBe('top-b');
  });

  it('conserva `none` como accesorio válido', () => {
    const config = parseConfiguration({
      ...createDefaultConfiguration('androgynous'),
      wardrobe: { ...defaultWardrobe('neutral-base'), accessoryId: 'none' },
    });
    expect(config.wardrobe.accessoryId).toBe('none');
  });

  it('el vestuario sobrevive a serializar y deserializar', () => {
    const config = createDefaultConfiguration('feminine');
    const restored = parseConfiguration(JSON.parse(JSON.stringify(config)));
    expect(restored.wardrobe).toEqual(config.wardrobe);
    expect(restored.colors).toEqual(config.colors);
  });
});

describe('store: vestuario, color y deshacer', () => {
  /* La suite corre en entorno `node`, sin DOM: se sustituye localStorage por un
     doble en memoria, igual que hace `avatar.test.ts`. */
  beforeEach(() => {
    const memory = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => void memory.set(key, value),
      removeItem: (key: string) => void memory.delete(key),
      clear: () => memory.clear(),
    });
    useAvatarStore.setState({
      config: createDefaultConfiguration('androgynous'),
      past: [],
      future: [],
      status: 'idle',
      error: null,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('cambiar de prenda entra en el historial y deshacer lo revierte', () => {
    const store = useAvatarStore.getState();
    const original = store.config.wardrobe.topId;
    store.setWardrobePiece('tops', 'top-b');
    expect(useAvatarStore.getState().config.wardrobe.topId).toBe('top-b');

    useAvatarStore.getState().undo();
    expect(useAvatarStore.getState().config.wardrobe.topId).toBe(original);

    useAvatarStore.getState().redo();
    expect(useAvatarStore.getState().config.wardrobe.topId).toBe('top-b');
  });

  it('cambiar de color entra en el historial', () => {
    useAvatarStore.getState().setColor('skin', 'espresso');
    expect(useAvatarStore.getState().config.colors.skin).toBe('espresso');
    useAvatarStore.getState().undo();
    expect(useAvatarStore.getState().config.colors.skin).not.toBe('espresso');
  });

  it('cambiar de cuerpo reresuelve el vestuario a piezas de ese cuerpo', () => {
    useAvatarStore.getState().setWardrobePiece('tops', 'top-b');
    useAvatarStore.getState().setCustomBody('male-base');

    const { config } = useAvatarStore.getState();
    expect(config.source.provider).toBe('custom');
    expect(config.wardrobe).toEqual(defaultWardrobe('male-base'));
    for (const category of WEARABLE) {
      const field = { hair: 'hairId', tops: 'topId', bottoms: 'bottomId', shoes: 'shoesId' } as const;
      const chosen = config.wardrobe[field[category as keyof typeof field]];
      expect(listCustomPieces(category, 'male-base').some((piece) => piece.pieceId === chosen)).toBe(true);
    }
  });

  it('aleatorizar solo elige piezas compatibles con el cuerpo actual', () => {
    const bodyId = resolveCustomBody(undefined, 'androgynous').id;
    for (let attempt = 0; attempt < 20; attempt += 1) {
      useAvatarStore.getState().randomize();
      const { wardrobe } = useAvatarStore.getState().config;
      expect(listCustomPieces('hair', bodyId).some((p) => p.pieceId === wardrobe.hairId)).toBe(true);
      expect(listCustomPieces('tops', bodyId).some((p) => p.pieceId === wardrobe.topId)).toBe(true);
    }
  });

  it('guardar y recargar restaura vestuario y colores', () => {
    useAvatarStore.getState().setWardrobePiece('shoes', 'shoes-b');
    useAvatarStore.getState().setColor('hair', 'ash');
    useAvatarStore.getState().save();

    useAvatarStore.setState({ config: createDefaultConfiguration('androgynous'), past: [], future: [] });
    useAvatarStore.getState().load();

    const { config } = useAvatarStore.getState();
    expect(config.wardrobe.shoesId).toBe('shoes-b');
    expect(config.colors.hair).toBe('ash');
  });
});

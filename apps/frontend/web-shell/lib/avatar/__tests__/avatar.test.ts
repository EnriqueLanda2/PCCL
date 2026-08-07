import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  createCustomConfiguration,
  createDefaultConfiguration,
  deserializeConfiguration,
  extractRpmId,
  isSafeAvatarUrl,
  parseConfiguration,
  serializeConfiguration,
} from '../serialization';
import { AVATAR_SCHEMA_VERSION } from '../types';
import { getExpression, getPose, getBackground, listEntries, resolveOrDefault } from '../catalog';
import { buildAvatarUrl, buildCreatorUrl, parseFrameEvent, RPM_CREATOR_ORIGIN } from '../provider';
import { useAvatarStore } from '../store';
import { CUSTOM_BONE_MAP, listCustomBodies, resolveCustomAvatarUrl, validateCustomManifest } from '../custom';

const VALID_URL = 'https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb';

describe('serialización', () => {
  it('crea modelos humanos custom por defecto', () => {
    const config = createDefaultConfiguration('feminine');
    expect(config.source.provider).toBe('custom');
    expect(config.source.url).toBe('/avatars/custom/bodies/female-base.glb');
  });

  it('ida y vuelta conserva la configuración', () => {
    const config = createDefaultConfiguration('feminine');
    const restored = deserializeConfiguration(serializeConfiguration(config));
    expect(restored).toEqual(config);
  });

  it('un JSON corrupto cae al valor por defecto sin lanzar', () => {
    expect(() => deserializeConfiguration('{ no es json')).not.toThrow();
    expect(deserializeConfiguration('{ no es json').schemaVersion).toBe(AVATAR_SCHEMA_VERSION);
  });

  it('entradas no-objeto producen configuración válida', () => {
    for (const input of [null, undefined, 42, 'texto', []]) {
      expect(parseConfiguration(input).schemaVersion).toBe(AVATAR_SCHEMA_VERSION);
    }
  });
});

describe('migración de esquema', () => {
  it('migra v1 (campos planos) a la versión actual', () => {
    const v1 = {
      schemaVersion: 1,
      gender: 'masculine',
      avatarUrl: VALID_URL,
      expressionId: 'smile',
      poseId: 'wave',
      backgroundId: 'sky',
    };
    const migrated = parseConfiguration(v1);

    expect(migrated.schemaVersion).toBe(AVATAR_SCHEMA_VERSION);
    expect(migrated.source.provider).toBe('readyplayerme');
    expect(migrated.source.url).toBe(VALID_URL);
    expect(migrated.source.id).toBe('64bfa15f0e72c63d7c3934a6');
    expect(migrated.presentation.expressionId).toBe('smile');
    expect(migrated.presentation.poseId).toBe('wave');
    expect(migrated.gender).toBe('masculine');
  });

  it('v1 sin url degrada al modelo humano local', () => {
    const migrated = parseConfiguration({ schemaVersion: 1, expressionId: 'smile' });
    expect(migrated.source.provider).toBe('custom');
    expect(migrated.presentation.expressionId).toBe('smile');
  });
});

describe('modelos custom', () => {
  it('el manifiesto contiene cuerpos locales válidos', () => {
    expect(validateCustomManifest()).toBe(true);
    expect(listCustomBodies().length).toBeGreaterThanOrEqual(3);
  });

  it('resuelve una ruta local segura por género', () => {
    expect(resolveCustomAvatarUrl(undefined, 'masculine')).toBe('/avatars/custom/bodies/male-base.glb');
    expect(resolveCustomAvatarUrl('missing', 'feminine')).toBe('/avatars/custom/bodies/female-base.glb');
  });

  it('acepta una configuración custom válida y repara ids desconocidos', () => {
    const parsed = parseConfiguration(createCustomConfiguration('masculine', 'male-base'));
    expect(parsed.source.provider).toBe('custom');
    if (parsed.source.provider === 'custom') expect(parsed.source.bodyId).toBe('male-base');

    const repaired = parseConfiguration({
      schemaVersion: AVATAR_SCHEMA_VERSION,
      gender: 'feminine',
      source: { provider: 'custom', bodyId: 'no-existe', url: '/avatars/custom/bodies/no.glb' },
    });
    expect(repaired.source.provider).toBe('custom');
    if (repaired.source.provider === 'custom') expect(repaired.source.bodyId).toBe('female-base');
  });

  it('declara huesos humanos esperados', () => {
    expect(CUSTOM_BONE_MAP.head).toBe('Head');
    expect(CUSTOM_BONE_MAP.leftUpperArm).toBe('LeftArm');
    expect(CUSTOM_BONE_MAP.rightUpperLeg).toBe('RightUpLeg');
  });
});

describe('recursos ausentes o retirados', () => {
  it('un id de catálogo inexistente cae al valor por defecto', () => {
    const config = parseConfiguration({
      schemaVersion: AVATAR_SCHEMA_VERSION,
      presentation: { expressionId: 'no-existe', poseId: 'tampoco', backgroundId: 'nada' },
    });
    expect(config.presentation.expressionId).toBe('neutral');
    expect(config.presentation.poseId).toBe('idle');
    expect(config.presentation.backgroundId).toBe('studio');
  });

  it('los getters del catálogo nunca devuelven null', () => {
    expect(getExpression('inventado').id).toBe('neutral');
    expect(getPose('inventado').id).toBe('idle');
    expect(getBackground('inventado').id).toBe('studio');
  });

  it('resolveOrDefault acepta undefined', () => {
    expect(resolveOrDefault('expression', undefined)).toBe('neutral');
  });
});

describe('validación de URL de avatar', () => {
  it('acepta un GLB https del host permitido', () => {
    expect(isSafeAvatarUrl(VALID_URL)).toBe(true);
  });

  it('acepta GLB locales del catálogo custom', () => {
    expect(isSafeAvatarUrl('/avatars/custom/bodies/neutral-base.glb')).toBe(true);
  });

  it('rechaza host no permitido, http, y extensión distinta', () => {
    expect(isSafeAvatarUrl('https://evil.example.com/a.glb')).toBe(false);
    expect(isSafeAvatarUrl('http://models.readyplayer.me/a.glb')).toBe(false);
    expect(isSafeAvatarUrl('https://models.readyplayer.me/a.exe')).toBe(false);
    expect(isSafeAvatarUrl('no-es-una-url')).toBe(false);
    expect(isSafeAvatarUrl('')).toBe(false);
  });

  it('extractRpmId solo reconoce ids de 24 hex', () => {
    expect(extractRpmId(VALID_URL)).toBe('64bfa15f0e72c63d7c3934a6');
    expect(extractRpmId('https://models.readyplayer.me/corto.glb')).toBeNull();
  });
});

describe('proveedor', () => {
  it('buildAvatarUrl aplica parámetros de calidad', () => {
    const low = buildAvatarUrl(VALID_URL, 'low');
    const high = buildAvatarUrl(VALID_URL, 'high');
    expect(low).toContain('meshLod=2');
    expect(low).toContain('morphTargets=none');
    expect(high).toContain('meshLod=0');
    expect(high).toContain('morphTargets=ARKit');
  });

  it('buildAvatarUrl devuelve null ante una URL no confiable', () => {
    expect(buildAvatarUrl('https://evil.example.com/a.glb', 'high')).toBeNull();
  });

  it('buildCreatorUrl incluye frameApi y bodyType', () => {
    const url = buildCreatorUrl();
    expect(url).toContain('frameApi');
    expect(url).toContain('bodyType=fullbody');
  });

  it('parseFrameEvent descarta orígenes ajenos y formas inválidas', () => {
    const good = { origin: RPM_CREATOR_ORIGIN, data: { source: 'readyplayerme', eventName: 'v1.frame.ready' } } as MessageEvent;
    expect(parseFrameEvent(good)?.eventName).toBe('v1.frame.ready');

    const wrongOrigin = { origin: 'https://evil.example.com', data: { source: 'readyplayerme', eventName: 'x' } } as MessageEvent;
    expect(parseFrameEvent(wrongOrigin)).toBeNull();

    const wrongShape = { origin: RPM_CREATOR_ORIGIN, data: { hello: 'world' } } as unknown as MessageEvent;
    expect(parseFrameEvent(wrongShape)).toBeNull();
  });
});

describe('store: deshacer, rehacer y persistencia', () => {
  beforeEach(() => {
    useAvatarStore.setState({
      config: createDefaultConfiguration(),
      past: [],
      future: [],
      status: 'idle',
      error: null,
    });
  });

  it('deshacer y rehacer recorren el historial', () => {
    const store = useAvatarStore.getState();
    store.setExpression('smile');
    store.setPose('wave');

    expect(useAvatarStore.getState().config.presentation.poseId).toBe('wave');

    useAvatarStore.getState().undo();
    expect(useAvatarStore.getState().config.presentation.poseId).toBe('idle');
    expect(useAvatarStore.getState().config.presentation.expressionId).toBe('smile');

    useAvatarStore.getState().redo();
    expect(useAvatarStore.getState().config.presentation.poseId).toBe('wave');
  });

  it('deshacer sin historial no rompe', () => {
    expect(() => useAvatarStore.getState().undo()).not.toThrow();
    expect(useAvatarStore.getState().config.presentation.expressionId).toBe('neutral');
  });

  it('un cambio nuevo invalida la rama de rehacer', () => {
    const store = useAvatarStore.getState();
    store.setExpression('smile');
    useAvatarStore.getState().undo();
    expect(useAvatarStore.getState().future.length).toBe(1);

    useAvatarStore.getState().setBackground('sky');
    expect(useAvatarStore.getState().future.length).toBe(0);
  });

  it('rechaza una URL de avatar no confiable', () => {
    useAvatarStore.getState().setRemoteAvatar('https://evil.example.com/a.glb');
    expect(useAvatarStore.getState().config.source.provider).toBe('custom');
    expect(useAvatarStore.getState().error).toBeTruthy();
  });

  it('acepta una URL válida y pasa a loading', () => {
    useAvatarStore.getState().setRemoteAvatar(VALID_URL);
    const state = useAvatarStore.getState();
    expect(state.config.source.provider).toBe('readyplayerme');
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('cambia entre cuerpo masculino y femenino', () => {
    useAvatarStore.getState().setGender('feminine');
    expect(useAvatarStore.getState().config.gender).toBe('feminine');
    expect(useAvatarStore.getState().config.source.id).toBe('female-base');
    useAvatarStore.getState().setGender('masculine');
    expect(useAvatarStore.getState().config.gender).toBe('masculine');
    expect(useAvatarStore.getState().config.source.id).toBe('male-base');
  });

  it('cambia de modelo custom con deshacer y rehacer', () => {
    useAvatarStore.getState().setCustomBody('male-base');
    expect(useAvatarStore.getState().config.source.id).toBe('male-base');
    useAvatarStore.getState().undo();
    expect(useAvatarStore.getState().config.source.id).toBe('neutral-base');
    useAvatarStore.getState().redo();
    expect(useAvatarStore.getState().config.source.id).toBe('male-base');
  });

  it('aleatorizar produce ids que existen en el catálogo', () => {
    for (let i = 0; i < 25; i++) {
      useAvatarStore.getState().randomize();
      const { presentation } = useAvatarStore.getState().config;
      expect(listEntries('expression').some((e) => e.id === presentation.expressionId)).toBe(true);
      expect(listEntries('pose').some((e) => e.id === presentation.poseId)).toBe(true);
      expect(listEntries('background').some((e) => e.id === presentation.backgroundId)).toBe(true);
    }
  });

  it('guardar y cargar hace ida y vuelta por localStorage', () => {
    const memory = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => void memory.set(k, v),
      removeItem: (k: string) => void memory.delete(k),
    });

    useAvatarStore.getState().setExpression('surprise');
    useAvatarStore.getState().save();

    useAvatarStore.setState({ config: createDefaultConfiguration(), past: [], future: [] });
    expect(useAvatarStore.getState().config.presentation.expressionId).toBe('neutral');

    useAvatarStore.getState().load();
    expect(useAvatarStore.getState().config.presentation.expressionId).toBe('surprise');

    vi.unstubAllGlobals();
  });
});

describe('integridad del catálogo', () => {
  it('no hay identificadores duplicados por categoría', () => {
    for (const category of ['expression', 'pose', 'background'] as const) {
      const ids = listEntries(category).map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('los valores por defecto existen y están disponibles', () => {
    expect(listEntries('expression').some((e) => e.id === 'neutral')).toBe(true);
    expect(listEntries('pose').some((e) => e.id === 'idle')).toBe(true);
    expect(listEntries('background').some((e) => e.id === 'studio')).toBe(true);
  });

  it('las expresiones incluyen morph targets custom', () => {
    expect(getExpression('smile').morphTargets.smile).toBe(1);
    expect(getExpression('surprise').morphTargets.mouthOpen).toBeGreaterThan(0);
  });

  it('los fondos declaran ambas paradas del degradado', () => {
    for (const entry of listEntries('background')) {
      const bg = entry as { from?: string; to?: string };
      expect(bg.from).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(bg.to).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

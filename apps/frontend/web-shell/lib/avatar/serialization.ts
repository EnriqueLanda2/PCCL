/* ───────────────────────────────────────────
   Serialización, validación y migración
   ───────────────────────────────────────────
   Una configuración guardada puede venir de una versión anterior del esquema,
   de otra pestaña, o estar corrupta. Nada de eso debe romper el editor: todo
   entra por `parseConfiguration`, que siempre devuelve algo utilizable.
   ─────────────────────────────────────────── */

import {
  AVATAR_SCHEMA_VERSION,
  type AvatarColors,
  type AvatarConfiguration,
  type AvatarGender,
  type AvatarQuality,
  type AvatarWardrobe,
} from './types';
import { CATALOG_DEFAULTS, resolveOrDefault } from './catalog';
import {
  bodyIdForGender,
  defaultPieceId,
  resolveColor,
  resolveCustomAvatarUrl,
  resolveCustomBody,
  resolveCustomPiece,
  validateCustomPath,
} from './custom';

const GENDERS: AvatarGender[] = ['masculine', 'feminine', 'androgynous'];
const QUALITIES: AvatarQuality[] = ['low', 'medium', 'high'];

/** Conjunto por defecto de un cuerpo: siempre las piezas empaquetadas en su
 *  propio GLB, para que el avatar se vea completo sin descargar nada más. */
export function defaultWardrobe(bodyId: string): AvatarWardrobe {
  return {
    hairId: defaultPieceId('hair', bodyId),
    topId: defaultPieceId('tops', bodyId),
    bottomId: defaultPieceId('bottoms', bodyId),
    shoesId: defaultPieceId('shoes', bodyId),
    accessoryId: 'none',
  };
}

export function defaultColors(): AvatarColors {
  return { skin: 'sand', hair: 'chestnut', eyes: 'forest', top: 'lagoon', bottom: 'slate', shoes: 'slate' };
}

export function createDefaultConfiguration(gender: AvatarGender = 'androgynous'): AvatarConfiguration {
  const bodyId = bodyIdForGender(gender);
  const body = resolveCustomBody(bodyId, gender);
  return {
    schemaVersion: AVATAR_SCHEMA_VERSION,
    gender,
    source: {
      provider: 'custom',
      id: body.id,
      bodyId: body.id,
      revision: body.revision,
      url: body.url,
    },
    presentation: {
      expressionId: CATALOG_DEFAULTS.expression,
      poseId: CATALOG_DEFAULTS.pose,
      backgroundId: CATALOG_DEFAULTS.background,
    },
    wardrobe: defaultWardrobe(body.id),
    colors: defaultColors(),
    quality: 'medium',
    updatedAt: new Date().toISOString(),
  };
}

/* ── Migraciones ──
   Cada entrada lleva de la versión N a la N+1. Se aplican en cadena, así que
   una configuración v1 llega a la actual pasando por todas. Añadir una versión
   = subir AVATAR_SCHEMA_VERSION y añadir aquí su función. */
type Migration = (input: Record<string, unknown>) => Record<string, unknown>;

const migrations: Record<number, Migration> = {
  /* v1 → v2: el v1 guardaba `avatarUrl` suelto y `expressionId`/`poseId` en la
     raíz. Se agrupan en `source` y `presentation`. */
  1: (input) => {
    const url = typeof input.avatarUrl === 'string' ? input.avatarUrl : '';
    return {
      ...input,
      schemaVersion: 2,
      source: url
        ? { provider: 'readyplayerme', id: extractRpmId(url) ?? url, url }
        : { provider: 'primitive', id: 'primitive-androgynous', url: '' },
      presentation: {
        expressionId: input.expressionId ?? CATALOG_DEFAULTS.expression,
        poseId: input.poseId ?? CATALOG_DEFAULTS.pose,
        backgroundId: input.backgroundId ?? CATALOG_DEFAULTS.background,
      },
    };
  },
  2: (input) => ({
    ...input,
    schemaVersion: 3,
  }),
  /* v3 → v4: aparecen el vestuario y los tintes del catálogo propio. No se
     rellenan aquí con valores concretos porque dependen del cuerpo que acabe
     resolviéndose; `parseConfiguration` los completa contra el catálogo real. */
  3: (input) => ({
    ...input,
    schemaVersion: 4,
  }),
};

/** Extrae el id de un GLB de Ready Player Me. Devuelve null si no encaja, para
 *  no fabricar identificadores a partir de una URL arbitraria. */
export function extractRpmId(url: string): string | null {
  const match = /\/([0-9a-f]{24})\.glb/i.exec(url);
  return match ? match[1] : null;
}

function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  let current = raw;
  let version = typeof current.schemaVersion === 'number' ? current.schemaVersion : 1;

  /* Guarda contra un bucle infinito si una migración olvida subir la versión. */
  let guard = 0;
  while (version < AVATAR_SCHEMA_VERSION && guard < 32) {
    const step = migrations[version];
    if (!step) break;
    current = step(current);
    const next = typeof current.schemaVersion === 'number' ? current.schemaVersion : version + 1;
    if (next <= version) break;
    version = next;
    guard++;
  }
  return current;
}

function pickEnum<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  return typeof value === 'string' && (allowed as string[]).includes(value) ? (value as T) : fallback;
}

/**
 * Punto de entrada único para cualquier configuración que venga de fuera
 * (localStorage, API, importación). Migra, valida y repara. Nunca lanza.
 */
export function parseConfiguration(input: unknown): AvatarConfiguration {
  if (typeof input !== 'object' || input === null) return createDefaultConfiguration();

  const migrated = migrate({ ...(input as Record<string, unknown>) });
  const gender = pickEnum(migrated.gender, GENDERS, 'androgynous' as AvatarGender);
  /* La base se construye con el género YA resuelto: derivarla del género por
     defecto hacía que una configuración femenina sin malla volviese como
     `primitive-androgynous` y el round-trip dejara de ser estable. */
  const base = createDefaultConfiguration(gender);

  const rawSource = migrated.source as Record<string, unknown> | undefined;
  const rawPresentation = migrated.presentation as Record<string, unknown> | undefined;

  const provider = rawSource?.provider === 'readyplayerme'
    ? 'readyplayerme'
    : rawSource?.provider === 'custom'
      ? 'custom'
      : 'primitive';
  const url = typeof rawSource?.url === 'string' ? rawSource.url : '';

  /* Un provider remoto sin URL utilizable es inconsistente: se degrada a
     primitive en vez de intentar cargar "" y disparar un error de red. */
  const usableRemote = provider === 'readyplayerme' && isSafeAvatarUrl(url);
  const customBody = provider === 'custom'
    ? resolveCustomBody(typeof rawSource?.bodyId === 'string' ? rawSource.bodyId : undefined, gender)
    : null;
  const usableCustom = Boolean(customBody && validateCustomPath(customBody.url));

  /* El vestuario se resuelve SIEMPRE contra el cuerpo que finalmente se usa: si
     una pieza guardada ya no existe en el catálogo, o nunca fue compatible con
     este cuerpo, se sustituye por la pieza por defecto en vez de dejar una
     referencia rota. */
  const wardrobeBodyId = (usableCustom && customBody ? customBody : resolveCustomBody(undefined, gender)).id;
  const rawWardrobe = migrated.wardrobe as Record<string, unknown> | undefined;
  const rawColors = migrated.colors as Record<string, unknown> | undefined;

  const piece = (category: Parameters<typeof resolveCustomPiece>[0], value: unknown, fallbackNone = false) => {
    const requested = typeof value === 'string' ? value : undefined;
    if (fallbackNone && requested === 'none') return 'none';
    const resolved = resolveCustomPiece(category, wardrobeBodyId, requested);
    return resolved?.pieceId ?? (fallbackNone ? 'none' : defaultPieceId(category, wardrobeBodyId));
  };

  return {
    schemaVersion: AVATAR_SCHEMA_VERSION,
    gender,
    source: usableCustom && customBody
      ? {
          provider: 'custom',
          id: customBody.id,
          bodyId: customBody.id,
          revision: customBody.revision,
          url: customBody.url,
        }
      : usableRemote
      ? {
          provider: 'readyplayerme',
          id: typeof rawSource?.id === 'string' && rawSource.id ? rawSource.id : (extractRpmId(url) ?? url),
          url,
        }
      : base.source,
    presentation: {
      expressionId: resolveOrDefault('expression', rawPresentation?.expressionId as string | undefined),
      poseId: resolveOrDefault('pose', rawPresentation?.poseId as string | undefined),
      backgroundId: resolveOrDefault('background', rawPresentation?.backgroundId as string | undefined),
    },
    wardrobe: {
      hairId: piece('hair', rawWardrobe?.hairId),
      topId: piece('tops', rawWardrobe?.topId),
      bottomId: piece('bottoms', rawWardrobe?.bottomId),
      shoesId: piece('shoes', rawWardrobe?.shoesId),
      accessoryId: piece('accessories', rawWardrobe?.accessoryId ?? 'none', true),
    },
    colors: {
      skin: resolveColor('skin', rawColors?.skin as string | undefined).id,
      hair: resolveColor('hair', rawColors?.hair as string | undefined).id,
      eyes: resolveColor('eyes', rawColors?.eyes as string | undefined).id,
      top: resolveColor('top', rawColors?.top as string | undefined).id,
      bottom: resolveColor('bottom', rawColors?.bottom as string | undefined).id,
      shoes: resolveColor('shoes', rawColors?.shoes as string | undefined).id,
    },
    quality: pickEnum(migrated.quality, QUALITIES, base.quality),
    updatedAt: typeof migrated.updatedAt === 'string' ? migrated.updatedAt : base.updatedAt,
  };
}

/**
 * Solo se aceptan GLB por HTTPS de hosts conocidos. Una URL de avatar acaba en
 * un fetch y en el grafo de la escena, así que dejarla libre permitiría apuntar
 * la app a cualquier binario de terceros.
 */
const ALLOWED_AVATAR_HOSTS = ['models.readyplayer.me'];

export function isSafeAvatarUrl(url: string): boolean {
  if (validateCustomPath(url)) return true;
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (!ALLOWED_AVATAR_HOSTS.includes(parsed.hostname)) return false;
    return parsed.pathname.toLowerCase().endsWith('.glb');
  } catch {
    return false;
  }
}

export function createCustomConfiguration(gender: AvatarGender = 'androgynous', bodyId?: string): AvatarConfiguration {
  const body = resolveCustomBody(bodyId, gender);
  return parseConfiguration({
    schemaVersion: AVATAR_SCHEMA_VERSION,
    gender,
    source: {
      provider: 'custom',
      id: body.id,
      bodyId: body.id,
      revision: body.revision,
      url: resolveCustomAvatarUrl(body.id, gender) ?? body.url,
    },
  });
}

export function serializeConfiguration(config: AvatarConfiguration): string {
  return JSON.stringify(config);
}

export function deserializeConfiguration(json: string): AvatarConfiguration {
  try {
    return parseConfiguration(JSON.parse(json));
  } catch {
    return createDefaultConfiguration();
  }
}

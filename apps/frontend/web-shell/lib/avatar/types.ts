/* ───────────────────────────────────────────
   Modelo de datos del avatar 3D
   ───────────────────────────────────────────
   Se guarda SOLO configuración, nunca un GLB por usuario: un GLB pesa MBs y
   quedaría congelado si el catálogo cambia. La configuración pesa bytes y se
   vuelve a resolver contra el catálogo en cada carga.

   El modelo es agnóstico del proveedor a propósito. Hoy la geometría viene de
   Ready Player Me, pero `provider` permite añadir otro origen (o modelos
   propios) sin tocar el store, el editor ni la escena.
   ─────────────────────────────────────────── */

/** Súbelo SIEMPRE que cambies la forma de AvatarConfiguration, y añade su
 *  migración en `migrations` (lib/avatar/serialization.ts). */
export const AVATAR_SCHEMA_VERSION = 4;

export type AvatarProvider = 'readyplayerme' | 'primitive' | 'custom';

/** Cuánta calidad pedirle al proveedor. Se mapea a parámetros de URL en RPM. */
export type AvatarQuality = 'low' | 'medium' | 'high';

export type AvatarGender = 'masculine' | 'feminine' | 'androgynous';

export interface PrimitiveAvatarSource {
  provider: 'primitive';
  /** Identificador estable del avatar dentro del proveedor. */
  id: string;
  url: string;
}

export interface ReadyPlayerMeAvatarSource {
  provider: 'readyplayerme';
  id: string;
  /** URL del GLB. En RPM la devuelve el creador; se normaliza antes de guardar. */
  url: string;
}

export interface CustomAvatarSource {
  provider: 'custom';
  id: string;
  url: string;
  bodyId: string;
  revision: number;
}

export type AvatarSource = PrimitiveAvatarSource | ReadyPlayerMeAvatarSource | CustomAvatarSource;

export interface AvatarPresentation {
  expressionId: string;
  poseId: string;
  backgroundId: string;
}

/**
 * Piezas elegidas del catálogo propio. Se guardan identificadores estables de
 * pieza (`top-a`), nunca rutas ni nombres de malla: el catálogo puede mover
 * archivos entre revisiones sin invalidar lo que el usuario tenga guardado.
 *
 * Solo tiene efecto con `source.provider === 'custom'`; Ready Player Me trae su
 * propia ropa dentro del GLB.
 */
export interface AvatarWardrobe {
  hairId: string;
  topId: string;
  bottomId: string;
  shoesId: string;
  /** `none` es un valor válido: no llevar accesorio. */
  accessoryId: string;
}

/** Tintes de material por canal. Se guardan ids de paleta, no hex, para poder
 *  recolorear la paleta sin migrar configuraciones. */
export interface AvatarColors {
  skin: string;
  hair: string;
  eyes: string;
  top: string;
  bottom: string;
  shoes: string;
}

export interface AvatarConfiguration {
  schemaVersion: number;
  /** Identidad visual declarada. No condiciona la malla, solo el encuadre y las
   *  poses por defecto que ofrece el editor. */
  gender: AvatarGender;
  source: AvatarSource;
  presentation: AvatarPresentation;
  wardrobe: AvatarWardrobe;
  colors: AvatarColors;
  quality: AvatarQuality;
  /** ISO-8601. Útil para invalidar cachés y ordenar avatares guardados. */
  updatedAt: string;
}

/* ── Catálogo ── */

export type AvatarCategory = 'expression' | 'pose' | 'background' | 'preset';

export interface CatalogEntry {
  id: string;
  category: AvatarCategory;
  label: string;
  /** Miniatura opcional. Si falta, la UI cae a una representación por color. */
  thumbnail?: string;
  /** Marca la entrada como no seleccionable sin borrarla, para no romper
   *  configuraciones guardadas que aún la referencian. */
  available: boolean;
  /** Versión de la entrada; permite invalidar cachés por componente. */
  version: number;
}

export interface ExpressionEntry extends CatalogEntry {
  category: 'expression';
  /** Pesos de morph targets por nombre ARKit, tal y como los expone RPM. */
  morphTargets: Record<string, number>;
}

export interface PoseEntry extends CatalogEntry {
  category: 'pose';
  /** Rotaciones en radianes por hueso, sobre la pose de descanso. */
  boneRotations: Record<string, [number, number, number]>;
}

export interface BackgroundEntry extends CatalogEntry {
  category: 'background';
  /** Degradado de dos paradas para el fondo de la escena y del retrato. */
  from: string;
  to: string;
}

export interface PresetEntry extends CatalogEntry {
  category: 'preset';
  gender: AvatarGender;
  url: string;
}

export type AnyCatalogEntry =
  | ExpressionEntry
  | PoseEntry
  | BackgroundEntry
  | PresetEntry;

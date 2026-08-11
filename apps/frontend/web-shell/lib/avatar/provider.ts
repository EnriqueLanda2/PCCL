/* ───────────────────────────────────────────
   Proveedor de mallas — Ready Player Me
   ───────────────────────────────────────────
   Aísla TODO lo específico del proveedor. El resto de la app solo conoce
   `AvatarSource`, así que cambiar de proveedor (o añadir modelos propios) se
   limita a este archivo más una rama en AvatarModel.
   ─────────────────────────────────────────── */

import type { AvatarConfiguration, AvatarProvider, AvatarQuality } from './types';
import { CUSTOM_BONE_MAP, resolveCustomAvatarUrl } from './custom';
import { isSafeAvatarUrl } from './serialization';

/* ── Adaptación de nombres entre proveedores ──
   El catálogo describe expresiones en la convención ARKit, que es la que
   exportan las mallas de Ready Player Me. Las mallas propias usan nombres
   canónicos de PCCL. La traducción vive aquí, en el adaptador del proveedor,
   para que el catálogo no dependa de la convención de ningún proveedor
   concreto (README §7.4). */

/** ARKit → nombres canónicos propios. Varios ARKit colapsan en un morph propio:
 *  la malla estilizada no tiene un blendshape por músculo facial. */
const ARKIT_TO_CUSTOM_MORPH: Record<string, string> = {
  eyeBlinkLeft: 'blinkLeft',
  eyeBlinkRight: 'blinkRight',
  mouthSmileLeft: 'smile',
  mouthSmileRight: 'smile',
  jawOpen: 'mouthOpen',
  browInnerUp: 'browUp',
  browOuterUpLeft: 'browUp',
  browOuterUpRight: 'browUp',
  eyeWideLeft: 'surprised',
  eyeWideRight: 'surprised',
  mouthFrownLeft: 'sad',
  mouthFrownRight: 'sad',
};

/**
 * Traduce los pesos de una expresión a los nombres que entiende el proveedor.
 *
 * Para `custom` se añaden los equivalentes canónicos sin borrar las claves
 * originales: un morph que la malla no tenga simplemente no aparece en su
 * diccionario y se ignora, así que conservar ambas convenciones es inocuo y
 * mantiene la expresión funcionando si un modelo trae las dos.
 *
 * Cuando un morph propio recibe varias aportaciones ARKit (por ejemplo
 * `mouthSmileLeft` y `mouthSmileRight` → `smile`) se queda con la mayor, que es
 * lo que preserva la intención de la expresión.
 */
export function adaptMorphTargets(
  provider: AvatarProvider,
  morphTargets: Record<string, number>,
): Record<string, number> {
  if (provider !== 'custom') return morphTargets;

  const adapted: Record<string, number> = { ...morphTargets };
  for (const [arkit, weight] of Object.entries(morphTargets)) {
    const canonical = ARKIT_TO_CUSTOM_MORPH[arkit];
    if (!canonical) continue;
    adapted[canonical] = Math.max(adapted[canonical] ?? 0, weight);
  }
  return adapted;
}

/**
 * Resuelve el nombre real de un hueso. Acepta tanto un nombre semántico
 * (`leftUpperArm`) como uno concreto ya válido, de modo que el catálogo puede
 * migrar a nombres semánticos sin romper las poses existentes.
 */
export function resolveBoneName(provider: AvatarProvider, name: string): string {
  if (provider !== 'custom') return name;
  return CUSTOM_BONE_MAP[name as keyof typeof CUSTOM_BONE_MAP] ?? name;
}

/** Subdominio del creador. Configurable por entorno: cada organización tiene el
 *  suyo y no debe quedar cableado en el código. `demo` es el público de RPM. */
export const RPM_SUBDOMAIN = process.env.NEXT_PUBLIC_RPM_SUBDOMAIN ?? '';

export const RPM_CREATOR_ORIGIN = `https://${RPM_SUBDOMAIN || 'demo'}.readyplayer.me`;

/**
 * Si Ready Player Me está utilizable en este despliegue.
 *
 * El subdominio `demo` que se usaba por defecto **ya no existe** (devuelve
 * NXDOMAIN): Ready Player Me lo retiró, y el creador abría un iframe a un
 * dominio inexistente con el consiguiente error de red a la vista del usuario.
 *
 * Cada organización tiene su propio subdominio y no puede adivinarse, así que
 * la integración solo se ofrece cuando hay uno configurado de verdad. Sin él,
 * la UI no muestra la opción en lugar de mostrarla rota.
 */
export const isReadyPlayerMeEnabled = RPM_SUBDOMAIN.length > 0;

/**
 * Parámetros de optimización soportados por el endpoint de avatares de Ready
 * Player Me. Bajar LOD y atlas reduce mucho el peso transferido, que es el
 * presupuesto crítico en móvil.
 *
 * NOTA: estos parámetros siguen la API documentada de RPM, pero NO pude
 * comprobarlos contra el servicio: su dominio no resuelve desde el entorno en
 * el que se escribió esto. Verifícalos en la primera ejecución real.
 */
const QUALITY_PARAMS: Record<AvatarQuality, Record<string, string>> = {
  low:    { meshLod: '2', textureAtlas: '512',  textureSizeLimit: '512',  morphTargets: 'none' },
  medium: { meshLod: '1', textureAtlas: '1024', textureSizeLimit: '1024', morphTargets: 'ARKit' },
  high:   { meshLod: '0', textureAtlas: 'none', textureSizeLimit: '2048', morphTargets: 'ARKit' },
};

/**
 * Construye la URL final del GLB aplicando la calidad pedida.
 * Devuelve null si la URL base no es de confianza, para que quien llame tenga
 * que tratar el caso en vez de recibir una cadena inservible.
 */
export function buildAvatarUrl(baseUrl: string, quality: AvatarQuality): string | null {
  if (!isSafeAvatarUrl(baseUrl)) return null;

  const url = new URL(baseUrl);
  for (const [key, value] of Object.entries(QUALITY_PARAMS[quality])) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export function resolveAvatarModelUrl(config: AvatarConfiguration): string | null {
  if (config.source.provider === 'custom') {
    return resolveCustomAvatarUrl(config.source.bodyId, config.gender);
  }
  if (config.source.provider === 'readyplayerme') {
    return buildAvatarUrl(config.source.url, config.quality);
  }
  return null;
}

/** URL del creador embebido. `clearCache` evita que reabra la sesión anterior. */
export function buildCreatorUrl(options?: { clearCache?: boolean; bodyType?: 'fullbody' | 'halfbody' }): string {
  const url = new URL(RPM_CREATOR_ORIGIN);
  url.pathname = '/avatar';
  url.searchParams.set('frameApi', '');
  url.searchParams.set('bodyType', options?.bodyType ?? 'fullbody');
  if (options?.clearCache) url.searchParams.set('clearCache', '');
  return url.toString();
}

/* ── Protocolo postMessage del creador ──
   El iframe emite eventos JSON con `source: 'readyplayerme'`. Se valida el
   origen y la forma del mensaje antes de hacerle caso: es una entrada externa
   y no debe confiarse a ciegas. */

export interface RpmFrameEvent {
  source: 'readyplayerme';
  eventName: string;
  data?: { url?: string; id?: string };
}

export function parseFrameEvent(event: MessageEvent): RpmFrameEvent | null {
  if (event.origin !== RPM_CREATOR_ORIGIN) return null;

  let payload: unknown = event.data;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch { return null; }
  }
  if (typeof payload !== 'object' || payload === null) return null;

  const candidate = payload as Partial<RpmFrameEvent>;
  if (candidate.source !== 'readyplayerme' || typeof candidate.eventName !== 'string') return null;

  return candidate as RpmFrameEvent;
}

/** Mensaje de suscripción que espera el creador para empezar a emitir eventos. */
export const RPM_SUBSCRIBE_MESSAGE = JSON.stringify({
  target: 'readyplayerme',
  type: 'subscribe',
  eventName: 'v1.**',
});

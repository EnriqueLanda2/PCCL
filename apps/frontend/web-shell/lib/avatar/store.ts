/* ───────────────────────────────────────────
   Store del editor de avatares (zustand)
   ───────────────────────────────────────────
   El historial se guarda como pilas de configuraciones completas, no de
   "acciones inversas": una configuración pesa bytes y hace que deshacer sea
   trivialmente correcto, sin tener que escribir el inverso de cada operación.
   ─────────────────────────────────────────── */

import { create } from 'zustand';
import type { AvatarColors, AvatarConfiguration, AvatarGender, AvatarQuality } from './types';
import {
  createDefaultConfiguration,
  createCustomConfiguration,
  defaultWardrobe,
  deserializeConfiguration,
  isSafeAvatarUrl,
  parseConfiguration,
  serializeConfiguration,
  extractRpmId,
} from './serialization';
import { listEntries } from './catalog';
import {
  bodyIdForGender,
  listColorOptions,
  listCustomPieces,
  resolveCustomBody,
  type CustomCategory,
  type TintChannel,
} from './custom';

/** Categoría del catálogo → campo del vestuario en la configuración. */
const WARDROBE_FIELD: Record<CustomCategory, keyof AvatarConfiguration['wardrobe']> = {
  hair: 'hairId',
  tops: 'topId',
  bottoms: 'bottomId',
  shoes: 'shoesId',
  accessories: 'accessoryId',
};

export const AVATAR_STORAGE_KEY = 'pccl_avatar_config';

/** Tope del historial: sin él, una sesión larga acumula memoria sin límite. */
const HISTORY_LIMIT = 50;

interface AvatarState {
  config: AvatarConfiguration;
  past: AvatarConfiguration[];
  future: AvatarConfiguration[];
  /** Estado de carga de la malla, para que la UI muestre progreso real. */
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;

  setExpression: (id: string) => void;
  setPose: (id: string) => void;
  setBackground: (id: string) => void;
  setGender: (gender: AvatarGender) => void;
  setQuality: (quality: AvatarQuality) => void;
  setRemoteAvatar: (url: string) => void;
  setCustomBody: (bodyId: string) => void;
  setWardrobePiece: (category: CustomCategory, pieceId: string) => void;
  setColor: (channel: TintChannel, colorId: string) => void;
  randomize: () => void;

  undo: () => void;
  redo: () => void;
  reset: () => void;

  setStatus: (status: AvatarState['status'], error?: string | null) => void;

  load: () => void;
  save: () => void;
  replace: (config: AvatarConfiguration) => void;
}

/** Aplica un cambio empujando el estado anterior al historial. */
function commit(
  state: AvatarState,
  next: Partial<AvatarConfiguration>,
): Pick<AvatarState, 'config' | 'past' | 'future'> {
  const previous = state.config;
  const config: AvatarConfiguration = {
    ...previous,
    ...next,
    updatedAt: new Date().toISOString(),
  };
  return {
    config,
    past: [...state.past, previous].slice(-HISTORY_LIMIT),
    /* Cualquier cambio nuevo invalida la rama de rehacer, igual que en un editor
       de texto: si no, rehacer saltaría a un estado incompatible. */
    future: [],
  };
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  config: createDefaultConfiguration(),
  past: [],
  future: [],
  status: 'idle',
  error: null,

  setExpression: (id) =>
    set((state) => commit(state, { presentation: { ...state.config.presentation, expressionId: id } })),

  setPose: (id) =>
    set((state) => commit(state, { presentation: { ...state.config.presentation, poseId: id } })),

  setBackground: (id) =>
    set((state) => commit(state, { presentation: { ...state.config.presentation, backgroundId: id } })),

  setGender: (gender) => set((state) => {
    if (state.config.source.provider !== 'custom') return commit(state, { gender });
    const body = resolveCustomBody(bodyIdForGender(gender), gender);
    return commit(state, {
      gender,
      source: { provider: 'custom', id: body.id, bodyId: body.id, revision: body.revision, url: body.url },
      /* Las piezas son por cuerpo: al cambiar de cuerpo hay que reresolverlas o
         quedarían apuntando a mallas que ese GLB no contiene. */
      wardrobe: defaultWardrobe(body.id),
    });
  }),

  setQuality: (quality) => set((state) => commit(state, { quality })),

  setRemoteAvatar: (url) =>
    set((state) => {
      /* Se valida aquí y no solo en la UI: este setter también lo invoca el
         postMessage del creador, que es una entrada externa. */
      if (!isSafeAvatarUrl(url)) {
        return { error: 'La URL del avatar no es válida o no procede de un origen permitido.' };
      }
      return {
        ...commit(state, {
          source: { provider: 'readyplayerme', id: extractRpmId(url) ?? url, url },
        }),
        status: 'loading',
        error: null,
      };
    }),

  setCustomBody: (bodyId) =>
    set((state) => {
      const body = resolveCustomBody(bodyId, state.config.gender);
      return {
        ...commit(state, {
          source: { provider: 'custom', id: body.id, bodyId: body.id, revision: body.revision, url: body.url },
          wardrobe: defaultWardrobe(body.id),
        }),
        status: 'loading',
        error: null,
      };
    }),

  setWardrobePiece: (category, pieceId) =>
    set((state) =>
      commit(state, {
        wardrobe: { ...state.config.wardrobe, [WARDROBE_FIELD[category]]: pieceId },
      }),
    ),

  setColor: (channel, colorId) =>
    set((state) => commit(state, { colors: { ...state.config.colors, [channel]: colorId } })),

  randomize: () =>
    set((state) => {
      const bodyId = state.config.source.provider === 'custom' ? state.config.source.bodyId : '';
      /* Solo se aleatoriza lo que el cuerpo actual admite; elegir una pieza de
         otro cuerpo dejaría el avatar sin esa prenda. */
      const randomPiece = (category: CustomCategory, current: string) => {
        const options = listCustomPieces(category, bodyId);
        return options.length > 0 ? pickRandom(options).pieceId : current;
      };
      const randomColor = (channel: TintChannel) => pickRandom(listColorOptions(channel)).id;

      const wardrobe = bodyId
        ? {
            ...state.config.wardrobe,
            hairId: randomPiece('hair', state.config.wardrobe.hairId),
            topId: randomPiece('tops', state.config.wardrobe.topId),
            bottomId: randomPiece('bottoms', state.config.wardrobe.bottomId),
            shoesId: randomPiece('shoes', state.config.wardrobe.shoesId),
          }
        : state.config.wardrobe;

      return commit(state, {
        presentation: {
          expressionId: pickRandom(listEntries('expression')).id,
          poseId: pickRandom(listEntries('pose')).id,
          backgroundId: pickRandom(listEntries('background')).id,
        },
        wardrobe,
        colors: {
          skin: randomColor('skin'),
          hair: randomColor('hair'),
          eyes: randomColor('eyes'),
          top: randomColor('top'),
          bottom: randomColor('bottom'),
          shoes: randomColor('shoes'),
        } satisfies AvatarColors,
      });
    }),

  undo: () =>
    set((state) => {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return {
        config: previous,
        past: state.past.slice(0, -1),
        future: [state.config, ...state.future].slice(0, HISTORY_LIMIT),
      };
    }),

  redo: () =>
    set((state) => {
      const [next, ...rest] = state.future;
      if (!next) return state;
      return {
        config: next,
        past: [...state.past, state.config].slice(-HISTORY_LIMIT),
        future: rest,
      };
    }),

  reset: () =>
    set((state) => ({
      ...commit(state, createCustomConfiguration(state.config.gender)),
      status: 'idle',
      error: null,
    })),

  setStatus: (status, error = null) => set({ status, error }),

  replace: (config) => set((state) => ({ ...commit(state, parseConfiguration(config)), future: [] })),

  load: () => {
    /* Se comprueba localStorage y no window: es lo que realmente se usa, y así
       la persistencia es verificable en tests sin simular un DOM completo. */
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) return;
    /* deserializeConfiguration ya migra y repara, así que un valor viejo o
       corrupto en localStorage no puede dejar el editor inutilizable. */
    set({ config: deserializeConfiguration(raw), past: [], future: [] });
  },

  save: () => {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(AVATAR_STORAGE_KEY, serializeConfiguration(get().config));
    } catch {
      /* Cuota llena o almacenamiento bloqueado: guardar es una comodidad, no
         debe tumbar el editor. */
      set({ error: 'No se pudo guardar la configuración en este navegador.' });
    }
  },
}));

export const selectCanUndo = (state: AvatarState) => state.past.length > 0;
export const selectCanRedo = (state: AvatarState) => state.future.length > 0;

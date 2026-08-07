'use client';

import { Component, type ReactNode } from 'react';

/**
 * Aísla los fallos de la escena 3D. Un GLB corrupto, una extensión glTF no
 * soportada o una pérdida de contexto WebGL lanzan durante el render de React
 * y, sin este límite, tumbarían la página entera del editor.
 */
export class AvatarErrorBoundary extends Component<
  { children: ReactNode; fallback: (reset: () => void, error: Error) => ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) return this.props.fallback(this.reset, this.state.error);
    return this.props.children;
  }
}

/** Detección de WebGL para poder ofrecer una alternativa en vez de un lienzo
 *  negro. Se crea un canvas desechable, no toca el DOM visible.
 *
 *  El resultado se cachea porque `useSyncExternalStore` exige que getSnapshot
 *  devuelva un valor estable: crear un canvas en cada render provocaría un
 *  bucle infinito de re-renders. */
let webglCache: boolean | null = null;

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement('canvas');
    webglCache = Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    );
  } catch {
    webglCache = false;
  }
  return webglCache;
}

/* Snapshots para useSyncExternalStore: es la vía correcta para leer un valor
   que solo existe en cliente sin provocar desajuste de hidratación. */
export const webglStore = {
  subscribe: () => () => {},
  getSnapshot: () => isWebGLAvailable(),
  /* En servidor se asume disponible: así el HTML prerenderizado no muestra el
     aviso de "sin WebGL" para luego cambiarlo, que sería el peor parpadeo. */
  getServerSnapshot: () => true,
};

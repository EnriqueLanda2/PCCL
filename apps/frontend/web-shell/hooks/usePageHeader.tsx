/* ───────────────────────────────────────────
   usePageHeader — deja que una vista de adentro (ej. el camino de un curso
   específico) le imponga al DashboardTopbar un título dinámico ("nombre del
   curso" en vez de "Mis cursos" fijo), sin que el topbar tenga que saber
   nada de esa vista.
   ─────────────────────────────────────────── */

'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface PageHeaderOverride {
  eyebrow: string;
  title: string;
  /** Línea chica debajo del título, ej. "3 de 9 completados · 82%". */
  subtitle?: string;
}

interface PageHeaderContextValue {
  override: PageHeaderOverride | null;
  setOverride: (value: PageHeaderOverride | null) => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null);

export function PageHeaderProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [override, setOverride] = useState<PageHeaderOverride | null>(null);
  const value = useMemo(() => ({ override, setOverride }), [override]);
  return <PageHeaderContext.Provider value={value}>{children}</PageHeaderContext.Provider>;
}

/** Para el DashboardTopbar: lee el título impuesto, si hay alguno. */
export function usePageHeaderOverride() {
  return useContext(PageHeaderContext)?.override ?? null;
}

/** Para vistas como CoursePathView: fija el título mientras está montada y lo
    limpia sola al desmontarse (o si `override` pasa a `null`, ej. mientras
    el curso todavía está cargando). */
export function usePageHeader(override: PageHeaderOverride | null) {
  const ctx = useContext(PageHeaderContext);
  const setOverride = ctx?.setOverride;

  useEffect(() => {
    setOverride?.(override);
    return () => setOverride?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOverride, override?.eyebrow, override?.title, override?.subtitle]);
}

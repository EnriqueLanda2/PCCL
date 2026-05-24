/* ───────────────────────────────────────────
   Hook · useProgress
   Progreso del estudiante + estadísticas.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { learningService } from '@/services/learningService';
import type { Progress } from '@/types/certificate';

interface UseProgressState {
  progress: Progress[];
  loading: boolean;
  error: string | null;
}

export function useProgress() {
  const [state, setState] = useState<UseProgressState>({
    progress: [],
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const progress = await learningService.progress();
      setState({ progress, loading: false, error: null });
    } catch {
      setState({ progress: [], loading: false, error: 'No se pudo cargar el progreso' });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    learningService.progress()
      .then((progress) => { if (!cancelled) setState({ progress, loading: false, error: null }); })
      .catch(() => { if (!cancelled) setState({ progress: [], loading: false, error: 'Error al cargar progreso' }); });
    return () => { cancelled = true; };
  }, []);

  /** Porcentaje promedio de todos los cursos */
  const averageProgress = state.progress.length
    ? Math.round(
        state.progress.reduce((s, p) => s + (p.progressPercentage ?? 0), 0) /
        state.progress.length,
      )
    : 0;

  return { ...state, averageProgress, refetch: fetch };
}

/* ───────────────────────────────────────────
   Hook · useAsync
   Envuelve cualquier función async con estado
   de loading, data y error.
   ─────────────────────────────────────────── */

'use client';

import { useCallback, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const run = useCallback(async (asyncFn: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado';
      setState({ data: null, loading: false, error: message });
      return null;
    }
  }, []);

  return { ...state, run };
}

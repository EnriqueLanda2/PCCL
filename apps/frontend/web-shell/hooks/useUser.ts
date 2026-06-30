/* ───────────────────────────────────────────
   Hook · useUser
   Sesión activa y perfil de acceso RBAC.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { authService } from '@/services/authService';
import type { SessionUser, AccessProfile } from '@/types/user';

interface UseUserState {
  user: SessionUser | null;
  access: AccessProfile | null;
  loading: boolean;
  error: string | null;
}

export function useUser() {
  const [state, setState] = useState<UseUserState>({
    user: null,
    access: null,
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [user, access] = await Promise.all([
        authService.me(),
        authService.access(),
      ]);
      setState({ user, access, loading: false, error: null });
    } catch {
      setState({ user: null, access: null, loading: false, error: 'No autenticado' });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    authService.me().then((user) => {
      if (!cancelled) setState((s) => ({ ...s, user, loading: false }));
    }).catch(() => {
      if (!cancelled) setState((s) => ({ ...s, loading: false }));
    });
    return () => { cancelled = true; };
  }, []);

  /** Verifica si el usuario tiene un permiso específico */
  const can = useCallback((permission: string) =>
    state.access?.permissions.includes(permission) ?? false,
  [state.access]);

  /** Verifica si el usuario tiene un módulo visible */
  const canSee = useCallback((module: string) =>
    state.access?.menu.some((m) => m.module === module && m.visible) ?? true,
  [state.access]);

  return { ...state, refetch: fetch, can, canSee };
}

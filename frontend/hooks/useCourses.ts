/* ───────────────────────────────────────────
   Hook · useCourses
   Lista de cursos con estado de carga y error.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { courseService } from '@/services/courseService';
import type { Course } from '@/types/course';

interface UseCoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export function useCourses() {
  const [state, setState] = useState<UseCoursesState>({
    courses: [],
    loading: true,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const courses = await courseService.list();
      setState({ courses, loading: false, error: null });
    } catch {
      setState({ courses: [], loading: false, error: 'No se pudieron cargar los cursos' });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    courseService.list()
      .then((courses) => { if (!cancelled) setState({ courses, loading: false, error: null }); })
      .catch(() => { if (!cancelled) setState({ courses: [], loading: false, error: 'Error al cargar cursos' }); });
    return () => { cancelled = true; };
  }, []);

  return { ...state, refetch: fetch };
}

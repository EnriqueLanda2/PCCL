/* ───────────────────────────────────────────
   Catálogo — cursos publicados en los que el
   usuario todavía no está inscrito. Existe como
   ruta propia porque /learning/courses quedó
   acotado a "mis cursos": sin esta página no
   habría forma de descubrir cursos nuevos dentro
   del portal.
   ─────────────────────────────────────────── */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import { EnrollableCourses } from '@/app/components/shared/EnrollableCourses';
import { PageHeader } from '@/app/components/shared/PageHeader';
import { AppButton, AppInput, AppSelect } from '@/app/components/ui/AppControls';
import { api } from '@/lib/api';
import type { PublicCourse } from '@/lib/types';

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [level,  setLevel]  = useState('Todos');
  const [count,  setCount]  = useState<number | null>(null);
  const [published, setPublished] = useState<PublicCourse[]>([]);
  /* Cambia la key para remontar la lista tras una inscripción y refrescarla. */
  const [reloadKey, setReloadKey] = useState(0);

  const handleCount = useCallback((n: number) => setCount(n), []);
  useEffect(() => {
    let alive = true;
    api.publicCourses()
      .then((rows) => { if (alive) setPublished(rows); })
      .catch(() => { if (alive) setPublished([]); });
    return () => { alive = false; };
  }, [reloadKey]);

  const levelOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const course of published) {
      if (course.level) counts.set(course.level, (counts.get(course.level) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([value, levelCount]) => ({ value, count: levelCount }));
  }, [published]);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader
        title={<>Catálogo de cursos</>}
        subtitle={count === null
          ? 'Buscando cursos disponibles…'
          : `${count} curso${count !== 1 ? 's' : ''} disponible${count !== 1 ? 's' : ''} para inscribirte`}
      />

      <div className="rounded-[1.375rem] border border-[var(--neutral-100)] bg-white/85 p-3 shadow-[0_10px_28px_rgba(23,50,77,0.06)]">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[15rem] flex-1">
            <AppInput
              type="search"
              placeholder="Buscar curso…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              withSearchIcon
            />
          </div>
          <div className="min-w-[13.75rem]">
            <AppSelect
              value={level}
              onChange={(e: SelectChangeEvent) => setLevel(e.target.value)}
              aria-label="Nivel"
            >
              <MenuItem value="Todos">Todos los niveles</MenuItem>
              {levelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.value} ({option.count})</MenuItem>
              ))}
            </AppSelect>
          </div>
          {(search || level !== 'Todos') && (
              <div>
                <AppButton
                  variant="outlined"
                  onClick={() => { setSearch(''); setLevel('Todos'); }}
                >
                  Limpiar filtros
                </AppButton>
              </div>
          )}
        </div>
      </div>

      <EnrollableCourses
        key={reloadKey}
        layout="grid"
        search={search}
        level={level}
        onCountChange={handleCount}
        onEnrolled={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}

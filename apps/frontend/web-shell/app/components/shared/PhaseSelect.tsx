/* ───────────────────────────────────────────
   PhaseSelect — elegir (o crear al vuelo) la fase
   del curso a la que pertenece una lección o una
   clase en vivo.

   `variant` decide qué familia de controles usar para
   que calce con el resto del formulario donde vive:
   · "mui"  — Select/TextField de MUI con fieldSx, igual
              que "Tipo de contenido" en CreateLessonModal.
   · "app"  — AppSelect + Field, igual que "Curso" en la
              página de Clases en vivo.
   ─────────────────────────────────────────── */

'use client';

import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { type SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { api, getErrorMessage } from '@/lib/api';
import type { Phase } from '@/lib/types';
import { Field } from '@/app/components/ui/Input';
import { AppSelect } from '@/app/components/ui/AppControls';
import { fieldSx, softButtonSx } from '@/lib/muiFieldStyles';

const NEW_PHASE_VALUE = '__new__';

interface PhaseSelectProps {
  courseId: string;
  phases: Phase[];
  value: string;
  onChange: (phaseId: string) => void;
  onPhasesChange: (phases: Phase[]) => void;
  disabled?: boolean;
  required?: boolean;
  variant?: 'app' | 'mui';
}

export function PhaseSelect({
  courseId, phases, value, onChange, onPhasesChange, disabled, required, variant = 'app',
}: Readonly<PhaseSelectProps>) {
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = `Fase del curso${required ? '' : ' (opcional)'}`;

  /* Por si quedaron filas duplicadas de antes (mismo título, mismo curso —
     ej. por un doble clic en "Crear" antes de este fix): se muestran una
     sola vez, quedándose con la primera (la de menor `order`). El backend ya
     no vuelve a crear duplicados, pero esto limpia la vista aunque ya
     existan en la base. */
  const uniquePhases = useMemo(() => {
    const seen = new Set<string>();
    return phases.filter((p) => {
      const key = `${p.order}::${p.title.trim().toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [phases]);

  const handleSelect = (val: string) => {
    if (val === NEW_PHASE_VALUE) {
      setCreating(true);
      return;
    }
    onChange(val);
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const phase = await api.createPhase(courseId, newTitle.trim());
      /* El backend es idempotente por título: si ya existía, devuelve la
         misma fase (mismo id) en vez de crear otra — no la vuelvas a agregar
         a la lista si ya está. */
      onPhasesChange(phases.some((p) => p.id === phase.id) ? phases : [...phases, phase]);
      onChange(phase.id);
      setNewTitle('');
      setCreating(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  /* Igual que en QuestionsEditor: este campo vive dentro del <form> de la
     lección/clase — Enter acá no debe mandar ese form entero, solo crear la
     fase (para eso ya está el botón "Crear"). */
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleCreate();
    }
  };

  if (creating) {
    return (
      <Field label={label}>
        <div className="flex gap-2">
          {variant === 'mui' ? (
            <TextField
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="Ej. Fase 1: Fundamentos"
              disabled={busy}
              fullWidth
              size="small"
              autoFocus
              sx={fieldSx}
            />
          ) : (
            <TextField
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="Ej. Fase 1: Fundamentos"
              size="small"
              fullWidth
              disabled={busy}
              autoFocus
            />
          )}
          <Button
            type="button"
            variant="contained"
            onClick={handleCreate}
            disabled={busy || !newTitle.trim()}
            sx={variant === 'mui' ? { ...softButtonSx, bgcolor: 'var(--green-600)', color: '#fff', '&:hover': { bgcolor: 'var(--green-700)' } } : undefined}
          >
            Crear
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => { setCreating(false); setNewTitle(''); }}
            disabled={busy}
            sx={variant === 'mui' ? softButtonSx : undefined}
          >
            Cancelar
          </Button>
        </div>
        {error && <p className="mt-1 text-[0.75rem] text-[#BF2600]">{error}</p>}
      </Field>
    );
  }

  /* Array plano, no Fragment: el <Select> de MUI clona cada hijo directo
     para inyectarle sus props de selección, y un Fragment no es clonable —
     rompe con "doesn't accept a Fragment as a child". */
  const options = [
    !required && <MenuItem key="__none__" value="">Sin fase asignada</MenuItem>,
    required && !value && <MenuItem key="__placeholder__" value="" disabled>Selecciona una fase…</MenuItem>,
    ...uniquePhases.map((p) => (
      <MenuItem key={p.id} value={p.id}>Fase {p.order}: {p.title}</MenuItem>
    )),
    <MenuItem key={NEW_PHASE_VALUE} value={NEW_PHASE_VALUE}>+ Nueva fase…</MenuItem>,
  ].filter(Boolean);

  return (
    <Field label={label}>
      {variant === 'mui' ? (
        <MuiSelect
          value={value}
          onChange={(e: SelectChangeEvent) => handleSelect(e.target.value)}
          disabled={disabled}
          displayEmpty
          fullWidth
          size="small"
          sx={fieldSx}
        >
          {options}
        </MuiSelect>
      ) : (
        <AppSelect value={value} onChange={(e) => handleSelect(e.target.value)} disabled={disabled} displayEmpty>
          {options}
        </AppSelect>
      )}
      {uniquePhases.length === 0 && (
        <p className="mt-1 text-[0.75rem] text-[var(--ink-muted)]">Este curso todavía no tiene fases — crea la primera.</p>
      )}
    </Field>
  );
}

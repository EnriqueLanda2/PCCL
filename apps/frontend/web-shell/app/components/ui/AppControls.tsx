'use client';

import { Children, isValidElement, useState, type ReactNode } from 'react';
import { Icon } from '@iconify/react';
import MuiButton, { type ButtonProps as MuiButtonProps } from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MuiSelect, { type SelectProps as MuiSelectProps } from '@mui/material/Select';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { APP_ICONS } from '@/lib/icons';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 46,
    borderRadius: '999px',
    bgcolor: '#F8FBF5',
    fontFamily: 'var(--font-sans)',
    color: 'var(--ink)',
    '& fieldset': { borderColor: 'var(--neutral-200)' },
    '&:hover fieldset': { borderColor: 'var(--green-300)' },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--green-500)',
      boxShadow: '0 0 0 4px rgba(31,154,75,0.10)',
    },
  },
  '& input::placeholder, & textarea::placeholder': { color: 'var(--ink-muted)', opacity: 1 },
};

const buttonSx = {
  borderRadius: '999px',
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: 'none',
};

export function AppInput({
  sx,
  withSearchIcon = false,
  slotProps,
  ...props
}: TextFieldProps & { withSearchIcon?: boolean }) {
  return (
    <TextField
      fullWidth
      size="small"
      sx={{ ...fieldSx, ...sx }}
      slotProps={withSearchIcon ? {
        ...slotProps,
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Icon icon={APP_ICONS.search} width={16} height={16} style={{ color: 'var(--ink-muted)' }} />
            </InputAdornment>
          ),
        },
      } : slotProps}
      {...props}
    />
  );
}

/* A partir de este número de opciones el desplegable trae buscador. Por debajo
   (niveles, estados, AM/PM…) un buscador solo añadiría un paso inútil. */
const SEARCH_THRESHOLD = 8;

/** Texto plano de una opción, para poder filtrarla aunque su contenido sea JSX. */
function nodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join(' ');
  if (isValidElement(node)) return nodeText((node.props as { children?: ReactNode }).children);
  return '';
}

/** Normaliza para buscar sin acentos ni mayúsculas ("direccion" halla "Dirección"). */
const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function AppSelect<T = unknown>({ sx, children, MenuProps, onClose, ...props }: MuiSelectProps<T>) {
  const [query, setQuery] = useState('');

  const options = Children.toArray(children);
  const searchable = options.length > SEARCH_THRESHOLD;

  const selectedValues = Array.isArray(props.value) ? props.value : [props.value];
  const needle = normalize(query.trim());

  /* Lo seleccionado nunca se filtra: MUI deduce la etiqueta del disparador a
     partir de los hijos, así que si el elegido desaparece del árbol mientras se
     busca, el campo se quedaría en blanco. */
  const visible = !needle
    ? options
    : options.filter((option) => {
        if (!isValidElement(option)) return false;
        const optionValue = (option.props as { value?: unknown }).value;
        if (selectedValues.includes(optionValue as never)) return true;
        return normalize(nodeText((option.props as { children?: ReactNode }).children)).includes(needle);
      });

  return (
    <MuiSelect
      fullWidth
      size="small"
      /* OJO: la limpieza va en el onClose del Select, NUNCA en MenuProps.
         MUI monta el Menu con `onClose: handleClose` ANTES de esparcir
         {...MenuProps} (SelectInput.mjs), así que un onClose puesto ahí
         SUSTITUYE al suyo: el menú deja de cerrarse y el backdrop bloquea
         toda la página. El del Select, en cambio, MUI lo invoca desde dentro
         de su propio handleClose, así que se conserva el cierre. */
      onClose={(event) => {
        setQuery('');
        onClose?.(event);
      }}
      MenuProps={{
        /* El Menu enfoca su lista al abrirse y le robaría el foco al buscador. */
        autoFocus: !searchable,
        ...MenuProps,
      }}
      sx={{
        minHeight: 46,
        borderRadius: '999px',
        bgcolor: '#F8FBF5',
        fontFamily: 'var(--font-sans)',
        color: 'var(--ink)',
        '& fieldset': { borderColor: 'var(--neutral-200)' },
        '&:hover fieldset': { borderColor: 'var(--green-300)' },
        '&.Mui-focused fieldset': { borderColor: 'var(--green-500)', boxShadow: '0 0 0 4px rgba(31,154,75,0.10)' },
        ...sx,
      }}
      {...props}
    >
      {searchable && (
        <li className="app-select-search">
          <TextField
            autoFocus
            fullWidth
            size="small"
            placeholder="Buscar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            /* MUI Select trae un type-ahead que salta a la opción cuya inicial
               coincide y roba el foco del campo. Cortar la propagación aquí es
               lo que permite escribir con normalidad. Escape se deja pasar para
               que siga cerrando el desplegable. */
            onKeyDown={(e) => { if (e.key !== 'Escape') e.stopPropagation(); }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon={APP_ICONS.search} width={15} height={15} style={{ color: 'var(--ink-muted)' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.7rem',
                bgcolor: '#F8FBF5',
                fontSize: '0.875rem',
              },
              '& fieldset': { borderColor: 'var(--neutral-200)' },
              '&:hover fieldset': { borderColor: 'var(--green-300)' },
            }}
          />
        </li>
      )}

      {visible.length > 0
        ? visible
        : <li className="app-select-empty">Sin resultados</li>}
    </MuiSelect>
  );
}

interface AppButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export function AppButton({ sx, variant = 'outlined', loading = false, disabled, children, ...props }: AppButtonProps) {
  const contained = variant === 'contained';
  return (
    <MuiButton
      variant={variant}
      disabled={disabled || loading}
      sx={{
        ...buttonSx,
        borderColor: contained ? 'var(--green-500)' : 'var(--neutral-200)',
        bgcolor: contained ? 'var(--green-600)' : 'var(--panel)',
        color: contained ? '#fff' : 'var(--ink-soft)',
        '&:hover': {
          borderColor: contained ? 'var(--green-600)' : 'var(--green-300)',
          bgcolor: contained ? 'var(--green-700)' : 'var(--green-50)',
          boxShadow: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? <WaveSpinner size="xs" label="Procesando…" /> : children}
    </MuiButton>
  );
}

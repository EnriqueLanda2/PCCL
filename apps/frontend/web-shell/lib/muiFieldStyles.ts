/** Estilos compartidos para inputs/selects de MUI dentro de modales —
 *  mismo look (bordes redondeados, fondo verdoso, foco) en todos lados. */
export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '1.125rem',
    bgcolor: '#F8FBF5',
    fontFamily: 'var(--font-sans)',
    color: 'var(--ink)',
    '& fieldset': { borderColor: '#DDE7D7' },
    '&:hover fieldset': { borderColor: 'var(--green-300)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--green-500)', boxShadow: '0 0 0 2px var(--green-100)' },
    '&.Mui-disabled': { bgcolor: '#F1F6EB' },
  },
  '& input::placeholder, & textarea::placeholder': { color: '#A2AE9D', opacity: 1 },
};

export const softButtonSx = {
  borderRadius: '999px',
  borderColor: 'var(--neutral-200)',
  bgcolor: 'var(--panel)',
  color: 'var(--ink-soft)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 700,
  textTransform: 'none' as const,
  '&:hover': { bgcolor: 'var(--green-50)', borderColor: 'var(--green-300)' },
};

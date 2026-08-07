import MuiPagination from '@mui/material/Pagination';

interface PaginationProps {
  page: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onChange: (page: number) => void;
  label?: string;
  className?: string;
}

export const DEFAULT_PAGE_SIZE = 20;

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize = DEFAULT_PAGE_SIZE,
  onChange,
  label = 'elementos',
  className,
}: Readonly<PaginationProps>) {
  const computedTotalPages = totalPages ?? Math.max(1, Math.ceil((totalItems ?? 0) / pageSize));
  if (computedTotalPages <= 1) return null;

  const pageSafe = Math.min(Math.max(page, 1), computedTotalPages);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <MuiPagination
        page={pageSafe}
        count={computedTotalPages}
        onChange={(_, value) => onChange(value)}
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
        sx={{
          '& .MuiPagination-ul': { justifyContent: 'center', gap: '0.25rem' },
          '& .MuiPaginationItem-root': {
            minWidth: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--neutral-200)',
            bgcolor: 'var(--panel)',
            color: 'var(--ink-muted)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            '&:hover': { bgcolor: 'var(--green-50)', borderColor: 'var(--green-300)' },
            '&.Mui-selected': {
              bgcolor: 'var(--blue-500)',
              borderColor: 'var(--blue-500)',
              color: '#fff',
              boxShadow: '0 10px 22px rgba(61,108,229,0.16)',
              '&:hover': { bgcolor: 'var(--blue-600)' },
            },
          },
        }}
      />
      {typeof totalItems === 'number' && (
        <span style={{ fontSize: '0.7813rem', color: 'var(--ink-muted)' }}>
          Máximo {pageSize} {label} por página
        </span>
      )}
    </div>
  );
}

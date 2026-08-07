/* ───────────────────────────────────────────
   Shared · Breadcrumb
   Miga de pan accesible con separadores.
   ─────────────────────────────────────────── */

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--ink-muted)', marginBottom: '1rem' }}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: 'var(--neutral-300)' }}>/</span>}
          {item.href ? (
            <Link href={item.href} style={{ color: 'var(--blue-600)', transition: 'color 160ms' }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--ink)' }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

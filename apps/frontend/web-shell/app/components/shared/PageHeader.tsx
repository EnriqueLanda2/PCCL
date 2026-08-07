'use client';

import type { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  action,
}: Readonly<{
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}>) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-[clamp(24px,2.4vw,32px)] font-normal leading-tight text-[var(--ink)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-[var(--ink-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

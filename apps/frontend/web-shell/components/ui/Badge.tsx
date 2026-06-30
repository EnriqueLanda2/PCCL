import React from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'dark' | 'purple' | 'teal';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantCls: Record<BadgeVariant, string> = {
  blue:   'bg-primary-50 text-primary-600',
  green:  'bg-success-50 text-success-600',
  yellow: 'bg-warning-50 text-warning-600',
  red:    'bg-danger-50 text-danger-600',
  dark:   'bg-neutral-900 text-white',
  purple: 'bg-purple-50 text-purple-600',
  teal:   'bg-teal-50 text-teal-500',
};

export function Badge({ variant = 'blue', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full',
      'text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap',
      variantCls[variant],
      className,
    )}>
      {children}
    </span>
  );
}

/** Quick helper: maps a raw status string to a BadgeVariant */
export function statusToBadgeVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    published:     'green',
    completed:     'green',
    valid:         'green',
    active:        'green',
    enrolled:      'blue',
    'in-progress': 'yellow',
    draft:         'dark',
    dropped:       'red',
    expired:       'red',
    revoked:       'red',
    inactive:      'yellow',
  };
  return map[status] ?? 'blue';
}

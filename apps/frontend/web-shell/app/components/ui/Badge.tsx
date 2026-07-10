import React from 'react';
import { cn } from '@/lib/cn';

export type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'dark' | 'purple' | 'teal';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantCls: Record<BadgeVariant, string> = {
  blue:   'bg-[#EAF2FF] text-[#2566CB]',
  green:  'bg-[#E6F8EA] text-[#1E8B48]',
  yellow: 'bg-[#FFF4D8] text-[#B87400]',
  red:    'bg-[#FFF1ED] text-[#BF2600]',
  dark:   'bg-[#17324D] text-white',
  purple: 'bg-[#F1ECFF] text-[#5A4AB2]',
  teal:   'bg-[#EAFBFB] text-[#14A6A6]',
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

import React from 'react';
import { cn } from '@/lib/cn';

type AvatarSize    = 'xs' | 'sm' | 'md' | 'lg';
type AvatarVariant = 'blue' | 'green' | 'dark' | 'purple';

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  className?: string;
}

const sizeCls: Record<AvatarSize, string> = {
  xs: 'w-7 h-7 text-[11px]',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-xl',
};

const variantCls: Record<AvatarVariant, string> = {
  blue:   'bg-primary-100 text-primary-700',
  green:  'bg-success-100 text-success-700',
  dark:   'bg-neutral-900 text-white',
  purple: 'bg-purple-100 text-purple-600',
};

export function Avatar({ initials, size = 'sm', variant = 'blue', className }: AvatarProps) {
  return (
    <div className={cn(
      'rounded-full inline-flex items-center justify-center font-semibold shrink-0',
      sizeCls[size],
      variantCls[variant],
      className,
    )}>
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}

/** Derive two-letter initials from a full name. */
export function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase() || 'US';
}

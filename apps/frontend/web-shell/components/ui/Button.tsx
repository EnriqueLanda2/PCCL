import React from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'link';
type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  pill?:      boolean;    // fully rounded
  block?:     boolean;    // full width
  loading?:   boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantCls: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white border border-primary-500 hover:border-primary-400 shadow-sm hover:shadow-md',
  secondary:
    'bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 border border-neutral-300 hover:border-neutral-400 shadow-sm',
  ghost:
    'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 border border-transparent',
  danger:
    'bg-danger-50 hover:bg-danger-100 active:bg-danger-200 text-danger-600 border border-danger-200 hover:border-danger-300',
  success:
    'bg-success-500 hover:bg-success-400 active:bg-success-600 text-white border border-success-500 shadow-sm',
  link:
    'bg-transparent text-primary-600 hover:text-primary-800 border border-transparent underline-offset-4 hover:underline p-0 h-auto',
};

const sizeCls: Record<ButtonSize, string> = {
  xs: 'h-7 px-3 text-xs gap-1.5',
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export function Button({
  variant   = 'primary',
  size      = 'md',
  pill      = false,
  block     = false,
  loading   = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center font-medium cursor-pointer select-none',
        'transition-all duration-150 whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
        pill ? 'rounded-full' : 'rounded-lg',
        variantCls[variant],
        variant !== 'link' && sizeCls[size],
        block && 'w-full',
        className,
      )}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full flex-shrink-0"
          style={{ animation: 'spin 0.6s linear infinite' }}
        />
      ) : (
        leftIcon && <span aria-hidden className="flex-shrink-0">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon && <span aria-hidden className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}

/* ── Icon-only button ── */
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon:       React.ReactNode;
  label:      string;          // for aria-label
  size?:      ButtonSize;
  variant?:   ButtonVariant;
  pill?:      boolean;
}

export function IconButton({
  icon,
  label,
  size    = 'md',
  variant = 'ghost',
  pill    = false,
  className,
  ...props
}: IconButtonProps) {
  const sizeMap: Record<ButtonSize, string> = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center cursor-pointer select-none flex-shrink-0',
        'transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        pill ? 'rounded-full' : 'rounded-lg',
        variantCls[variant],
        sizeMap[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}

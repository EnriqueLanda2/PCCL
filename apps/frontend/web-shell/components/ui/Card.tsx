import React from 'react';
import { cn } from '@/lib/cn';

/* ── Variant tokens ── */
type CardVariant = 'default' | 'dark' | 'accent' | 'success' | 'warning' | 'danger' | 'flat' | 'glass';
type CardPadding = 'none' | 'tight' | 'default' | 'loose';
type CardRadius  = 'md' | 'lg' | 'xl';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  variant?:  CardVariant;
  padding?:  CardPadding;
  radius?:   CardRadius;
  hover?:    boolean;          // adds lift + shadow on hover
  bordered?: boolean;          // force border on glass/flat
  children:  React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}

const variantCls: Record<CardVariant, string> = {
  default: 'bg-white border border-neutral-200 shadow-sm',
  flat:    'bg-neutral-50 border border-neutral-100',
  dark:    'bg-neutral-900 text-primary-100 border border-neutral-800 shadow-lg',
  accent:  'bg-primary-50 border border-primary-200 shadow-sm',
  success: 'bg-success-50 border border-success-200 shadow-sm',
  warning: 'bg-warning-50 border border-warning-200 shadow-sm',
  danger:  'bg-danger-50 border border-danger-200 shadow-sm',
  glass:   'bg-white/70 backdrop-blur-md border border-white/40 shadow-sm',
};

const paddingCls: Record<CardPadding, string> = {
  none:    '',
  tight:   'p-4',
  default: 'p-5 lg:p-6',
  loose:   'p-7 lg:p-8',
};

const radiusCls: Record<CardRadius, string> = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

export function Card({
  variant  = 'default',
  padding  = 'default',
  radius   = 'xl',
  hover    = false,
  children,
  className,
  onClick,
  as: Tag  = 'div',
  ...rest
}: CardProps & { as?: keyof React.JSX.IntrinsicElements }) {
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      onClick={onClick}
      {...rest}
      className={cn(
        'relative overflow-hidden',
        radiusCls[radius],
        variantCls[variant],
        paddingCls[padding],
        hover && 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </Comp>
  );
}

/* ── Sub-components for consistent card anatomy ── */

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('font-serif text-lg text-neutral-900 leading-tight', className)}>
      {children}
    </h2>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-neutral-500', className)}>
      {children}
    </p>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 pt-4 mt-4 border-t border-neutral-100', className)}>
      {children}
    </div>
  );
}

export function CardDivider({ className }: { className?: string }) {
  return <hr className={cn('border-neutral-100 my-4', className)} />;
}

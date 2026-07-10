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
  default: 'bg-white border border-[#E4EBDD] shadow-[0_12px_36px_rgba(23,50,77,0.05)]',
  flat:    'bg-[#F8FBF5] border border-[#E4EBDD]',
  dark:    'bg-[#17324D] text-[#D7E8FF] border border-[#17324D] shadow-[0_18px_38px_rgba(23,50,77,0.18)]',
  accent:  'bg-[#ECF8EF] border border-[#CDEFD9] shadow-[0_12px_28px_rgba(31,154,75,0.06)]',
  success: 'bg-[#ECF8EF] border border-[#CDEFD9] shadow-[0_12px_28px_rgba(31,154,75,0.06)]',
  warning: 'bg-[#FFF8E8] border border-[#F4E2A9] shadow-[0_12px_28px_rgba(255,139,0,0.06)]',
  danger:  'bg-[#FFF1ED] border border-[#F7C7B9] shadow-[0_12px_28px_rgba(191,38,0,0.06)]',
  glass:   'bg-white/78 backdrop-blur-md border border-white/50 shadow-[0_12px_28px_rgba(23,50,77,0.05)]',
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
        'relative overflow-hidden rounded-[24px]',
        radiusCls[radius],
        variantCls[variant],
        paddingCls[padding],
        hover && 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(23,50,77,0.08)]',
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
    <h2 className={cn('font-sans text-lg text-[var(--ink)] leading-tight font-semibold', className)}>
      {children}
    </h2>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-[var(--ink-muted)]', className)}>
      {children}
    </p>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 pt-4 mt-4 border-t border-[#E4EBDD]', className)}>
      {children}
    </div>
  );
}

export function CardDivider({ className }: { className?: string }) {
  return <hr className={cn('border-[#E4EBDD] my-4', className)} />;
}

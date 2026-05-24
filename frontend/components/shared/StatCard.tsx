import React from 'react';
import { cn } from '@/lib/cn';

type StatVariant = 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';

interface StatCardProps {
  label:      string;
  value:      number | string;
  unit?:      string;
  delta?:     string;           // e.g. "+12%" or "vs. last month"
  deltaUp?:   boolean;
  icon?:      React.ReactNode;
  variant?:   StatVariant;
  loading?:   boolean;
  className?: string;
}

const variantTokens: Record<StatVariant, { card: string; icon: string; value: string }> = {
  default: {
    card:  'bg-white border border-neutral-200',
    icon:  'bg-neutral-100 text-neutral-600',
    value: 'text-neutral-900',
  },
  blue: {
    card:  'bg-primary-50 border border-primary-200',
    icon:  'bg-primary-100 text-primary-600',
    value: 'text-primary-700',
  },
  green: {
    card:  'bg-success-50 border border-success-200',
    icon:  'bg-success-100 text-success-600',
    value: 'text-success-700',
  },
  yellow: {
    card:  'bg-warning-50 border border-warning-200',
    icon:  'bg-warning-100 text-warning-600',
    value: 'text-warning-700',
  },
  red: {
    card:  'bg-danger-50 border border-danger-200',
    icon:  'bg-danger-100 text-danger-600',
    value: 'text-danger-700',
  },
  purple: {
    card:  'bg-purple-50 border border-purple-100',
    icon:  'bg-purple-100 text-purple-500',
    value: 'text-purple-700',
  },
};

function SkeletonStatCard() {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-20 bg-neutral-200 rounded" />
        <div className="w-9 h-9 bg-neutral-200 rounded-lg" />
      </div>
      <div className="h-8 w-16 bg-neutral-200 rounded mb-2" />
      <div className="h-3 w-24 bg-neutral-100 rounded" />
    </div>
  );
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaUp = true,
  icon,
  variant = 'default',
  loading = false,
  className,
}: StatCardProps) {
  if (loading) return <SkeletonStatCard />;

  const t = variantTokens[variant];

  return (
    <div className={cn('rounded-xl p-5 shadow-sm', t.card, className)}>
      {/* Label + icon row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 select-none">
          {label}
        </p>
        {icon && (
          <span className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0', t.icon)}>
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <p className={cn('font-serif text-3xl lg:text-4xl leading-none font-semibold', t.value)}>
        {value}
        {unit && (
          <small className="text-xl lg:text-2xl text-neutral-400 font-normal ml-1">{unit}</small>
        )}
      </p>

      {/* Delta */}
      {delta && (
        <p className={cn('text-xs font-medium mt-2.5 flex items-center gap-1',
          deltaUp ? 'text-success-600' : 'text-danger-500')}>
          <span>{deltaUp ? '↑' : '↓'}</span>
          {delta}
        </p>
      )}
    </div>
  );
}

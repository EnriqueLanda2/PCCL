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
  /** 'lg' agranda padding/tipografía — para filas de stats destacadas */
  size?:      'default' | 'lg';
  loading?:   boolean;
  className?: string;
}

const variantTokens: Record<StatVariant, { card: string; icon: string; value: string }> = {
  default: {
    card:  'bg-white border border-[#E4EBDD]',
    icon:  'bg-[#F1F6EB] text-[var(--green-700)]',
    value: 'text-[var(--ink)]',
  },
  blue: {
    card:  'bg-[#EDF5FF] border border-[#D7E8FF]',
    icon:  'bg-[#D7E8FF] text-[#2566CB]',
    value: 'text-[#2566CB]',
  },
  green: {
    card:  'bg-[#ECF8EF] border border-[#CDEFD9]',
    icon:  'bg-[#D2F2DE] text-[#1E8B48]',
    value: 'text-[#1E8B48]',
  },
  yellow: {
    card:  'bg-[#FFF8E8] border border-[#F4E2A9]',
    icon:  'bg-[#F4E2A9] text-[#B87400]',
    value: 'text-[#B87400]',
  },
  red: {
    card:  'bg-[#FFF1ED] border border-[#F7C7B9]',
    icon:  'bg-[#F7C7B9] text-[#BF2600]',
    value: 'text-[#BF2600]',
  },
  purple: {
    card:  'bg-[#F1ECFF] border border-[#E0D7FF]',
    icon:  'bg-[#E0D7FF] text-[#5A4AB2]',
    value: 'text-[#5A4AB2]',
  },
};

function SkeletonStatCard() {
  return (
    <div className="bg-white border border-[#E4EBDD] rounded-[24px] p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-20 bg-[#E4EBDD] rounded" />
        <div className="w-9 h-9 bg-[#E4EBDD] rounded-xl" />
      </div>
      <div className="h-8 w-16 bg-[#E4EBDD] rounded mb-2" />
      <div className="h-3 w-24 bg-[#F1F6EB] rounded" />
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
  size = 'default',
  loading = false,
  className,
}: Readonly<StatCardProps>) {
  if (loading) return <SkeletonStatCard />;

  const t = variantTokens[variant];
  const lg = size === 'lg';

  return (
    <div className={cn('rounded-[24px] shadow-[0_12px_28px_rgba(23,50,77,0.05)]', lg ? 'p-6 lg:p-7' : 'p-5', t.card, className)}>
      {/* Label + icon row */}
      <div className={cn('flex items-center justify-between', lg ? 'mb-4' : 'mb-3')}>
        <p className={cn('font-semibold uppercase tracking-widest text-[var(--ink-muted)] select-none', lg ? 'text-[12px]' : 'text-[11px]')}>
          {label}
        </p>
        {icon && (
          <span className={cn('rounded-lg flex items-center justify-center flex-shrink-0', t.icon, lg ? 'w-11 h-11 text-lg' : 'w-9 h-9 text-base')}>
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <p className={cn('font-sans leading-none font-extrabold', lg ? 'text-4xl lg:text-5xl' : 'text-3xl lg:text-4xl', t.value)}>
        {value}
        {unit && (
          <small className="text-xl lg:text-2xl text-neutral-400 font-normal ml-1">{unit}</small>
        )}
      </p>

      {/* Delta */}
      {delta && (
        <p className={cn('text-xs font-medium mt-2.5 flex items-center gap-1',
          deltaUp ? 'text-[#1E8B48]' : 'text-[#BF2600]')}>
          <span>{deltaUp ? '↑' : '↓'}</span>
          {delta}
        </p>
      )}
    </div>
  );
}

import React from 'react';
import { cn } from '@/lib/cn';

type ProgressColor = 'blue' | 'green' | 'yellow';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;        // 0–100
  color?: ProgressColor;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const fillCls: Record<ProgressColor, string> = {
  blue:   'bg-gradient-to-r from-[var(--blue-500)] to-[var(--blue-600)]',
  green:  'bg-gradient-to-r from-[var(--green-500)] to-[var(--green-700)]',
  yellow: 'bg-gradient-to-r from-[#E3B23C] to-[#D39A24]',
};

export function ProgressBar({ value, color = 'blue', size = 'sm', showLabel = false, className, ...rest }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const trackH = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className={cn('flex flex-col', showLabel && 'gap-1.5', className)} {...rest}>
      {showLabel && (
        <div className="flex justify-between text-xs">
          <span className="text-neutral-600">Avance</span>
          <strong className="text-neutral-900 font-mono">{clamped}%</strong>
        </div>
      )}
      <div className={cn('w-full bg-[#E5EBDF] border border-[#D6E2CC] rounded-full overflow-hidden', trackH)}>
        <div
          className={cn('h-full rounded-full transition-[width] duration-500', fillCls[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

import React from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full h-11 px-4 rounded-2xl text-sm bg-[#F8FBF5] text-[var(--ink)] placeholder:text-[#A2AE9D]',
        'border transition-colors duration-150 outline-none',
        error
          ? 'border-[#E08A72] focus:border-[#BF2600] focus:ring-2 focus:ring-[#F7D8CF]'
          : 'border-[#DDE7D7] focus:border-[var(--green-500)] focus:ring-2 focus:ring-[#D2F2DE]',
        'disabled:bg-[#F1F6EB] disabled:text-[#A2AE9D] disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  );
}

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, error, hint, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-[var(--ink)]">{label}</label>
      {children}
      {error && error.trim() && (
        <p className="text-xs text-[#BF2600]">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-[var(--ink-muted)]">{hint}</p>
      )}
    </div>
  );
}

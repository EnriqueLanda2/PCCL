import React from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full h-10 px-3 rounded text-sm bg-white text-neutral-900 placeholder:text-neutral-400',
        'border transition-colors duration-150 outline-none',
        error
          ? 'border-danger-400 focus:border-danger-400 focus:ring-2 focus:ring-danger-100'
          : 'border-neutral-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-100',
        'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed',
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
      <label className="text-sm font-medium text-neutral-800">{label}</label>
      {children}
      {error && error.trim() && (
        <p className="text-xs text-danger-500">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

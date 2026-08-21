'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/cn';
import { APP_ICONS } from '@/lib/icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, type, ...props }: InputProps) {
  /* Transparente para quien llama: basta con type="password", sin ningún prop
     extra ni cambio en los sitios donde ya se usa. Cualquier input de
     contraseña nuevo hereda el ojo automáticamente. */
  const isPassword = type === 'password';
  const [revealed, setRevealed] = useState(false);

  const input = (
    <input
      type={isPassword ? (revealed ? 'text' : 'password') : type}
      className={cn(
        'w-full h-11 px-4 rounded-2xl text-sm bg-[#F8FBF5] text-[var(--ink)] placeholder:text-[#A2AE9D]',
        'border transition-colors duration-150 outline-none',
        error
          ? 'border-[#E08A72] focus:border-[#BF2600] focus:ring-2 focus:ring-[#F7D8CF]'
          : 'border-[#DDE7D7] focus:border-[var(--green-500)] focus:ring-2 focus:ring-[#D2F2DE]',
        'disabled:bg-[#F1F6EB] disabled:text-[#A2AE9D] disabled:cursor-not-allowed',
        /* Hueco para el ojo, si no el texto pasaría por debajo del ícono. */
        isPassword && 'pr-11',
        className,
      )}
      {...props}
    />
  );

  if (!isPassword) return input;

  return (
    <div className="relative">
      {input}
      <button
        type="button"
        onClick={() => setRevealed((v) => !v)}
        aria-label={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#A2AE9D] transition-colors hover:text-[var(--ink)]"
      >
        <Icon icon={revealed ? APP_ICONS.eyeClosed : APP_ICONS.eye} width={18} height={18} />
      </button>
    </div>
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

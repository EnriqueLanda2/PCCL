/* ───────────────────────────────────────────
   Button — fachada sobre el RaisedButton del
   registry. Se conserva la firma original
   { variant, size, pill, block, loading, … } para
   que los ~40 puntos que ya lo usan adopten el
   componente nuevo sin tocarlos uno por uno.

   El estilo pedido (blanco en reposo, gris al
   hover) es el del botón por defecto; las variantes
   con intención — primaria, peligro — conservan su
   color para no aplanar la jerarquía visual.
   ─────────────────────────────────────────── */

'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { RaisedButton } from '@/registry/new-york/ui/raised-button';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

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

/** Color que recibe RaisedButton por variante. `undefined` = blanco/gris. */
const variantColor: Record<ButtonVariant, string | undefined> = {
  primary:   '#1F9A4B',
  success:   '#1F9A4B',
  danger:    '#DB5F57',
  secondary: undefined,
  ghost:     undefined,
  link:      undefined,
};

/** Blanco en reposo, gris al hover — el aspecto pedido para el botón neutro. */
const NEUTRAL_CLS =
  'bg-white text-[var(--ink)] border-[var(--neutral-200)] hover:bg-[var(--neutral-100)] ' +
  'dark:bg-white dark:text-[var(--ink)]';

/** RaisedButton solo trae default/sm/lg/icon; xs se ajusta a mano. */
const sizeMap: Record<ButtonSize, 'default' | 'sm' | 'lg'> = {
  xs: 'sm',
  sm: 'sm',
  md: 'default',
  lg: 'lg',
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

  /* `link` no es un botón elevado: es texto pulsable y debe seguir siéndolo. */
  if (variant === 'link') {
    return (
      <button
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 font-medium',
          'text-[var(--green-700)] underline-offset-4 hover:text-[var(--green-600)] hover:underline',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }

  const neutral = variantColor[variant] === undefined;

  return (
    <RaisedButton
      color={variantColor[variant]}
      size={sizeMap[size]}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        pill && 'rounded-full before:rounded-full',
        block && 'w-full',
        size === 'xs' && 'h-7 px-3 text-xs',
        neutral && NEUTRAL_CLS,
        className,
      )}
      {...props}
    >
      {loading ? <WaveSpinner size="xs" label="Procesando…" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </RaisedButton>
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
  const sizeCls: Record<ButtonSize, string> = {
    xs: 'h-7 w-7',
    sm: 'h-9 w-9',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  const neutral = variantColor[variant] === undefined;

  return (
    <RaisedButton
      color={variantColor[variant]}
      size="icon"
      aria-label={label}
      className={cn(
        pill ? 'rounded-full before:rounded-full' : 'rounded-xl before:rounded-xl',
        sizeCls[size],
        neutral && NEUTRAL_CLS,
        className,
      )}
      {...props}
    >
      {icon}
    </RaisedButton>
  );
}

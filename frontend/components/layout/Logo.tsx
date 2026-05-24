/* ───────────────────────────────────────────
   Layout · Logo
   Marca visual: azul marino + acento verde.
   ─────────────────────────────────────────── */

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  dark?: boolean;        // true = sobre fondo oscuro (sidebar)
  href?: string;
  size?: 'sm' | 'md';
}

export function Logo({ dark = false, href = '/', size = 'md' }: LogoProps) {
  const fontSize = size === 'sm' ? '18px' : '22px';
  const markSize = size === 'sm' ? '28px' : '34px';

  const content = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-serif)', fontSize, color: dark ? 'var(--panel)' : 'var(--ink)', letterSpacing: '-0.01em' }}>
      {/* Logo mark — azul marino con punto verde */}
      <span style={{
        width: markSize, height: markSize,
        borderRadius: '10px',
        background: dark ? 'var(--blue-700)' : 'var(--blue-800)',
        color: 'var(--panel)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Acento verde — creatividad */}
        <span style={{
          position: 'absolute',
          top: '18%',
          left: '18%',
          width: '32%',
          height: '32%',
          borderRadius: '50%',
          background: 'var(--green-300)',
          opacity: 0.9,
        }} />
        <span style={{ position: 'relative', fontFamily: 'var(--font-serif)', fontSize: size === 'sm' ? '14px' : '18px', lineHeight: 1 }}>
          L
        </span>
      </span>
      Lumen<span style={{ color: dark ? 'var(--blue-400)' : 'var(--blue-600)' }}>.</span>edu
    </span>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

/* ───────────────────────────────────────────
   Layout · Logo
  Marca visual: verde + crema.
   ─────────────────────────────────────────── */

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  dark?: boolean;        // true = sobre fondo oscuro (sidebar)
  href?: string;
  size?: 'sm' | 'md';
}

export function Logo({ dark = false, href = '/', size = 'md' }: LogoProps) {
  const fontSize = size === 'sm' ? '1.125rem' : '1.375rem';
  const markSize = size === 'sm' ? '1.75rem' : '2.125rem';

  const content = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-sans)', fontSize, color: dark ? 'var(--panel)' : 'var(--ink)', letterSpacing: '-0.02em', fontWeight: 800 }}>
      <span style={{
        width: markSize, height: markSize,
        borderRadius: '0.75rem',
        background: 'linear-gradient(135deg, var(--green-600), var(--green-500))',
        color: 'var(--panel)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 10px 24px rgba(31,154,75,0.22)',
      }}>
        <span style={{
          position: 'absolute',
          top: '17%',
          left: '17%',
          width: '34%',
          height: '34%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.28)',
        }} />
        <span style={{ position: 'relative', fontSize: size === 'sm' ? '0.875rem' : '1.125rem', lineHeight: 1 }}>
          R
        </span>
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span>Rumbo</span>
        <span style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', color: dark ? 'rgba(255,255,255,0.7)' : 'var(--green-600)', fontWeight: 800, marginTop: '2px' }}>
          PROFESORES
        </span>
      </span>
    </span>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

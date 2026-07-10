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
  const fontSize = size === 'sm' ? '18px' : '22px';
  const markSize = size === 'sm' ? '28px' : '34px';

  const content = (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-sans)', fontSize, color: dark ? 'var(--panel)' : 'var(--ink)', letterSpacing: '-0.02em', fontWeight: 800 }}>
      <span style={{
        width: markSize, height: markSize,
        borderRadius: '12px',
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
        <span style={{ position: 'relative', fontSize: size === 'sm' ? '14px' : '18px', lineHeight: 1 }}>
          R
        </span>
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span>Rumbo</span>
        <span style={{ fontSize: '11px', letterSpacing: '0.12em', color: dark ? 'rgba(255,255,255,0.7)' : 'var(--green-600)', fontWeight: 800, marginTop: '2px' }}>
          PROFESORES
        </span>
      </span>
    </span>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

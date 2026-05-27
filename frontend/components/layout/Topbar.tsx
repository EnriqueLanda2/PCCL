/* ───────────────────────────────────────────
   Layout · Topbar
   Barra de navegación pública (landing).
   Azul marino con fondo semitransparente.
   ─────────────────────────────────────────── */

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { appRoutes } from '@/lib/routes';

type TopbarProps = Readonly<{
  activeHref?: string;
}>;

const navLinks = [
  { label: 'Catálogo', href: appRoutes.courses },
  { label: 'Para equipos', href: '#' },
  { label: 'Precios', href: '#' },
  { label: 'Historias', href: '#' },
];

export function Topbar(props: TopbarProps) {
  const { activeHref } = props;

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      padding: '20px clamp(20px, 4vw, 56px)',
      borderBottom: '1px solid var(--neutral-100)',
      background: 'rgba(245, 248, 255, 0.92)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(8px)',
    }}>
      <Logo href={appRoutes.home} />

      <nav style={{ display: 'flex', gap: '24px', fontSize: '14.5px', color: 'var(--ink-soft)' }}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: activeHref === link.href ? 'var(--blue-700)' : 'var(--ink-soft)',
              fontWeight: activeHref === link.href ? 500 : 400,
              transition: 'color 160ms',
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link
          href={appRoutes.login}
          style={{
            display: 'inline-flex', alignItems: 'center', height: '36px',
            padding: '0 16px', borderRadius: '999px', fontSize: '13.5px', fontWeight: 500,
            color: 'var(--blue-700)', background: 'transparent',
            transition: 'background 160ms',
          }}
        >
          Iniciar sesión
        </Link>
        <Link
          href={appRoutes.register}
          style={{
            display: 'inline-flex', alignItems: 'center', height: '36px',
            padding: '0 16px', borderRadius: '999px', fontSize: '13.5px', fontWeight: 500,
            background: 'var(--blue-700)', color: 'var(--panel)',
            transition: 'background 160ms, box-shadow 160ms',
          }}
        >
          Comenzar
        </Link>
      </div>
    </header>
  );
}

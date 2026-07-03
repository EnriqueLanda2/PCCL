/* ───────────────────────────────────────────
   Layout · Topbar
   Header público (landing).
   Franja de acento azul→verde bandera + nav.
   ─────────────────────────────────────────── */

'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { appRoutes } from '@/lib/routes';

type TopbarProps = Readonly<{
  activeHref?: string;
}>;

const navLinks = [
  { label: 'Catálogo', href: appRoutes.courses },
  { label: 'Para equipos', href: '#equipos' },
  { label: 'Precios', href: '#precios' },
  { label: 'Historias', href: '#historias' },
];

export function Topbar(props: TopbarProps) {
  const { activeHref } = props;
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <>
      {/* Franja de acento — bandera azul→verde */}
      <div
        style={{
          height: '4px',
          background:
            'linear-gradient(90deg, var(--blue-700) 0%, var(--blue-500) 45%, var(--green-500) 100%)',
        }}
      />

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          padding: '16px clamp(20px, 4vw, 56px)',
          borderBottom: '1px solid var(--neutral-200)',
          background: 'rgba(255, 255, 255, 0.85)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(10px)',
        }}
      >
        <Logo href={appRoutes.home} />

        <nav
          style={{
            display: 'flex',
            gap: '4px',
            fontSize: '14.5px',
            marginLeft: '8px',
          }}
        >
          {navLinks.map((link) => {
            const active = activeHref === link.href || hovered === link.label;
            return (
              <Link
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHovered(link.label)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'relative',
                  padding: '8px 14px',
                  borderRadius: '999px',
                  color: active ? 'var(--blue-700)' : 'var(--ink-soft)',
                  fontWeight: active ? 600 : 450,
                  background: active ? 'var(--blue-50)' : 'transparent',
                  transition: 'color 160ms, background 160ms',
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          <Link
            href={appRoutes.login}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '40px',
              padding: '0 18px',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--blue-700)',
              background: 'transparent',
              transition: 'background 160ms',
            }}
          >
            Iniciar sesión
          </Link>
          <Link
            href={appRoutes.register}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              height: '40px',
              padding: '0 20px',
              borderRadius: '999px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--panel)',
              background:
                'linear-gradient(120deg, var(--blue-700), var(--green-600))',
              boxShadow: '0 4px 14px -4px rgba(11,114,51,0.5)',
              transition: 'box-shadow 160ms, transform 160ms',
            }}
          >
            Comenzar
            <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
          </Link>
        </div>
      </header>
    </>
  );
}

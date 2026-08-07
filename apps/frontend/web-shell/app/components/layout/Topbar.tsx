/* ───────────────────────────────────────────
   Layout · Topbar
  Header público (landing).
  Franja de acento verde + nav.
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
      {/* Franja de acento */}
      <div
        style={{
          height: '0.25rem',
          background: 'linear-gradient(90deg, var(--green-700) 0%, var(--green-500) 100%)',
        }}
      />

      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          padding: '16px clamp(20px, 4vw, 56px)',
          borderBottom: '1px solid rgba(23, 50, 77, 0.08)',
          background: 'rgba(247, 250, 243, 0.82)',
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
            gap: '0.375rem',
            fontSize: '0.9688rem',
            marginLeft: '0.75rem',
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
                  padding: '9px 17px',
                  borderRadius: '999px',
                  color: active ? 'var(--green-700)' : 'var(--ink-soft)',
                  fontWeight: active ? 600 : 450,
                  background: active ? 'var(--green-50)' : 'transparent',
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
            gap: '0.625rem',
            alignItems: 'center',
          }}
        >
          <Link
            href={appRoutes.login}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '2.5rem',
              padding: '0 18px',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--green-700)',
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
              gap: '0.5rem',
              height: '2.5rem',
              padding: '0 20px',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--panel)',
              background: 'linear-gradient(120deg, var(--green-700), var(--green-500))',
              boxShadow: '0 8px 22px -8px rgba(31,154,75,0.45)',
              transition: 'box-shadow 160ms, transform 160ms',
            }}
          >
            Comenzar
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
          </Link>
        </div>
      </header>
    </>
  );
}

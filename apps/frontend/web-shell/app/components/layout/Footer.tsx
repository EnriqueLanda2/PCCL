/* ───────────────────────────────────────────
   Layout · Footer
   Pie de página de la landing.
   ─────────────────────────────────────────── */

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ padding: '56px clamp(20px, 4vw, 56px) 36px', color: 'var(--ink-soft)', fontSize: '0.8438rem', borderTop: '1px solid var(--neutral-100)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <Logo />
          </div>
          <p style={{ color: 'var(--ink-muted)', maxWidth: '36ch', lineHeight: 1.65 }}>
            Una plataforma para gestionar cursos, evaluaciones y constancias — pensada para grupos pequeños y medianos.
          </p>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-muted)', fontWeight: 600, marginBottom: '0.875rem' }}>
            Producto
          </h4>
          {['Catálogo', 'Para instituciones', 'Precios', 'Cambios'].map((label) => (
            <Link key={label} href="#" style={{ display: 'block', padding: '4px 0', color: 'var(--ink-soft)', transition: 'color 160ms' }}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-muted)', fontWeight: 600, marginBottom: '0.875rem' }}>
            Empresa
          </h4>
          {['Acerca', 'Carreras', 'Blog', 'Contacto'].map((label) => (
            <Link key={label} href="#" style={{ display: 'block', padding: '4px 0', color: 'var(--ink-soft)', transition: 'color 160ms' }}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-muted)', fontWeight: 600, marginBottom: '0.875rem' }}>
            Legal
          </h4>
          {['Privacidad', 'Términos', 'Verificar certificado'].map((label) => (
            <Link key={label} href="#" style={{ display: 'block', padding: '4px 0', color: 'var(--ink-soft)', transition: 'color 160ms' }}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2rem', borderTop: '1px solid var(--neutral-100)', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ color: 'var(--ink-muted)' }}>© {year} koodisoft.com · Hecho con paciencia.</span>
        <span style={{ color: 'var(--neutral-400)' }}>v1.0</span>
      </div>
    </footer>
  );
}

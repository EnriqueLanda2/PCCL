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
    <footer style={{ padding: '56px clamp(20px, 4vw, 56px) 36px', color: 'var(--ink-soft)', fontSize: '13.5px', borderTop: '1px solid var(--neutral-100)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Logo />
          </div>
          <p style={{ color: 'var(--ink-muted)', maxWidth: '36ch', lineHeight: 1.65 }}>
            Una plataforma para gestionar cursos, evaluaciones y constancias — pensada para grupos pequeños y medianos.
          </p>
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-muted)', fontWeight: 600, marginBottom: '14px' }}>
            Producto
          </h4>
          {['Catálogo', 'Para instituciones', 'Precios', 'Cambios'].map((label) => (
            <Link key={label} href="#" style={{ display: 'block', padding: '4px 0', color: 'var(--ink-soft)', transition: 'color 160ms' }}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-muted)', fontWeight: 600, marginBottom: '14px' }}>
            Empresa
          </h4>
          {['Acerca', 'Carreras', 'Blog', 'Contacto'].map((label) => (
            <Link key={label} href="#" style={{ display: 'block', padding: '4px 0', color: 'var(--ink-soft)', transition: 'color 160ms' }}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-muted)', fontWeight: 600, marginBottom: '14px' }}>
            Legal
          </h4>
          {['Privacidad', 'Términos', 'Verificar certificado'].map((label) => (
            <Link key={label} href="#" style={{ display: 'block', padding: '4px 0', color: 'var(--ink-soft)', transition: 'color 160ms' }}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '32px', borderTop: '1px solid var(--neutral-100)', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ color: 'var(--ink-muted)' }}>© {year} Lumen.edu · Hecho con paciencia.</span>
        <span style={{ color: 'var(--neutral-400)' }}>v1.0</span>
      </div>
    </footer>
  );
}

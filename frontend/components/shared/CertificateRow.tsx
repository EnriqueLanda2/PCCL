/* ───────────────────────────────────────────
   Shared · CertificateRow
   Fila de certificado con sello, título y fecha.
   ─────────────────────────────────────────── */

import React from 'react';
import Link from 'next/link';
import { Badge, statusToBadgeVariant } from '@/components/ui/Badge';
import type { Certificate } from '@/types/certificate';

interface CertificateRowProps {
  certificate: Certificate;
  href?: string;
  onDownload?: (id: string) => void;
}

export function CertificateRow({ certificate, href, onDownload }: CertificateRowProps) {
  const badgeVariant = statusToBadgeVariant(certificate.status);
  const statusLabel = {
    valid: 'Válido',
    expired: 'Expirado',
    revoked: 'Revocado',
  }[certificate.status];

  const issued = new Date(certificate.issuedAt).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const inner = (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '16px',
      background: 'var(--blue-50)',
      borderRadius: '12px',
      cursor: href ? 'pointer' : 'default',
      transition: 'background 160ms',
    }}>
      {/* Sello */}
      <div style={{
        width: '56px', height: '44px', borderRadius: '8px', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--panel)', fontFamily: 'var(--font-serif)', fontSize: '22px',
      }}>
        ★
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '14.5px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {certificate.courseTitle ?? certificate.certificateNumber}
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '2px' }}>
          Emitido · {issued}
        </div>
      </div>

      {/* Badge de estado */}
      <Badge variant={badgeVariant}>{statusLabel}</Badge>

      {/* Botón descarga */}
      {onDownload && (
        <button
          onClick={(e) => { e.preventDefault(); onDownload(certificate.id); }}
          style={{
            width: '36px', height: '36px', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: '1px solid var(--neutral-200)',
            color: 'var(--ink-soft)', cursor: 'pointer', transition: 'background 160ms',
          }}
          title="Descargar constancia"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );

  return href
    ? <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>{inner}</Link>
    : inner;
}

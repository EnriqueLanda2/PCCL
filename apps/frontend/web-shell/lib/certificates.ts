/**
 * certificates.ts — helpers compartidos de certificación
 * Usados por la vista Certificaciones y la página pública /validate/[folio].
 */

import type { Certificate } from './types';
import type { CertificateCardData } from '@/app/components/ui/CertificateHoloCard';

/** Código de verificación determinista a partir del folio (formato 7F3A-9C2E-4B15) */
export function verificationCodeFor(folio: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < folio.length; i++) {
    h ^= folio.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (h >>> 0).toString(16).toUpperCase().padStart(8, '0') +
              (Math.imul(h, 0x9e3779b9) >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

/** Datos de muestra cuando el certification-service no responde */
export const DEMO_CERTIFICATES: CertificateCardData[] = [
  { folio: 'RB-2026-0312', studentName: 'Sofía Ramírez', courseTitle: 'APIs REST con Node.js y Express', issuedAt: '2026-06-12', status: 'valid',   verificationCode: '7F3A-9C2E-4B15', instructorName: 'Ricardo Salazar' },
  { folio: 'RB-2026-0313', studentName: 'Mariana López', courseTitle: 'APIs REST con Node.js y Express', issuedAt: null,         status: 'pending', verificationCode: verificationCodeFor('RB-2026-0313'), instructorName: 'Ricardo Salazar' },
  { folio: 'RB-2026-0314', studentName: 'Beto Sánchez',  courseTitle: 'Bases de datos con PostgreSQL',   issuedAt: null,         status: 'pending', verificationCode: verificationCodeFor('RB-2026-0314'), instructorName: 'Ricardo Salazar' },
  { folio: 'RB-2026-0298', studentName: 'Roberto Díaz',  courseTitle: 'Bases de datos con PostgreSQL',   issuedAt: '2026-05-28', status: 'valid',   verificationCode: verificationCodeFor('RB-2026-0298'), instructorName: 'Ricardo Salazar' },
  { folio: 'RB-2026-0285', studentName: 'Lucía Ortega',  courseTitle: 'APIs REST con Node.js y Express', issuedAt: '2026-05-15', status: 'valid',   verificationCode: verificationCodeFor('RB-2026-0285'), instructorName: 'Ricardo Salazar' },
];

/** Mapea el modelo del certification-service al modelo de la tarjeta */
export function toCardData(cert: Certificate): CertificateCardData {
  return {
    folio:            cert.certificateNumber,
    studentName:      cert.inscription?.user?.fullName ?? 'Estudiante',
    courseTitle:      cert.inscription?.course?.title ?? 'Curso completado',
    issuedAt:         cert.issuedAt,
    status:           cert.status,
    verificationCode: verificationCodeFor(cert.certificateNumber),
    instructorName:   cert.inscription?.course?.instructorName ?? 'Ricardo Salazar',
  };
}

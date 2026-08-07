/**
 * certificates.ts — helpers compartidos de certificación
 * Usados por la vista Certificaciones y la página pública /validate/[folio].
 */

import type { Certificate, PublicCertificate } from './types';
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

/* Aquí vivía DEMO_CERTIFICATES, un arreglo de certificados de muestra que se
   usaba como respaldo cuando la lista real venía vacía. Se eliminó a
   propósito: como la lista ya llega acotada al usuario, un alumno sin
   certificados veía los nombres y cursos del arreglo de ejemplo como si
   fueran registros reales de otras personas. Una lista vacía se muestra
   vacía. */

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

/** Mapea la proyección pública de /certificates/verify/:folio a la tarjeta */
export function publicToCardData(cert: PublicCertificate): CertificateCardData {
  return {
    folio:            cert.certificateNumber,
    studentName:      cert.studentName ?? 'Estudiante',
    courseTitle:      cert.courseTitle ?? 'Curso completado',
    issuedAt:         cert.issuedAt,
    status:           cert.status,
    verificationCode: verificationCodeFor(cert.certificateNumber),
    instructorName:   'Ricardo Salazar',
  };
}

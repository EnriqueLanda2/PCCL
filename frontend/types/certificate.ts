/* ───────────────────────────────────────────
   Types · Certificate & Progress
   ─────────────────────────────────────────── */

export type CertificateStatus = 'valid' | 'expired' | 'revoked';

export interface Certificate {
  id: string;
  certificateNumber: string;
  status: CertificateStatus;
  issuedAt: string;
  expiresAt: string | null;
  courseTitle?: string;
  inscriptionId?: string;
  inscription?: import('./course').Inscription;
}

export interface Progress {
  id: string;
  progressPercentage: number;
  lessonsCompleted: number;
  evaluationsCompleted: number;
  averageScore: number;
  lastAccessAt: string | null;
  inscriptionId?: string;
  inscription?: import('./course').Inscription;
  courseTitle?: string;
  coverVariant?: number;
  coverIcon?: string;
}

export interface AuditLog {
  id: string;
  method: string;
  endpoint: string;
  actorScope: string;
  actorIdentifier: string | null;
  statusCode: number | null;
  description: string;
  createdAt: string;
}

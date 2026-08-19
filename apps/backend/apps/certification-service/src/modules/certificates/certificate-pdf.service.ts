import { Injectable } from '@nestjs/common';
import { S3StorageService } from '@app/common';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';

export interface CertificatePdfData {
  studentName: string;
  courseTitle: string;
  instructorName: string;
  certificateNumber: string;
  status: 'valid' | 'expired' | 'revoked';
  issuedAt: Date;
  expiresAt: Date | null;
  /** URL pública de /validate/[folio] — el QR apunta ahí, no a un endpoint interno. */
  verifyUrl: string;
}

/* Paleta tomada 1:1 de globals.css / CertificateHoloCard.tsx — el PDF tiene
   que verse como la misma tarjeta que ya se muestra en Certificaciones y en
   /validate/[folio], no como un documento aparte. */
const COLOR = {
  green400: '#4FC276',
  green500: '#62BD81',
  green600: '#4FA870',
  green700: '#3D8659',
  green900: '#0F4724',
  ink: '#17324D',
  inkMuted: '#97A3B2',
  white: '#FFFFFF',
};

const STATUS_LABEL: Record<CertificatePdfData['status'], string> = {
  valid: 'Emitido',
  expired: 'Expirado',
  revoked: 'Revocado',
};

/* Mismo mapeo que STATUS_META en CertificateHoloCard.tsx. */
const STATUS_BADGE: Record<CertificatePdfData['status'], { bg: string; fg: string }> = {
  valid: { bg: '#E4F4E9', fg: '#3D8659' },
  expired: { bg: '#FFF1ED', fg: '#BF2600' },
  revoked: { bg: '#FFF1ED', fg: '#A32000' },
};

/** Mismo hash (FNV-1a variant) que `verificationCodeFor` en
    apps/frontend/web-shell/lib/certificates.ts — determinista a partir del
    folio, así el código impreso en el PDF coincide siempre con el que
    muestra la app (tarjeta de Certificaciones, /validate/[folio]). */
function verificationCodeFor(folio: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < folio.length; i++) {
    h ^= folio.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex =
    (h >>> 0).toString(16).toUpperCase().padStart(8, '0') +
    (Math.imul(h, 0x9e3779b9) >>> 0).toString(16).toUpperCase().padStart(8, '0');
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
}

/** Arma el PDF de la constancia (ambas caras de la tarjeta, lado a lado) y lo
    sube a S3. Un solo lugar para las dos cosas porque nadie más
    necesita el buffer crudo: `issue()`/`downloadPdf()` solo quieren la URL
    final para guardarla en `pdfUrl`. */
@Injectable()
export class CertificatePdfService {
  constructor(private readonly storage: S3StorageService) {}

  async generateAndUpload(data: CertificatePdfData): Promise<string> {
    const buffer = await this.render(data);
    return this.uploadPdf(buffer, data.certificateNumber);
  }

  private async render(data: CertificatePdfData): Promise<Buffer> {
    const verificationCode = verificationCodeFor(data.certificateNumber);
    const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, {
      margin: 0,
      width: 300,
      color: { dark: COLOR.green900, light: '#FFFFFF' },
    });
    const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const { width: pageWidth, height: pageHeight } = doc.page;
      /* aspect-[10/8] de la tarjeta original. */
      const cardW = 372;
      const cardH = cardW * 0.8;
      const gap = 28;
      const totalW = cardW * 2 + gap;
      const left = (pageWidth - totalW) / 2;
      const top = (pageHeight - cardH) / 2;

      doc.rect(0, 0, pageWidth, pageHeight).fill('#F7FBF4');

      this.drawVerificationCard(doc, left, top, cardW, cardH, data, verificationCode, qrBuffer);
      this.drawCertificateCard(doc, left + cardW + gap, top, cardW, cardH, data);

      doc.end();
    });
  }

  /** Ícono del sello RUMBO: cuadrado con esquinas redondeadas + trazo de
      "trayectoria" — mismo path que <RumboSeal> en CertificateHoloCard.tsx,
      simplificado a lo que pdfkit puede trazar con line/stroke. */
  private drawSeal(doc: PDFKit.PDFDocument, x: number, y: number, size: number, fg = COLOR.white) {
    doc.roundedRect(x, y, size, size, size * 0.22).fill(COLOR.green600);
    const p = size / 24; // escala del path original (viewBox 24x24)
    doc
      .save()
      .translate(x, y)
      .lineWidth(Math.max(1.4, size * 0.09))
      .moveTo(5 * p, 17 * p)
      .lineTo(11 * p, 11 * p)
      .lineTo(15 * p, 14 * p)
      .lineTo(19 * p, 7 * p)
      .stroke(fg)
      .circle(19 * p, 7 * p, 1.6 * p)
      .fill(fg)
      .restore();
  }

  /** Reverso — franja verde oscura con folio/datos + QR. Refleja la tarjeta
      "VERIFICACIÓN OFICIAL" de CertificateHoloCard.tsx. */
  private drawVerificationCard(
    doc: PDFKit.PDFDocument,
    x: number, y: number, w: number, h: number,
    data: CertificatePdfData,
    verificationCode: string,
    qrBuffer: Buffer,
  ) {
    const r = 18;
    doc.save();
    doc.roundedRect(x, y, w, h, r).clip();
    const gradient = doc.linearGradient(x, y, x + w, y + h);
    gradient.stop(0, '#0F4724').stop(0.55, '#176C38').stop(1, '#1E8B48');
    doc.rect(x, y, w, h).fill(gradient);
    doc.restore();
    doc.roundedRect(x, y, w, h, r).lineWidth(2).stroke(COLOR.green500);

    const pad = 26;
    let cx = x + pad;
    let cy = y + pad;

    this.drawSeal(doc, cx, cy - 2, 22);
    doc.font('Helvetica-Bold').fontSize(12).fillColor(COLOR.white)
      .text('RUMBO', cx + 30, cy + 2);
    doc.font('Helvetica').fontSize(6.5).fillColor('#FFFFFFB3')
      .text('VERIFICACIÓN OFICIAL', x + w - pad - 140, cy + 4, { width: 140, align: 'right', characterSpacing: 1 });

    cy += 46;
    const rows: [string, string][] = [
      ['FOLIO', data.certificateNumber],
      ['ESTUDIANTE', data.studentName],
      ['CURSO', data.courseTitle],
      ['EMISIÓN', formatDate(data.issuedAt)],
      ['ESTADO', STATUS_LABEL[data.status]],
      ['CÓDIGO', verificationCode],
    ];
    const dataColW = w - pad * 2 - 118;
    for (const [label, value] of rows) {
      doc.font('Helvetica-Bold').fontSize(6.5).fillColor('#FFFFFF8C')
        .text(label, cx, cy, { characterSpacing: 1 });
      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(COLOR.white)
        .text(value, cx, cy + 10, { width: dataColW, ellipsis: true });
      cy += 30;
    }

    const qrSize = 100;
    const qrX = x + w - pad - qrSize;
    const qrY = y + (h - qrSize) / 2 - 10;
    doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 10).fill(COLOR.white);
    doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
    doc.font('Helvetica').fontSize(6.5).fillColor('#FFFFFFBF')
      .text('Escanea para validar este certificado en nuestra página', qrX - 20, qrY + qrSize + 14, {
        width: qrSize + 40, align: 'center',
      });
  }

  /** Frente — certificado propiamente dicho, fondo claro con borde verde.
      Refleja la tarjeta "CERTIFICADO DE FINALIZACIÓN" de CertificateHoloCard.tsx. */
  private drawCertificateCard(
    doc: PDFKit.PDFDocument,
    x: number, y: number, w: number, h: number,
    data: CertificatePdfData,
  ) {
    const r = 18;
    doc.roundedRect(x, y, w, h, r).fill(COLOR.white);
    doc.roundedRect(x, y, w, h, r).lineWidth(2).stroke(COLOR.green500);

    const pad = 26;

    /* Badge de estado, esquina superior derecha. */
    const badge = STATUS_LABEL[data.status];
    const badgeColor = STATUS_BADGE[data.status];
    doc.font('Helvetica-Bold').fontSize(7.5);
    const badgeW = doc.widthOfString(badge) + 20;
    doc.roundedRect(x + w - pad - badgeW, y + 18, badgeW, 18, 9).fill(badgeColor.bg);
    doc.fillColor(badgeColor.fg).text(badge, x + w - pad - badgeW, y + 23, { width: badgeW, align: 'center' });

    /* Marca. */
    const sealSize = 24;
    const brandY = y + 24;
    doc.font('Helvetica-Bold').fontSize(15);
    const brandTextW = doc.widthOfString('RUMBO');
    const brandBlockW = sealSize + 8 + brandTextW;
    this.drawSeal(doc, x + (w - brandBlockW) / 2, brandY, sealSize);
    doc.fillColor(COLOR.ink).text('RUMBO', x + (w - brandBlockW) / 2 + sealSize + 8, brandY + 4, { characterSpacing: 1 });
    doc.font('Helvetica-Bold').fontSize(6).fillColor(COLOR.inkMuted)
      .text('PLATAFORMA DE CURSOS', x, brandY + sealSize + 8, { width: w, align: 'center', characterSpacing: 2 });

    /* Cuerpo. */
    let cy = brandY + sealSize + 34;
    doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR.ink)
      .text('CERTIFICADO DE FINALIZACIÓN', x, cy, { width: w, align: 'center', characterSpacing: 2 });
    cy += 20;
    doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.inkMuted)
      .text('Se otorga el presente a', x, cy, { width: w, align: 'center' });
    cy += 16;
    doc.font('Helvetica-Bold').fontSize(22).fillColor(COLOR.ink)
      .text(data.studentName, x + 16, cy, { width: w - 32, align: 'center' });
    cy += 30;
    doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.inkMuted)
      .text('por completar satisfactoriamente el curso', x, cy, { width: w, align: 'center' });
    cy += 15;
    doc.font('Helvetica-Bold').fontSize(11).fillColor(COLOR.green600)
      .text(data.courseTitle, x + 16, cy, { width: w - 32, align: 'center' });

    /* Pie: fecha · verificado · instructor. */
    const footY = y + h - pad - 44;
    doc.font('Helvetica').fontSize(6.5).fillColor(COLOR.inkMuted)
      .text('Fecha de emisión', x + pad, footY);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLOR.ink)
      .text(formatDate(data.issuedAt), x + pad, footY + 10);

    const sealCx = x + w / 2;
    const sealCy = footY + 14;
    doc.circle(sealCx, sealCy, 15).lineWidth(1.6).stroke(COLOR.green500);
    doc
      .save().lineWidth(1.8)
      .moveTo(sealCx - 6, sealCy)
      .lineTo(sealCx - 1, sealCy + 5)
      .lineTo(sealCx + 7, sealCy - 6)
      .stroke(COLOR.green600)
      .restore();
    doc.font('Helvetica-Bold').fontSize(4.2).fillColor(COLOR.green600)
      .text('VERIFICADO', sealCx - 20, sealCy + 17, { width: 40, align: 'center', characterSpacing: 0.5 });

    const instructorW = 130;
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor(COLOR.ink)
      .text(data.instructorName, x + w - pad - instructorW, footY + 10, { width: instructorW, align: 'right', ellipsis: true });
    doc.moveTo(x + w - pad - instructorW, footY + 8).lineTo(x + w - pad, footY + 8).lineWidth(1).stroke(COLOR.ink);
    doc.font('Helvetica').fontSize(6.5).fillColor(COLOR.inkMuted)
      .text('Instructor', x + w - pad - instructorW, footY - 2, { width: instructorW, align: 'right' });

    /* Folio. */
    const folioY = y + h - pad + 2;
    doc.moveTo(x + pad, folioY - 8).lineTo(x + w - pad, folioY - 8).lineWidth(0.75).dash(2, { space: 2 }).stroke('#DCE7D4');
    doc.undash();
    doc.font('Helvetica').fontSize(6.5).fillColor(COLOR.inkMuted)
      .text(`Folio ${data.certificateNumber} · Verificación ${verificationCodeFor(data.certificateNumber)}`, x, folioY, {
        width: w, align: 'center',
      });
  }

  private uploadPdf(buffer: Buffer, publicId: string): Promise<string> {
    return this.storage.uploadPublic(
      buffer,
      `${publicId}.pdf`,
      'application/pdf',
      'certificate',
      { publicId, prefix: 'certificates', cacheControl: 'public, max-age=3600' },
    );
  }
}

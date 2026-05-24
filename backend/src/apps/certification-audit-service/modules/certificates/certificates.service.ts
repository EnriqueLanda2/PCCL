import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(inscriptionId: string, actor: string) {
    const insc = await this.prisma.inscription.findUnique({
      where: { id: inscriptionId },
    });
    if (!insc) throw new NotFoundException('Inscripcion no encontrada');

    if (insc.status !== 'completed') {
      throw new BadRequestException('Curso no completado');
    }

    const existing = await this.prisma.certificate.findFirst({
      where: { inscriptionId },
    });
    if (existing) throw new BadRequestException('Certificado ya existe');

    const now = new Date();
    const expiry = new Date(now);
    expiry.setFullYear(expiry.getFullYear() + 2);

    const certNum = `CERT-${inscriptionId.slice(0, 8).toUpperCase()}-${Date.now()}`;
    const cert = await this.prisma.certificate.create({
      data: {
        inscriptionId,
        certificateNumber: certNum,
        issuedAt: now,
        expiresAt: expiry,
        createdBy: actor,
        updatedBy: actor,
      },
    });
    return this.findOne(cert.id);
  }

  async findOne(id: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { id },
      include: { inscription: true },
    });
    if (!cert) throw new NotFoundException('Certificado no encontrado');
    return cert;
  }

  findAll() {
    return this.prisma.certificate.findMany({
      include: { inscription: true },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async downloadPdf(id: string) {
    const cert = await this.findOne(id);
    if (!cert.pdfUrl) throw new NotFoundException('PDF no generado');
    return { url: cert.pdfUrl };
  }
}



import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LEARNING_PATTERNS } from '@app/contracts';
import { LEARNING_CLIENT } from '@app/messaging';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(LEARNING_CLIENT) private readonly learningClient: ClientProxy,
  ) {}

  async generate(inscriptionId: string, actor: string) {
    const insc = await firstValueFrom<{ status: string } | null>(
      this.learningClient.send(LEARNING_PATTERNS.INSCRIPTION_FIND_ONE, {
        id: inscriptionId,
      }),
    ).catch(() => null);

    if (!insc) throw new NotFoundException('Inscripcion no encontrada');
    if (insc.status !== 'completed')
      throw new BadRequestException('Curso no completado');

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
    const cert = await this.prisma.certificate.findUnique({ where: { id } });
    if (!cert) throw new NotFoundException('Certificado no encontrado');
    return cert;
  }

  findAll() {
    return this.prisma.certificate.findMany({ orderBy: { issuedAt: 'desc' } });
  }

  async downloadPdf(id: string) {
    const cert = await this.findOne(id);
    if (!cert.pdfUrl) throw new NotFoundException('PDF no generado');
    return { url: cert.pdfUrl };
  }
}

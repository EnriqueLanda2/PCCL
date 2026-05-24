import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async issue(courseId: string, studentId: string, actor: string) {
    const inscription = await this.prisma.inscription.findFirst({ where: { courseId, userId: studentId } });
    if (!inscription) throw new NotFoundException('Inscription not found for student/course');
    const cert = await this.prisma.certificate.create({
      data: {
        inscriptionId: inscription.id,
        certificateNumber: `CERT-${Date.now()}`,
        issuedAt: new Date(),
        createdBy: actor,
        updatedBy: actor,
      },
    });
    return cert;
  }

  async findOne(id: string) {
    const c = await this.prisma.certificate.findUnique({ where: { id } });
    if (!c) throw new NotFoundException('Certificate not found');
    return c;
  }
}

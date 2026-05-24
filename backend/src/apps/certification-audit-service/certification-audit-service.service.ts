import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CertificationAuditServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  health() {
    return {
      service: 'certification-audit-service',
      status: 'ok',
      port: this.config.get<number>('PORT', 4003),
    };
  }

  async summary() {
    const [certificates, auditLogs] = await Promise.all([
      this.prisma.certificate.count(),
      this.prisma.auditLog.count(),
    ]);

    return {
      certificates,
      auditLogs,
    };
  }
}

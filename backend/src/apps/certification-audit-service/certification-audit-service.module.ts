import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuditModule } from './modules/audit/audit.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { CertificationAuditServiceController } from './certification-audit-service.controller';
import { CertificationAuditServiceService } from './certification-audit-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CertificatesModule,
    AuditModule,
  ],
  controllers: [CertificationAuditServiceController],
  providers: [CertificationAuditServiceService],
})
export class CertificationAuditServiceModule {}
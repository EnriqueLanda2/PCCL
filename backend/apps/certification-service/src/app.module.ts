import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { AuditModule } from './modules/audit/audit.module';
import { MessagingModule } from '@app/messaging';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MessagingModule.forCertification(),
    CertificatesModule,
    AuditModule,
  ],
})
export class AppModule {}

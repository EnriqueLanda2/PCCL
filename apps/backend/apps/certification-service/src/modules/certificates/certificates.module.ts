import { Module } from '@nestjs/common';
import { S3StorageService } from '@app/common';
import { CertificatesService } from './certificates.service';
import { CertificatePdfService } from './certificate-pdf.service';
import { CertificatesController } from './certificates.controller';

@Module({
  providers: [CertificatesService, CertificatePdfService, S3StorageService],
  controllers: [CertificatesController],
})
export class CertificatesModule {}

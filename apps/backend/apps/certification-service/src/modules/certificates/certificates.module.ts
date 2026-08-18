import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatePdfService } from './certificate-pdf.service';
import { CertificatesController } from './certificates.controller';

@Module({ providers: [CertificatesService, CertificatePdfService], controllers: [CertificatesController] })
export class CertificatesModule {}

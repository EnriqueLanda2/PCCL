import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { CERTIFICATION_PATTERNS, DataScope, LEARNING_PATTERNS } from '@app/contracts';
import { CertificatesService } from './certificates.service';

@Controller()
export class CertificatesController {
  constructor(private readonly service: CertificatesService) {}

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_GENERATE)
  generate(@Payload() p: { inscriptionId: string; actor: string }) {
    return this.service.generate(p.inscriptionId, p.actor);
  }

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_ELIGIBILITY)
  eligibility(@Payload() p: { inscriptionId: string }) {
    return this.service.eligibility(p.inscriptionId);
  }

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_FIND_ALL)
  findAll(@Payload() p: { scope?: DataScope }) { return this.service.findAll(p?.scope); }

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_FIND_ONE)
  findOne(@Payload() p: { id: string }) { return this.service.findOne(p.id); }

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_VERIFY_FOLIO)
  verifyByFolio(@Payload() p: { folio: string }) { return this.service.verifyByFolio(p.folio); }

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_DOWNLOAD_PDF)
  downloadPdf(@Payload() p: { id: string }) { return this.service.downloadPdf(p.id); }

  @EventPattern(LEARNING_PATTERNS.EVT_INSCRIPTION_COMPLETED)
  onInscriptionCompleted(@Payload() p: { inscriptionId: string }) {
    return this.service.generate(p.inscriptionId, 'system').catch(() => {});
  }
}

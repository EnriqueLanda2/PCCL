import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CERTIFICATION_PATTERNS, DataScope } from '@app/contracts';
import { CertificatesService } from './certificates.service';

@Controller()
export class CertificatesController {
  constructor(private readonly service: CertificatesService) {}

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

  /* ─── Solicitudes de certificado ─── */
  @MessagePattern(CERTIFICATION_PATTERNS.CERT_REQUEST_CREATE)
  requestCertificate(@Payload() p: { inscriptionId: string; actor: string }) {
    return this.service.requestCertificate(p.inscriptionId, p.actor);
  }

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_REQUEST_FIND_MINE)
  findMyRequest(@Payload() p: { inscriptionId: string }) {
    return this.service.findMyRequest(p.inscriptionId);
  }

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_REQUEST_FIND_PENDING)
  findPendingRequests(@Payload() p: { scope?: DataScope }) {
    return this.service.findPendingRequests(p?.scope);
  }

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_REQUEST_APPROVE)
  approveRequest(@Payload() p: { id: string; actor: string }) {
    return this.service.approveRequest(p.id, p.actor);
  }

  @MessagePattern(CERTIFICATION_PATTERNS.CERT_REQUEST_REJECT)
  rejectRequest(@Payload() p: { id: string; actor: string }) {
    return this.service.rejectRequest(p.id, p.actor);
  }
}

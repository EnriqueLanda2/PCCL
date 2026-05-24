import { Controller, Get } from '@nestjs/common';
import { CertificationAuditServiceService } from './certification-audit-service.service';

@Controller()
export class CertificationAuditServiceController {
  constructor(
    private readonly certificationAuditService: CertificationAuditServiceService,
  ) {}

  @Get('health')
  health() {
    return this.certificationAuditService.health();
  }

  @Get('summary')
  summary() {
    return this.certificationAuditService.summary();
  }
}
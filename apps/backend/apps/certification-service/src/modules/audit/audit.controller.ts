import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CERTIFICATION_PATTERNS } from '@app/contracts';
import { AuditService, CreateAuditLogInput } from './audit.service';

@Controller()
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @MessagePattern(CERTIFICATION_PATTERNS.AUDIT_LIST)
  list(@Payload() p: { limit: number }) {
    return this.service.list(p.limit ?? 100);
  }

  @EventPattern(CERTIFICATION_PATTERNS.AUDIT_REGISTER)
  register(@Payload() input: CreateAuditLogInput) {
    return this.service.register(input);
  }
}

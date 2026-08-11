import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { DataScope, LEARNING_PATTERNS, PAYMENT_PATTERNS, PaymentCompletedEvent } from '@app/contracts';
import { InscriptionsService } from './inscriptions.service';
import {
  CreateInscriptionDto,
  UpdateInscriptionDto,
} from './dtos/inscription.dto';

@Controller()
export class InscriptionsController {
  constructor(private readonly service: InscriptionsService) {}

  @MessagePattern(LEARNING_PATTERNS.INSCRIPTION_CREATE)
  create(@Payload() p: { dto: CreateInscriptionDto; actor: string }) {
    return this.service.create(p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.INSCRIPTION_FIND_ALL)
  findAll(@Payload() p: { scope?: DataScope }) {
    return this.service.findAll(p?.scope);
  }

  @MessagePattern(LEARNING_PATTERNS.INSCRIPTION_FIND_IDS_BY_SCOPE)
  findIdsByScope(@Payload() p: { scope?: DataScope }) {
    return this.service.findIdsByScope(p?.scope);
  }

  @MessagePattern(LEARNING_PATTERNS.INSCRIPTION_FIND_ONE)
  findOne(@Payload() p: { id: string }) {
    return this.service.findOne(p.id);
  }

  @MessagePattern(LEARNING_PATTERNS.INSCRIPTION_CERTIFICATE_ELIGIBILITY)
  certificateEligibility(@Payload() p: { id: string }) {
    return this.service.certificateEligibility(p.id);
  }

  @MessagePattern(LEARNING_PATTERNS.INSCRIPTION_UPDATE)
  update(
    @Payload() p: { id: string; dto: UpdateInscriptionDto; actor: string },
  ) {
    return this.service.update(p.id, p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.INSCRIPTION_DELETE)
  remove(@Payload() p: { id: string }) {
    return this.service.remove(p.id);
  }

  @MessagePattern(LEARNING_PATTERNS.INSCRIPTION_STATS_PUBLIC)
  completionRateStats() {
    return this.service.completionRateStats();
  }

  @EventPattern(PAYMENT_PATTERNS.EVT_PAYMENT_COMPLETED)
  onPaymentCompleted(@Payload() p: PaymentCompletedEvent) {
    return this.service
      .create({
        userId: p.userId,
        courseId: p.courseId,
        accessType: p.accessType,
        accessEndsAt: p.accessEndsAt,
      }, 'system')
      .catch(() => {});
  }
}

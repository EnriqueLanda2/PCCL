import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
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
  findAll() {
    return this.service.findAll();
  }

  @MessagePattern(LEARNING_PATTERNS.INSCRIPTION_FIND_ONE)
  findOne(@Payload() p: { id: string }) {
    return this.service.findOne(p.id);
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
}

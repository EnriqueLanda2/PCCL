import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { ProgressService } from './progress.service';

@Controller()
export class ProgressController {
  constructor(private readonly service: ProgressService) {}

  @MessagePattern(LEARNING_PATTERNS.PROGRESS_FIND_BY_INSCRIPTION)
  findByInscription(@Payload() p: { inscriptionId: string }) {
    return this.service.findByInscription(p.inscriptionId);
  }
}

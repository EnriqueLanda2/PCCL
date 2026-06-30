import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { CalificationsService } from './califications.service';
import { CreateCalificationDto } from './dtos/create-calification.dto';

@Controller()
export class CalificationsController {
  constructor(private readonly service: CalificationsService) {}

  @MessagePattern(LEARNING_PATTERNS.CALIFICATION_CREATE)
  create(@Payload() p: { dto: CreateCalificationDto; actor: string }) {
    return this.service.create(p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.CALIFICATION_FIND_ALL)
  findAll() { return this.service.findAll(); }

  @MessagePattern(LEARNING_PATTERNS.CALIFICATION_FIND_ONE)
  findOne(@Payload() p: { id: string }) { return this.service.findOne(p.id); }

  @MessagePattern(LEARNING_PATTERNS.CALIFICATION_DELETE)
  remove(@Payload() p: { id: string }) { return this.service.remove(p.id); }
}

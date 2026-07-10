import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { LiveSessionsService } from './live-sessions.service';
import { CreateLiveSessionDto } from './dtos/create-live-session.dto';
import { UpdateLiveSessionDto } from './dtos/update-live-session.dto';

@Controller()
export class LiveSessionsController {
  constructor(private readonly service: LiveSessionsService) {}

  @MessagePattern(LEARNING_PATTERNS.LIVE_SESSION_CREATE)
  create(@Payload() p: { dto: CreateLiveSessionDto; actor: string }) {
    return this.service.create(p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.LIVE_SESSION_FIND_ALL)
  findAll() { return this.service.findAll(); }

  @MessagePattern(LEARNING_PATTERNS.LIVE_SESSION_FIND_ONE)
  findOne(@Payload() p: { id: string }) { return this.service.findOne(p.id); }

  @MessagePattern(LEARNING_PATTERNS.LIVE_SESSION_UPDATE)
  update(@Payload() p: { id: string; dto: UpdateLiveSessionDto; actor: string }) {
    return this.service.update(p.id, p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.LIVE_SESSION_DELETE)
  remove(@Payload() p: { id: string }) { return this.service.remove(p.id); }

  @MessagePattern(LEARNING_PATTERNS.LIVE_SESSION_FIND_NEXT_PUBLIC)
  findNextPublic() { return this.service.findNextPublic(); }
}

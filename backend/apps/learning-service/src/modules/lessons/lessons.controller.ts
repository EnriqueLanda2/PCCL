import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';

@Controller()
export class LessonsController {
  constructor(private readonly service: LessonsService) {}

  @MessagePattern(LEARNING_PATTERNS.LESSON_CREATE)
  create(@Payload() p: { dto: CreateLessonDto; actor: string }) {
    return this.service.create(p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.LESSON_FIND_ALL)
  findAll() { return this.service.findAll(); }

  @MessagePattern(LEARNING_PATTERNS.LESSON_FIND_ONE)
  findOne(@Payload() p: { id: string }) { return this.service.findOne(p.id); }

  @MessagePattern(LEARNING_PATTERNS.LESSON_UPDATE)
  update(@Payload() p: { id: string; dto: UpdateLessonDto; actor: string }) {
    return this.service.update(p.id, p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.LESSON_DELETE)
  remove(@Payload() p: { id: string }) { return this.service.remove(p.id); }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';

@Controller()
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @MessagePattern(LEARNING_PATTERNS.NOTE_CREATE)
  create(@Payload() p: { dto: CreateNoteDto; actor: string }) {
    return this.service.create(p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.NOTE_FIND_BY_LESSON)
  findByLesson(@Payload() p: { lessonId: string }) {
    return this.service.findByLesson(p.lessonId);
  }

  @MessagePattern(LEARNING_PATTERNS.NOTE_UPDATE)
  update(@Payload() p: { id: string; dto: UpdateNoteDto; actor: string }) {
    return this.service.update(p.id, p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.NOTE_DELETE)
  remove(@Payload() p: { id: string; actor: string }) {
    return this.service.remove(p.id, p.actor);
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DataScope, LEARNING_PATTERNS } from '@app/contracts';
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
  findAll(@Payload() p: { scope?: DataScope }) { return this.service.findAll(p?.scope); }

  @MessagePattern(LEARNING_PATTERNS.LESSON_FIND_ONE)
  findOne(@Payload() p: { id: string }) { return this.service.findOne(p.id); }

  @MessagePattern(LEARNING_PATTERNS.LESSON_UPDATE)
  update(@Payload() p: { id: string; dto: UpdateLessonDto; actor: string }) {
    return this.service.update(p.id, p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.LESSON_DELETE)
  remove(@Payload() p: { id: string }) { return this.service.remove(p.id); }

  /* ─── Entregas de tareas ─── */

  @MessagePattern(LEARNING_PATTERNS.ASSIGNMENT_SUBMIT)
  submitAssignment(@Payload() p: {
    lessonId: string;
    userId: string;
    userEmail: string | null;
    fileUrl: string;
    fileName?: string | null;
    comment?: string | null;
  }) {
    return this.service.submitAssignment(p);
  }

  @MessagePattern(LEARNING_PATTERNS.ASSIGNMENT_FIND_MINE)
  findMyAssignmentSubmission(@Payload() p: { lessonId: string; userId: string }) {
    return this.service.findMyAssignmentSubmission(p.lessonId, p.userId);
  }

  @MessagePattern(LEARNING_PATTERNS.ASSIGNMENT_FIND_BY_LESSON)
  findAssignmentSubmissionsByLesson(@Payload() p: { lessonId: string; scope?: DataScope }) {
    return this.service.findAssignmentSubmissionsByLesson(p.lessonId, p.scope);
  }

  @MessagePattern(LEARNING_PATTERNS.ASSIGNMENT_GRADE)
  gradeAssignment(@Payload() p: { submissionId: string; score: number; feedback?: string | null; scope?: DataScope; actor: string }) {
    return this.service.gradeAssignment(p);
  }
}

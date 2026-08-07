import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { TasksService } from './tasks.service';

@Controller()
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @MessagePattern(LEARNING_PATTERNS.TASK_FIND_PENDING)
  findPending(@Payload() p: { userId: string; courseId?: string }) {
    return this.service.findPending(p.userId, p.courseId);
  }

  @MessagePattern(LEARNING_PATTERNS.LESSON_SET_COMPLETED)
  setLessonCompleted(
    @Payload() p: { userId: string; lessonId: string; done: boolean; actor: string },
  ) {
    return this.service.setLessonCompleted(p.userId, p.lessonId, p.done, p.actor);
  }
}

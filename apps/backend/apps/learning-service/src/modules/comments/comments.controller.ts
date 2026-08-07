import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { CommentsService } from './comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @MessagePattern(LEARNING_PATTERNS.COMMENT_FIND_BY_COURSE)
  findByCourse(@Payload() p: { courseId: string; viewerId: string }) {
    return this.service.findByCourse(p.courseId, p.viewerId);
  }

  @MessagePattern(LEARNING_PATTERNS.COMMENT_CREATE)
  create(
    @Payload() p: { courseId: string; userId: string; content: string; actor: string },
  ) {
    return this.service.create(p.courseId, p.userId, p.content, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.COMMENT_TOGGLE_LIKE)
  toggleLike(@Payload() p: { commentId: string; userId: string }) {
    return this.service.toggleLike(p.commentId, p.userId);
  }

  @MessagePattern(LEARNING_PATTERNS.COMMENT_DELETE)
  remove(@Payload() p: { commentId: string; userId: string }) {
    return this.service.remove(p.commentId, p.userId);
  }
}

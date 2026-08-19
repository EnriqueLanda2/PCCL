import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { GamificationService } from './gamification.service';

@Controller()
export class GamificationController {
  constructor(private readonly service: GamificationService) {}

  @MessagePattern(LEARNING_PATTERNS.GAMIFICATION_SUMMARY)
  summary(@Payload() p: { userId: string }) {
    return this.service.summary(p.userId);
  }

  @MessagePattern(LEARNING_PATTERNS.GAMIFICATION_LEADERBOARD)
  leaderboard(@Payload() p: { courseId?: string; limit?: number }) {
    return this.service.leaderboard({ courseId: p?.courseId, limit: p?.limit });
  }
}

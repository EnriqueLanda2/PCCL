import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { AlexaService } from './alexa.service';

@Controller()
export class AlexaController {
  constructor(private readonly service: AlexaService) {}

  @MessagePattern(LEARNING_PATTERNS.ALEXA_SCHEDULE_CLASS)
  scheduleClass(@Payload() p: { topic: string; date: string; time: string }) {
    return this.service.scheduleClass(p);
  }

  @MessagePattern(LEARNING_PATTERNS.ALEXA_GENERATE_TRIVIA)
  generateTrivia(@Payload() p: { topic: string; count: number }) {
    return this.service.generateTrivia(p);
  }

  @MessagePattern(LEARNING_PATTERNS.ALEXA_SAVE_TRIVIA_RESULT)
  saveTriviaResult(
    @Payload()
    p: {
      alexaUserId: string;
      topic: string;
      total: number;
      correct: number;
      score: number;
      answers: unknown[];
    },
  ) {
    return this.service.saveTriviaResult(p);
  }

  @MessagePattern(LEARNING_PATTERNS.ALEXA_GET_PROGRESS)
  getProgress(@Payload() p: { alexaUserId: string }) {
    return this.service.getProgress(p.alexaUserId);
  }

  @MessagePattern(LEARNING_PATTERNS.ALEXA_LIST_COURSES)
  listCourses() {
    return this.service.listCourseTopics();
  }
}

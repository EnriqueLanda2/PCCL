import { Controller, Get } from '@nestjs/common';
import { LearningServiceService } from './learning-service.service';

@Controller()
export class LearningServiceController {
  constructor(private readonly learningService: LearningServiceService) {}

  @Get('health')
  health() {
    return this.learningService.health();
  }

  @Get('summary')
  summary() {
    return this.learningService.summary();
  }
}
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dtos/create-evaluation.dto';
import { SubmitAttemptDto } from './dtos/submit-attempt.dto';

@Controller()
export class EvaluationsController {
  constructor(private readonly service: EvaluationsService) {}

  @MessagePattern(LEARNING_PATTERNS.EVALUATION_CREATE)
  create(@Payload() p: { dto: CreateEvaluationDto; actor: string }) {
    return this.service.create(p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.EVALUATION_FIND_ALL)
  findAll(@Payload() p: { courseId: string }) { return this.service.findByCourse(p.courseId); }

  @MessagePattern(LEARNING_PATTERNS.EVALUATION_FIND_ONE)
  findOne(@Payload() p: { id: string }) { return this.service.findOne(p.id); }

  @MessagePattern(LEARNING_PATTERNS.EVALUATION_SUBMIT_ATTEMPT)
  submit(@Payload() dto: SubmitAttemptDto) { return this.service.submitAttempt(dto); }
}

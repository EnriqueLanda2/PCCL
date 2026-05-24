import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto } from './dtos/create-evaluation.dto';
import { SubmitAttemptDto } from './dtos/submit-attempt.dto';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('evaluations')
@UseGuards(PermissionsGuard)
export class EvaluationsController {
  constructor(private readonly svc: EvaluationsService) {}

  @Post()
  @RequirePermission('evaluations:create')
  create(@Body() dto: CreateEvaluationDto) {
    return this.svc.create(dto, 'system');
  }

  @Get('course/:courseId')
  @RequirePermission('evaluations:read')
  findByCourse(@Param('courseId') courseId: string) {
    return this.svc.findByCourse(courseId);
  }

  @Get(':id')
  @RequirePermission('evaluations:read')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post(':id/attempts')
  @RequirePermission('evaluations:submit')
  submitAttempt(@Body() dto: SubmitAttemptDto) {
    return this.svc.submitAttempt(dto);
  }

  @Get(':id/attempts')
  @RequirePermission('evaluations:read')
  getAttempts(@Param('id') id: string) {
    return this.svc.getAttempts(id);
  }
}

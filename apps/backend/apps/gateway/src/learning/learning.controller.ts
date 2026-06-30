import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LEARNING_PATTERNS } from '@app/contracts';
import { LEARNING_CLIENT } from '@app/messaging';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/interfaces/request-user.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class LearningController {
  constructor(@Inject(LEARNING_CLIENT) private readonly client: ClientProxy) {}

  private actor(user: RequestUser | null) {
    return user?.email ?? 'anonymous';
  }

  /* ─── COURSES ─── */
  @Post('courses')
  createCourse(@Body() dto: any, @CurrentUser() u: RequestUser) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.COURSE_CREATE, { dto, actor: this.actor(u) }));
  }

  @Get('courses')
  findAllCourses() {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.COURSE_FIND_ALL, {}));
  }

  @Get('courses/:id')
  findOneCourse(@Param('id') id: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.COURSE_FIND_ONE, { id }));
  }

  @Patch('courses/:id')
  updateCourse(@Param('id') id: string, @Body() dto: any, @CurrentUser() u: RequestUser) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.COURSE_UPDATE, { id, dto, actor: this.actor(u) }));
  }

  @Patch('courses/:id/publish')
  publishCourse(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.COURSE_PUBLISH, { id, actor: this.actor(u) }));
  }

  @Delete('courses/:id')
  removeCourse(@Param('id') id: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.COURSE_DELETE, { id }));
  }

  /* ─── LESSONS ─── */
  @Post('lessons')
  createLesson(@Body() dto: any, @CurrentUser() u: RequestUser) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.LESSON_CREATE, { dto, actor: this.actor(u) }));
  }

  @Get('lessons')
  findAllLessons() {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.LESSON_FIND_ALL, {}));
  }

  @Get('lessons/:id')
  findOneLesson(@Param('id') id: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.LESSON_FIND_ONE, { id }));
  }

  @Patch('lessons/:id')
  updateLesson(@Param('id') id: string, @Body() dto: any, @CurrentUser() u: RequestUser) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.LESSON_UPDATE, { id, dto, actor: this.actor(u) }));
  }

  @Delete('lessons/:id')
  removeLesson(@Param('id') id: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.LESSON_DELETE, { id }));
  }

  /* ─── INSCRIPTIONS ─── */
  @Post('inscriptions')
  createInscription(@Body() dto: any, @CurrentUser() u: RequestUser) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.INSCRIPTION_CREATE, { dto, actor: this.actor(u) }));
  }

  @Get('inscriptions')
  findAllInscriptions() {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.INSCRIPTION_FIND_ALL, {}));
  }

  @Get('inscriptions/:id')
  findOneInscription(@Param('id') id: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.INSCRIPTION_FIND_ONE, { id }));
  }

  @Patch('inscriptions/:id')
  updateInscription(@Param('id') id: string, @Body() dto: any, @CurrentUser() u: RequestUser) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.INSCRIPTION_UPDATE, { id, dto, actor: this.actor(u) }));
  }

  @Delete('inscriptions/:id')
  removeInscription(@Param('id') id: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.INSCRIPTION_DELETE, { id }));
  }

  /* ─── PROGRESS ─── */
  @Get('progress/:inscriptionId')
  getProgress(@Param('inscriptionId') inscriptionId: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.PROGRESS_FIND_BY_INSCRIPTION, { inscriptionId }));
  }

  /* ─── CALIFICATIONS ─── */
  @Post('califications')
  createCalification(@Body() dto: any, @CurrentUser() u: RequestUser) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.CALIFICATION_CREATE, { dto, actor: this.actor(u) }));
  }

  @Get('califications')
  findAllCalifications() {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.CALIFICATION_FIND_ALL, {}));
  }

  @Get('califications/:id')
  findOneCalification(@Param('id') id: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.CALIFICATION_FIND_ONE, { id }));
  }

  @Delete('califications/:id')
  removeCalification(@Param('id') id: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.CALIFICATION_DELETE, { id }));
  }

  /* ─── EVALUATIONS ─── */
  @Post('evaluations')
  createEvaluation(@Body() dto: any, @CurrentUser() u: RequestUser) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.EVALUATION_CREATE, { dto, actor: this.actor(u) }));
  }

  @Get('evaluations')
  findAllEvaluations(@Query('courseId') courseId: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.EVALUATION_FIND_ALL, { courseId }));
  }

  @Get('evaluations/:id')
  findOneEvaluation(@Param('id') id: string) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.EVALUATION_FIND_ONE, { id }));
  }

  @Post('evaluations/:id/attempts')
  submitAttempt(@Param('id') id: string, @Body() dto: any) {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.EVALUATION_SUBMIT_ATTEMPT, { ...dto, evaluationId: id }));
  }
}

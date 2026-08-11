import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/interfaces/request-user.interface';
import { resolveScope } from '../auth/data-scope';

@Controller()
@UseGuards(JwtAuthGuard)
export class LearningController {
  constructor(@Inject(LEARNING_CLIENT) private readonly client: ClientProxy) {}

  private actor(user: RequestUser | null) {
    return user?.email ?? 'anonymous';
  }

  private canManageCourses(user: RequestUser | null) {
    const roles = user?.roles ?? [];
    return roles.includes('admin') || roles.includes('instructor') || roles.includes('profesor');
  }

  /* ─── COURSES ─── */
  @Public()
  @Get('courses/public')
  findPublishedCourses() {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_FIND_PUBLISHED, {}),
    );
  }

  @Post('courses')
  createCourse(@Body() dto: unknown, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_CREATE, {
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Get('courses')
  findAllCourses(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_FIND_ALL, {
        scope: resolveScope(u),
      }),
    );
  }

  @Get('courses/:id')
  findOneCourse(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_FIND_ONE, { id }),
    );
  }

  @Patch('courses/:id')
  updateCourse(
    @Param('id') id: string,
    @Body() dto: unknown,
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_UPDATE, {
        id,
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Patch('courses/:id/publish')
  publishCourse(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    if (!this.canManageCourses(u)) {
      throw new ForbiddenException('Solo admin o profesor pueden publicar cursos');
    }

    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_PUBLISH, {
        id,
        actor: this.actor(u),
      }),
    );
  }

	  @Delete('courses/:id')
	  removeCourse(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_DELETE, { id }),
    );
	  }

	  @Get('courses/:id/reviews')
	  findCourseReviews(@Param('id') id: string, @CurrentUser() u: RequestUser) {
	    return firstValueFrom(
	      this.client.send(LEARNING_PATTERNS.COURSE_REVIEW_FIND_BY_COURSE, {
	        courseId: id,
	        viewerId: u.sub,
	      }),
	    );
	  }

	  @Post('courses/:id/reviews')
	  upsertCourseReview(
	    @Param('id') id: string,
	    @Body() dto: { rating?: number; comment?: string | null },
	    @CurrentUser() u: RequestUser,
	  ) {
	    return firstValueFrom(
	      this.client.send(LEARNING_PATTERNS.COURSE_REVIEW_UPSERT, {
	        courseId: id,
	        userId: u.sub,
	        rating: Number(dto?.rating),
	        comment: dto?.comment ?? null,
	        actor: this.actor(u),
	      }),
	    );
	  }

	  @Get('courses/:id/certificate-eligibility')
	  courseCertificateEligibility(@Param('id') id: string, @CurrentUser() u: RequestUser) {
	    return firstValueFrom(
	      this.client.send(LEARNING_PATTERNS.COURSE_CERTIFICATE_ELIGIBILITY, {
	        courseId: id,
	        userId: u.sub,
	      }),
	    );
	  }

	  /* ─── LESSONS ─── */
  @Post('lessons')
  createLesson(@Body() dto: unknown, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LESSON_CREATE, {
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Get('lessons')
  findAllLessons(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LESSON_FIND_ALL, {
        scope: resolveScope(u),
      }),
    );
  }

  @Get('lessons/:id')
  findOneLesson(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LESSON_FIND_ONE, { id }),
    );
  }

  @Patch('lessons/:id')
  updateLesson(
    @Param('id') id: string,
    @Body() dto: unknown,
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LESSON_UPDATE, {
        id,
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Delete('lessons/:id')
  removeLesson(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LESSON_DELETE, { id }),
    );
  }

  /* ─── INSCRIPTIONS ─── */
  @Post('inscriptions')
  createInscription(@Body() dto: unknown, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.INSCRIPTION_CREATE, {
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Get('inscriptions')
  findAllInscriptions(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.INSCRIPTION_FIND_ALL, {
        scope: resolveScope(u),
      }),
    );
  }

  @Get('inscriptions/:id')
  findOneInscription(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.INSCRIPTION_FIND_ONE, { id }),
    );
  }

  @Patch('inscriptions/:id')
  updateInscription(
    @Param('id') id: string,
    @Body() dto: unknown,
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.INSCRIPTION_UPDATE, {
        id,
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Delete('inscriptions/:id')
  removeInscription(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.INSCRIPTION_DELETE, { id }),
    );
  }

  /* ─── PROGRESS ─── */
  @Get('progress')
  findAllProgress(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.PROGRESS_FIND_ALL, {
        scope: resolveScope(u),
      }),
    );
  }

  @Get('progress/:inscriptionId')
  getProgress(@Param('inscriptionId') inscriptionId: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.PROGRESS_FIND_BY_INSCRIPTION, {
        inscriptionId,
      }),
    );
  }

  /* ─── CALIFICATIONS ─── */
  @Post('califications')
  createCalification(@Body() dto: unknown, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.CALIFICATION_CREATE, {
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Get('califications')
  findAllCalifications() {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.CALIFICATION_FIND_ALL, {}),
    );
  }

  @Get('califications/:id')
  findOneCalification(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.CALIFICATION_FIND_ONE, { id }),
    );
  }

  @Delete('califications/:id')
  removeCalification(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.CALIFICATION_DELETE, { id }),
    );
  }

  /* ─── NOTES ─── */
  @Post('lessons/:lessonId/notes')
  createNote(
    @Param('lessonId') lessonId: string,
    @Body() dto: unknown,
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.NOTE_CREATE, {
        dto: { ...(dto as object), lessonId },
        actor: this.actor(u),
      }),
    );
  }

  @Get('lessons/:lessonId/notes')
  findNotesByLesson(@Param('lessonId') lessonId: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.NOTE_FIND_BY_LESSON, { lessonId }),
    );
  }

  @Patch('notes/:id')
  updateNote(
    @Param('id') id: string,
    @Body() dto: unknown,
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.NOTE_UPDATE, {
        id,
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Delete('notes/:id')
  removeNote(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.NOTE_DELETE, {
        id,
        actor: this.actor(u),
      }),
    );
  }

  /* ─── EVALUATIONS ─── */
  @Post('evaluations')
  createEvaluation(@Body() dto: unknown, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.EVALUATION_CREATE, {
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Get('evaluations')
  findAllEvaluations(@Query('courseId') courseId: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.EVALUATION_FIND_ALL, { courseId }),
    );
  }

  @Get('evaluations/:id')
  findOneEvaluation(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.EVALUATION_FIND_ONE, { id }),
    );
  }

  @Post('evaluations/:id/attempts')
  submitAttempt(@Param('id') id: string, @Body() dto: { answers?: unknown[] }, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.EVALUATION_SUBMIT_ATTEMPT, {
        ...dto,
        evaluationId: id,
        studentId: u.sub,
      }),
    );
  }

  /* ─── COMENTARIOS DE CURSO ───
     El autor sale del JWT; el cliente solo aporta el texto. */
  @Get('courses/:id/comments')
  findCourseComments(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COMMENT_FIND_BY_COURSE, {
        courseId: id,
        viewerId: u.sub,
      }),
    );
  }

  @Post('courses/:id/comments')
  createCourseComment(
    @Param('id') id: string,
    @Body() dto: { content?: string },
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COMMENT_CREATE, {
        courseId: id,
        userId: u.sub,
        content: dto?.content ?? '',
        actor: this.actor(u),
      }),
    );
  }

  @Post('comments/:id/like')
  toggleCommentLike(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COMMENT_TOGGLE_LIKE, {
        commentId: id,
        userId: u.sub,
      }),
    );
  }

  @Delete('comments/:id')
  removeComment(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COMMENT_DELETE, {
        commentId: id,
        userId: u.sub,
      }),
    );
  }

  /* ─── TAREAS PENDIENTES ───
     El userId sale siempre del JWT, nunca del cliente: así un alumno no puede
     pedir las tareas de otro pasando un id ajeno. */
  @Get('tasks/pending')
  findPendingTasks(
    @CurrentUser() u: RequestUser,
    @Query('courseId') courseId?: string,
  ) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.TASK_FIND_PENDING, {
        userId: u.sub,
        courseId,
      }),
    );
  }

  @Post('lessons/:id/completion')
  setLessonCompleted(
    @Param('id') id: string,
    @Body() dto: { done?: boolean },
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LESSON_SET_COMPLETED, {
        userId: u.sub,
        lessonId: id,
        done: dto?.done !== false,
        actor: this.actor(u),
      }),
    );
  }

  /* ─── LIVE SESSIONS ─── */
  @Public()
  @Get('live-sessions/public')
  findNextPublicLiveSession() {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LIVE_SESSION_FIND_NEXT_PUBLIC, {}),
    );
  }

  @Post('live-sessions')
  createLiveSession(@Body() dto: unknown, @CurrentUser() u: RequestUser) {
    if (!this.canManageCourses(u)) {
      throw new ForbiddenException('Solo admin o profesor pueden programar clases en vivo');
    }

    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LIVE_SESSION_CREATE, {
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Get('live-sessions')
  findAllLiveSessions(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LIVE_SESSION_FIND_ALL, {
        scope: resolveScope(u),
      }),
    );
  }

  @Get('live-sessions/:id')
  findOneLiveSession(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LIVE_SESSION_FIND_ONE, { id }),
    );
  }

  @Patch('live-sessions/:id')
  updateLiveSession(
    @Param('id') id: string,
    @Body() dto: unknown,
    @CurrentUser() u: RequestUser,
  ) {
    if (!this.canManageCourses(u)) {
      throw new ForbiddenException('Solo admin o profesor pueden modificar clases en vivo');
    }

    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LIVE_SESSION_UPDATE, {
        id,
        dto,
        actor: this.actor(u),
      }),
    );
  }

  @Delete('live-sessions/:id')
  removeLiveSession(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    if (!this.canManageCourses(u)) {
      throw new ForbiddenException('Solo admin o profesor pueden eliminar clases en vivo');
    }

    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LIVE_SESSION_DELETE, { id }),
    );
  }
}

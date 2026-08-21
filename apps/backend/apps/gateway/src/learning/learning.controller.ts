import {
  BadRequestException,
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
import { JaasService } from './jaas.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class LearningController {
  constructor(
    @Inject(LEARNING_CLIENT) private readonly client: ClientProxy,
    private readonly jaas: JaasService,
  ) {}

  private actor(user: RequestUser | null) {
    return user?.email ?? 'anonymous';
  }

  private canManageCourses(user: RequestUser | null) {
    const roles = user?.roles ?? [];
    return roles.includes('admin') || roles.includes('instructor') || roles.includes('profesor');
  }

  /** Admin o revisor — quien puede aprobar/rechazar un curso en cola. */
  private canModerateCourses(user: RequestUser | null) {
    const roles = user?.roles ?? [];
    return roles.includes('admin') || roles.includes('revisor');
  }

  /* ─── COURSES ─── */
  @Public()
  @Get('courses/public')
  findPublishedCourses() {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_FIND_PUBLISHED, {}),
    );
  }

  /* Detalle público con temario. Va aquí arriba a propósito: Nest resuelve por
     orden de declaración y 'courses/:id' se tragaría 'courses/public/...'. */
  @Public()
  @Get('courses/public/:id')
  findPublishedCourse(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_FIND_PUBLISHED_ONE, { id }),
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

  /* Va antes de 'courses/:id' a propósito, mismo motivo que 'courses/public':
     si no, Nest resuelve por orden de declaración y ':id' se tragaría
     'courses/favorites' tratando "favorites" como un id. */
  @Get('courses/favorites')
  findMyFavoriteCourseIds(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_FAVORITE_FIND_MINE, { userId: u.sub }),
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

  /* Solo admin — no instructor. Publicar sin pasar por revisión es la
     excepción, no el camino normal: un instructor manda su curso a revisión
     (ver más abajo) y es el revisor quien lo publica al aprobarlo. */
  @Patch('courses/:id/publish')
  publishCourse(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    if (!(u.roles ?? []).includes('admin')) {
      throw new ForbiddenException('Solo admin puede publicar un curso sin pasar por revisión');
    }

    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_PUBLISH, {
        id,
        actor: this.actor(u),
      }),
    );
  }

  @Patch('courses/:id/submit-review')
  submitCourseForReview(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    if (!this.canManageCourses(u)) {
      throw new ForbiddenException('Solo admin o instructor pueden enviar un curso a revisión');
    }
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_SUBMIT_FOR_MODERATION, {
        id,
        actor: this.actor(u),
      }),
    );
  }

  @Patch('courses/:id/review')
  moderateCourse(
    @Param('id') id: string,
    @Body() dto: { decision?: 'approved' | 'rejected'; note?: string | null },
    @CurrentUser() u: RequestUser,
  ) {
    if (!this.canModerateCourses(u)) {
      throw new ForbiddenException('Solo admin o revisor pueden aprobar o rechazar cursos');
    }
    if (dto?.decision !== 'approved' && dto?.decision !== 'rejected') {
      throw new BadRequestException('decision debe ser "approved" o "rejected"');
    }
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.COURSE_MODERATE, {
        id,
        decision: dto.decision,
        note: dto.note ?? null,
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

	  /* userId sale siempre del JWT: un alumno solo puede guardar/desguardar
	     cursos para sí mismo, nunca para otro. */
	  @Post('courses/:id/favorite')
	  setCourseFavorite(@Param('id') id: string, @Body() dto: { saved: boolean }, @CurrentUser() u: RequestUser) {
	    return firstValueFrom(
	      this.client.send(LEARNING_PATTERNS.COURSE_FAVORITE_TOGGLE, {
	        userId: u.sub,
	        courseId: id,
	        saved: Boolean(dto?.saved),
	        actor: this.actor(u),
	      }),
	    );
	  }

	  /* ─── FASES DEL CURSO ───
	     Agrupan lecciones y clases en vivo en pasos secuenciales del camino. */
	  @Get('courses/:id/phases')
	  findCoursePhases(@Param('id') id: string) {
	    return firstValueFrom(
	      this.client.send(LEARNING_PATTERNS.PHASE_FIND_BY_COURSE, { courseId: id }),
	    );
	  }

	  @Post('courses/:id/phases')
	  createCoursePhase(@Param('id') id: string, @Body() dto: { title?: string }, @CurrentUser() u: RequestUser) {
	    if (!this.canManageCourses(u)) {
	      throw new ForbiddenException('Solo admin o profesor pueden crear fases');
	    }
	    return firstValueFrom(
	      this.client.send(LEARNING_PATTERNS.PHASE_CREATE, {
	        courseId: id,
	        title: dto?.title ?? '',
	        actor: this.actor(u),
	      }),
	    );
	  }

	  @Patch('phases/:id')
	  updateCoursePhase(@Param('id') id: string, @Body() dto: { title?: string }, @CurrentUser() u: RequestUser) {
	    if (!this.canManageCourses(u)) {
	      throw new ForbiddenException('Solo admin o profesor pueden renombrar fases');
	    }
	    return firstValueFrom(
	      this.client.send(LEARNING_PATTERNS.PHASE_UPDATE, {
	        id,
	        title: dto?.title ?? '',
	        actor: this.actor(u),
	      }),
	    );
	  }

	  /* La lista completa en su nuevo orden — el servicio valida que coincida
	     con las fases reales del curso antes de reasignar los `order`. */
	  @Patch('courses/:id/phases/reorder')
	  reorderCoursePhases(@Param('id') id: string, @Body() dto: { orderedIds?: string[] }, @CurrentUser() u: RequestUser) {
	    if (!this.canManageCourses(u)) {
	      throw new ForbiddenException('Solo admin o profesor pueden reordenar fases');
	    }
	    return firstValueFrom(
	      this.client.send(LEARNING_PATTERNS.PHASE_REORDER, {
	        courseId: id,
	        orderedIds: dto?.orderedIds ?? [],
	        actor: this.actor(u),
	      }),
	    );
	  }

	  @Delete('phases/:id')
	  removeCoursePhase(@Param('id') id: string, @CurrentUser() u: RequestUser) {
	    if (!this.canManageCourses(u)) {
	      throw new ForbiddenException('Solo admin o profesor pueden eliminar fases');
	    }
	    return firstValueFrom(
	      this.client.send(LEARNING_PATTERNS.PHASE_DELETE, { id }),
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

  /* ─── ENTREGAS DE TAREAS (lección contentType 'assignment') ───
     El alumno entrega para sí mismo (userId sale del JWT); calificar exige
     admin o el instructor dueño del curso — la pertenencia la re-verifica el
     learning-service con el scope, no el cliente. */
  @Post('lessons/:id/assignment-submission')
  submitAssignment(
    @Param('id') id: string,
    @Body() dto: { fileUrl?: string; fileName?: string | null; comment?: string | null },
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.ASSIGNMENT_SUBMIT, {
        lessonId: id,
        userId: u.sub,
        userEmail: u.email ?? null,
        fileUrl: dto?.fileUrl ?? '',
        fileName: dto?.fileName ?? null,
        comment: dto?.comment ?? null,
      }),
    );
  }

  @Get('lessons/:id/assignment-submission/mine')
  findMyAssignmentSubmission(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.ASSIGNMENT_FIND_MINE, {
        lessonId: id,
        userId: u.sub,
      }),
    );
  }

  @Get('lessons/:id/assignment-submissions')
  findAssignmentSubmissions(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    if (!this.canManageCourses(u)) {
      throw new ForbiddenException('Solo admin o instructor pueden ver las entregas de una tarea');
    }
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.ASSIGNMENT_FIND_BY_LESSON, {
        lessonId: id,
        scope: resolveScope(u),
      }),
    );
  }

  @Patch('assignment-submissions/:id/grade')
  gradeAssignmentSubmission(
    @Param('id') id: string,
    @Body() dto: { score?: number; feedback?: string | null },
    @CurrentUser() u: RequestUser,
  ) {
    if (!this.canManageCourses(u)) {
      throw new ForbiddenException('Solo admin o instructor pueden calificar entregas');
    }
    if (typeof dto?.score !== 'number') {
      throw new BadRequestException('Falta la calificación (score numérico de 0 a 100)');
    }
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.ASSIGNMENT_GRADE, {
        submissionId: id,
        score: dto.score,
        feedback: dto?.feedback ?? null,
        scope: resolveScope(u),
        actor: this.actor(u),
      }),
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

  /* Cada quien ve solo sus propias notas — son apuntes personales de
     estudio, no un comentario público del curso (eso ya existe aparte,
     ver CommentsModule). */
  @Get('lessons/:lessonId/notes')
  findNotesByLesson(@Param('lessonId') lessonId: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.NOTE_FIND_BY_LESSON, { lessonId, actor: this.actor(u) }),
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

  /** Para el repaso de solo lectura: qué contestó el usuario la última vez,
      sin dejarlo volver a responder. */
  @Get('evaluations/:id/my-attempt')
  findMyAttempt(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.EVALUATION_FIND_MY_ATTEMPT, { evaluationId: id, studentId: u.sub }),
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

  /* Quién es moderador de la sala de Jitsi se decide acá, nunca lo elige el
     usuario: es moderador quien creó la clase, punto. Ver JaasService para
     el porqué del token. */
  @Get('live-sessions/:id/jitsi-token')
  async getJitsiToken(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    const session = await firstValueFrom<{ createdBy?: string | null } | null>(
      this.client.send(LEARNING_PATTERNS.LIVE_SESSION_FIND_ONE, { id }),
    );
    const isModerator = Boolean(session?.createdBy && session.createdBy === u.email);
    return { ...this.jaas.tokenFor(`Rumbo-${id}`, u, isModerator), isModerator };
  }

  /** El frontend llama esto al conectarse a la sala — recién ahí la clase
      pasa a "en vivo" de verdad (ver LiveSessionsService.start). */
  @Post('live-sessions/:id/start')
  startLiveSession(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.LIVE_SESSION_START, { id, actor: u.email }),
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

  /* ─── CHAT (Rumbo IA) ───
     userId sale siempre del JWT, nunca del cliente. */
  @Post('chat')
  sendChatMessage(@Body() dto: unknown, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.CHAT_SEND, {
        dto,
        userId: u.sub,
        roles: u.roles ?? [],
      }),
    );
  }

  @Get('chat/history')
  findChatHistory(@Query('conversationId') conversationId: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.CHAT_FIND_HISTORY, { userId: u.sub, conversationId }),
    );
  }

  @Delete('chat/history')
  clearChatHistory(@Query('conversationId') conversationId: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.CHAT_CLEAR_HISTORY, { userId: u.sub, conversationId }),
    );
  }

  @Get('chat/conversations')
  listChatConversations(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.CHAT_LIST_CONVERSATIONS, { userId: u.sub }),
    );
  }

  @Delete('chat/messages/:id')
  deleteChatMessagesFrom(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.CHAT_DELETE_FROM, { userId: u.sub, messageId: id }),
    );
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { InscriptionsModule } from './modules/inscriptions/inscriptions.module';
import { ProgressModule } from './modules/progress/progress.module';
import { CalificationsModule } from './modules/califications/califications.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { LiveSessionsModule } from './modules/live-sessions/live-sessions.module';
import { NotesModule } from './modules/notes/notes.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ChatModule } from './modules/chat/chat.module';
import { AlexaModule } from './modules/alexa/alexa.module';
import { MessagingModule } from '@app/messaging';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    MessagingModule.forLearning(),
    CoursesModule,
    LessonsModule,
    InscriptionsModule,
    ProgressModule,
    CalificationsModule,
    EvaluationsModule,
    LiveSessionsModule,
    NotesModule,
    TasksModule,
    CommentsModule,
    ChatModule,
    AlexaModule,
  ],
})
export class AppModule {}

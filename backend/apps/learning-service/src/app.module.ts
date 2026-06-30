import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { InscriptionsModule } from './modules/inscriptions/inscriptions.module';
import { ProgressModule } from './modules/progress/progress.module';
import { CalificationsModule } from './modules/califications/califications.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { MessagingModule } from '@app/messaging';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MessagingModule.forLearning(),
    CoursesModule,
    LessonsModule,
    InscriptionsModule,
    ProgressModule,
    CalificationsModule,
    EvaluationsModule,
  ],
})
export class AppModule {}

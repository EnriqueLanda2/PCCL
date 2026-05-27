import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CalificationsModule } from './modules/califications/califications.module';
import { CoursesModule } from './modules/courses/courses.module';
import { InscriptionsModule } from './modules/inscriptions/inscriptions.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { EvaluationsModule } from './modules/evaluations/evaluations.module';
import { ProgressModule } from './modules/progress/progress.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { LearningServiceController } from './learning-service.controller';
import { LearningServiceService } from './learning-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CoursesModule,
    LessonsModule,
    InscriptionsModule,
    EvaluationsModule,
    ProgressModule,
    CalificationsModule,
  ],
  controllers: [LearningServiceController],
  providers: [LearningServiceService],
})
export class LearningServiceModule {}
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LearningServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  health() {
    return {
      service: 'learning-service',
      status: 'ok',
      port: this.config.get<number>('PORT', 4002),
    };
  }

  async summary() {
    const [courses, lessons, publishedCourses] = await Promise.all([
      this.prisma.course.count(),
      this.prisma.lesson.count(),
      this.prisma.course.count({ where: { status: 'published' } }),
    ]);

    return {
      courses,
      lessons,
      publishedCourses,
      draftCourses: courses - publishedCourses,
    };
  }
}

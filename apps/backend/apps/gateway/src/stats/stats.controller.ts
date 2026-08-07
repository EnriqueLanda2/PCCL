import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IDENTITY_PATTERNS, LEARNING_PATTERNS } from '@app/contracts';
import { IDENTITY_CLIENT, LEARNING_CLIENT } from '@app/messaging';
import { Public } from '../auth/decorators/public.decorator';

/** Estadísticas públicas para el landing (estudiantes activos, cursos publicados, tasa de finalización). */
@Controller()
export class StatsController {
  constructor(
    @Inject(IDENTITY_CLIENT) private readonly identityClient: ClientProxy,
    @Inject(LEARNING_CLIENT) private readonly learningClient: ClientProxy,
  ) {}

  @Public()
  @Get('stats/public')
  async getPublicStats() {
    const [activeStudents, publishedCourses, completion] = await Promise.all([
      firstValueFrom<number>(
        this.identityClient.send(IDENTITY_PATTERNS.USER_COUNT_ACTIVE, {}),
      ),
      firstValueFrom<number>(
        this.learningClient.send(LEARNING_PATTERNS.COURSE_COUNT_PUBLISHED, {}),
      ),
      firstValueFrom<{ total: number; completed: number; rate: number }>(
        this.learningClient.send(
          LEARNING_PATTERNS.INSCRIPTION_STATS_PUBLIC,
          {},
        ),
      ),
    ]);

    return {
      activeStudents,
      publishedCourses,
      completionRate: completion.rate,
    };
  }
}

import { BadRequestException, Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { LEARNING_PATTERNS } from '@app/contracts';
import { LEARNING_CLIENT } from '@app/messaging';
import { AlexaApiKeyGuard } from './alexa-api-key.guard';

/**
 * Superficie pública que consume la Lambda de la skill de Alexa (ver
 * docs/alexa/). No lleva JwtAuthGuard porque Alexa nunca tiene un JWT de
 * PCCL — en su lugar, AlexaApiKeyGuard exige la clave compartida
 * ALEXA_API_KEY en el header `x-alexa-api-key`.
 *
 * Todo lo que pasa por aquí se resuelve contra datos reales de PCCL:
 * agendar crea una fila real en `live_sessions` (visible en la web), la
 * trivia la genera AIRumbo a partir de lecciones reales, y el progreso se
 * calcula desde los resultados que la propia skill fue guardando.
 */
@Controller('alexa')
@UseGuards(AlexaApiKeyGuard)
export class AlexaController {
  constructor(@Inject(LEARNING_CLIENT) private readonly client: ClientProxy) {}

  @Post('agenda')
  scheduleClass(
    @Body() dto: { alexaUserId?: string; class?: { topic?: string; date?: string; time?: string } },
  ) {
    const clase = dto?.class;
    if (!clase?.topic || !clase.date || !clase.time) {
      throw new BadRequestException('Falta topic, date o time en class.');
    }
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.ALEXA_SCHEDULE_CLASS, {
        topic: clase.topic,
        date: clase.date,
        time: clase.time,
      }),
    );
  }

  @Post('trivia')
  generateTrivia(@Body() dto: { alexaUserId?: string; topic?: string; count?: number }) {
    if (!dto?.topic || !dto.count) {
      throw new BadRequestException('Falta topic o count.');
    }
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.ALEXA_GENERATE_TRIVIA, {
        topic: dto.topic,
        count: Number(dto.count),
      }),
    );
  }

  @Post('trivia/resultado')
  saveTriviaResult(
    @Body()
    dto: {
      alexaUserId?: string;
      trivia?: {
        topic?: string;
        total?: number;
        correct?: number;
        score?: number;
        answers?: unknown[];
      };
    },
  ) {
    const trivia = dto?.trivia;
    if (!dto?.alexaUserId || !trivia?.topic) {
      throw new BadRequestException('Falta alexaUserId o trivia.topic.');
    }
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.ALEXA_SAVE_TRIVIA_RESULT, {
        alexaUserId: dto.alexaUserId,
        topic: trivia.topic,
        total: Number(trivia.total ?? 0),
        correct: Number(trivia.correct ?? 0),
        score: Number(trivia.score ?? 0),
        answers: trivia.answers ?? [],
      }),
    );
  }

  @Get('progreso/:alexaUserId')
  getProgress(@Param('alexaUserId') alexaUserId: string) {
    return firstValueFrom(
      this.client.send(LEARNING_PATTERNS.ALEXA_GET_PROGRESS, { alexaUserId }),
    );
  }

  /* La skill la llama al abrir sesión para sincronizar (Dynamic Entities)
     el catálogo real de cursos que reconoce por voz. */
  @Get('cursos')
  listCourses() {
    return firstValueFrom(this.client.send(LEARNING_PATTERNS.ALEXA_LIST_COURSES, {}));
  }
}

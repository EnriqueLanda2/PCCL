/* ───────────────────────────────────────────
   Gamificación — puntos, racha, insignias y tabla
   de posiciones del alumno.

   Vive en su propio controller y no dentro del de
   learning porque es el único de esa área que
   necesita HABLAR CON DOS SERVICIOS: learning sabe
   los puntos pero no los nombres, que están en la
   base de identity. Mismo patrón que
   StatsController.
   ─────────────────────────────────────────── */

import { Controller, Get, Inject, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IDENTITY_PATTERNS, LEARNING_PATTERNS } from '@app/contracts';
import { IDENTITY_CLIENT, LEARNING_CLIENT } from '@app/messaging';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/interfaces/request-user.interface';

interface LeaderboardRow {
  userId: string;
  points: number;
  currentStreak: number;
  lessonsCompleted: number;
  position: number;
}

interface IdentityUser {
  id: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}

@Controller()
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(
    @Inject(IDENTITY_CLIENT) private readonly identityClient: ClientProxy,
    @Inject(LEARNING_CLIENT) private readonly learningClient: ClientProxy,
  ) {}

  /**
   * Resumen del alumno autenticado.
   *
   * El id sale SIEMPRE del token, nunca de un parámetro: si se aceptara un
   * `userId` de la query, cualquiera podría leer el progreso de otro alumno
   * con solo cambiar la URL.
   */
  @Get('gamification/me')
  async summary(@CurrentUser() user: RequestUser) {
    if (!user?.sub) throw new UnauthorizedException('Sesión no válida');

    return firstValueFrom(
      this.learningClient.send(LEARNING_PATTERNS.GAMIFICATION_SUMMARY, {
        userId: user.sub,
      }),
    );
  }

  /**
   * Tabla de posiciones, con nombre y avatar resueltos contra identity.
   *
   * Se expone el nombre y el puntaje, nunca el correo: basta para reconocer a
   * un compañero de curso y no filtra un dato de contacto a toda la clase.
   */
  @Get('gamification/leaderboard')
  async leaderboard(
    @CurrentUser() user: RequestUser,
    @Query('courseId') courseId?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = Number(limit);
    const rows = await firstValueFrom<LeaderboardRow[]>(
      this.learningClient.send(LEARNING_PATTERNS.GAMIFICATION_LEADERBOARD, {
        courseId,
        limit: Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined,
      }),
    );

    if (rows.length === 0) return [];

    /* Si identity no responde, la tabla se devuelve sin nombres en vez de
       fallar: un ranking con "Alumno" es más útil que un error 500. */
    let usersById = new Map<string, IdentityUser>();
    try {
      const users = await firstValueFrom<IdentityUser[]>(
        this.identityClient.send(IDENTITY_PATTERNS.USER_FIND_ALL, {}),
      );
      usersById = new Map(users.map((u) => [u.id, u]));
    } catch {
      usersById = new Map();
    }

    return rows.map((row) => ({
      ...row,
      fullName: usersById.get(row.userId)?.fullName ?? 'Alumno',
      avatarUrl: usersById.get(row.userId)?.avatarUrl ?? null,
      /* Permite resaltar la fila propia sin que el cliente tenga que comparar
         ids, que además lo obligaría a conocer el suyo. */
      isMe: row.userId === user?.sub,
    }));
  }
}

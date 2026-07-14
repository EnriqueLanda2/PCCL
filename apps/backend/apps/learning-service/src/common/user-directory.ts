import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IDENTITY_PATTERNS } from '@app/contracts';

export interface DirectoryUser {
  id: string;
  fullName: string;
  email: string;
}

/**
 * Resuelve todos los usuarios de identity-service en un solo viaje NATS y
 * los indexa por id, para adjuntar el alumno real a filas de Inscription/
 * Progress (que solo guardan userId como UUID, sin relación Prisma —
 * identity-service vive en su propia base de datos).
 */
export async function buildUserDirectory(identityClient: ClientProxy): Promise<Map<string, DirectoryUser>> {
  const users = await firstValueFrom<DirectoryUser[]>(
    identityClient.send(IDENTITY_PATTERNS.USER_FIND_ALL, {}),
  ).catch(() => [] as DirectoryUser[]);
  // Solo se exponen campos públicos — la respuesta de USER_FIND_ALL trae
  // passwordHash/userRoles y no debe reenviarse tal cual al gateway/frontend.
  return new Map(users.map((u) => [u.id, { id: u.id, fullName: u.fullName, email: u.email }]));
}

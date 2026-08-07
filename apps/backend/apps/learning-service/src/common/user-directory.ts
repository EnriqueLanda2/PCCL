import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IDENTITY_PATTERNS } from '@app/contracts';

export interface DirectoryUser {
  id: string;
  fullName: string;
  email: string;
  /** Foto de perfil. Puede faltar: el usuario aún no ha guardado avatar. */
  avatarUrl: string | null;
  /** Cuenta dada de alta. Las vistas de alumnos ocultan las que no lo están. */
  active: boolean;
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
  // `avatarUrl` se añade a esa lista blanca a propósito: los listados de
  // alumnos lo necesitan para pintar la foto real, y es un dato tan público
  // como el nombre.
  return new Map(
    users.map((u) => [
      u.id,
      {
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        avatarUrl: u.avatarUrl ?? null,
        // Ausente se interpreta como activa: un usuario antiguo sin el campo no
        // debe desaparecer de los listados por omisión.
        active: u.active ?? true,
      },
    ]),
  );
}

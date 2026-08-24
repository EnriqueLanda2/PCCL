import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FirebaseAdminService } from './firebase-admin.service';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseAdminService,
  ) {}

  async registerToken(userId: string, token: string) {
    await this.prisma.pushToken.upsert({
      where: { token },
      create: { userId, token },
      /* Un mismo token de dispositivo puede haber quedado antes bajo otra
         cuenta (logout + login con otro usuario en el mismo navegador). */
      update: { userId },
    });
    return { ok: true };
  }

  /** Manda el push (si hay token/Firebase) Y siempre deja la notificación
      guardada para la campanita — así funciona igual aunque el navegador
      nunca haya dado permiso de push. */
  async notifyUsers(userIds: string[], title: string, body: string) {
    if (userIds.length === 0) return { sent: 0 };

    await this.prisma.notification.createMany({
      data: userIds.map((userId) => ({ userId, title, body })),
    });

    if (!this.firebase.enabled) return { sent: 0 };

    const rows = await this.prisma.pushToken.findMany({
      where: { userId: { in: userIds } },
      select: { token: true },
    });
    const tokens = rows.map((r) => r.token);
    if (tokens.length === 0) return { sent: 0 };

    const { invalidTokens } = await this.firebase.sendToTokens(tokens, title, body);
    if (invalidTokens.length > 0) {
      await this.prisma.pushToken.deleteMany({ where: { token: { in: invalidTokens } } });
    }

    this.logger.log(`Push "${title}" enviado a ${tokens.length - invalidTokens.length}/${tokens.length} dispositivos.`);
    return { sent: tokens.length - invalidTokens.length };
  }

  /** Para servicios que solo conocen el email del destinatario (learning-
      service guarda `createdBy` como email, no como id de usuario). */
  async notifyByEmail(email: string, title: string, body: string) {
    const user = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) return { sent: 0 };
    return this.notifyUsers([user.id], title, body);
  }

  /** Para avisar a todos los que tengan un rol activo (ej. todo el equipo de
      revisores cuando entra un curso nuevo a la cola). */
  async notifyByRole(roleName: string, title: string, body: string) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { role: { name: roleName }, user: { active: true } },
      select: { userId: true },
    });
    const userIds = [...new Set(userRoles.map((r) => r.userId))];
    return this.notifyUsers(userIds, title, body);
  }

  async findForUser(userId: string) {
    const rows = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
    return rows.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      read: n.readAt !== null,
      createdAt: n.createdAt.toISOString(),
    }));
  }

  unreadCount(userId: string) {
    return this.prisma.notification.count({ where: { userId, readAt: null } });
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, type App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

/**
 * Envuelve la inicialización del Admin SDK de Firebase (para mandar push por
 * FCM). Si no hay credenciales configuradas (FIREBASE_*), queda deshabilitado
 * y `send` simplemente no hace nada — no rompe el resto del backend en dev
 * sin Firebase configurado.
 */
@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private app: App | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const projectId = this.config.get<string>('FIREBASE_PROJECT_ID');
    const clientEmail = this.config.get<string>('FIREBASE_CLIENT_EMAIL');
    const rawPrivateKey = this.config.get<string>('FIREBASE_PRIVATE_KEY');

    if (!projectId || !clientEmail || !rawPrivateKey) {
      this.logger.warn('FIREBASE_* no configurado — las notificaciones push quedan deshabilitadas.');
      return;
    }

    this.app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: rawPrivateKey.replaceAll('\\n', '\n'),
      }),
    });
  }

  get enabled(): boolean {
    return this.app !== null;
  }

  /** Manda el mismo mensaje a varios tokens de un saque. Devuelve los tokens
      que Firebase reportó como inválidos/expirados, para que el caller los
      pueda borrar y no reintentar sobre ellos. */
  async sendToTokens(tokens: string[], title: string, body: string): Promise<{ invalidTokens: string[] }> {
    if (!this.app || tokens.length === 0) return { invalidTokens: [] };

    const response = await getMessaging(this.app).sendEachForMulticast({
      tokens,
      notification: { title, body },
      webpush: { fcmOptions: { link: '/' } },
    });

    const invalidTokens: string[] = [];
    response.responses.forEach((result, index) => {
      if (!result.success) {
        const code = result.error?.code ?? '';
        if (code.includes('registration-token-not-registered') || code.includes('invalid-argument')) {
          invalidTokens.push(tokens[index]);
        } else {
          this.logger.warn(`Push falló para un token: ${code}`);
        }
      }
    });

    return { invalidTokens };
  }
}

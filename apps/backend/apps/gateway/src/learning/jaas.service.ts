import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RequestUser } from '../auth/interfaces/request-user.interface';

export interface JaasCredentials {
  token: string | null;
  domain: string;
  room: string;
}

/**
 * Firma el JWT que JaaS (8x8.vc) exige para reconocer quién es moderador de
 * una sala — sin esto, meet.jit.si/8x8 le pide a CUALQUIER participante que
 * "reclame" el rol a mano con un botón. El moderador real (quien creó la
 * clase) se decide en el backend, nunca en el cliente.
 *
 * Si no hay credenciales de JaaS configuradas (JAAS_APP_ID/API_KEY_ID/
 * PRIVATE_KEY), se cae de vuelta al meet.jit.si público sin token — mismo
 * comportamiento que había antes de integrar JaaS.
 */
@Injectable()
export class JaasService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  tokenFor(roomBase: string, user: RequestUser, isModerator: boolean): JaasCredentials {
    const appId = this.config.get<string>('JAAS_APP_ID');
    const keyId = this.config.get<string>('JAAS_API_KEY_ID');
    const rawPrivateKey = this.config.get<string>('JAAS_PRIVATE_KEY');

    if (!appId || !keyId || !rawPrivateKey) {
      return { token: null, domain: 'meet.jit.si', room: roomBase };
    }

    /* La clave privada se guarda en el .env en una sola línea con "\n"
       literales (un PEM real rompería el formato de un .env); acá se
       restauran los saltos de línea de verdad antes de firmar. */
    const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
    const now = Math.floor(Date.now() / 1000);

    const token = this.jwt.sign(
      {
        aud: 'jitsi',
        iss: 'chat',
        sub: appId,
        room: '*',
        nbf: now - 10,
        context: {
          user: {
            id: user.sub,
            name: user.email,
            email: user.email,
            moderator: isModerator,
          },
          features: {
            livestreaming: false,
            recording: false,
            transcription: false,
            'outbound-call': false,
          },
        },
      },
      {
        algorithm: 'RS256',
        secret: privateKey,
        keyid: keyId,
        expiresIn: '3h',
      },
    );

    return { token, domain: '8x8.vc', room: `${appId}/${roomBase}` };
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

/**
 * La skill de Alexa no tiene sesión de usuario (no hay Cognito ni account
 * linking en este proyecto), así que las rutas /alexa/* van marcadas
 * @Public() para saltarse el JwtAuthGuard. Sin este guard quedarían
 * completamente abiertas al público: cualquiera podría agendar clases o
 * gastar cuota de AIRumbo. La Lambda de Alexa manda esta clave en cada
 * request (ver docs/alexa/02-back-alexa-skill.md).
 */
@Injectable()
export class AlexaApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.ALEXA_API_KEY?.trim();
    if (!expected) {
      throw new UnauthorizedException('La skill de Alexa no está configurada en este servidor.');
    }

    const req = context.switchToHttp().getRequest<Request>();
    const provided = req.headers['x-alexa-api-key'];
    if (provided !== expected) {
      throw new UnauthorizedException('Clave de la skill de Alexa inválida.');
    }

    return true;
  }
}

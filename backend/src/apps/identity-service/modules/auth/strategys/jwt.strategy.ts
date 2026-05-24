import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.pccl_session,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'pccl_secret'),
    });
  }

  validate(payload: RequestUser) {
    return payload;
  }
}

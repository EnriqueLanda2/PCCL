import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IdentityServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  health() {
    return {
      service: 'identity-service',
      status: 'ok',
      port: this.config.get<number>('PORT', 4001),
    };
  }

  async summary() {
    const users = await this.prisma.user.count();

    return { users };
  }
}

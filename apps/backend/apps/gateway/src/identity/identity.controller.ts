import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { IDENTITY_PATTERNS } from '@app/contracts';
import { IDENTITY_CLIENT } from '@app/messaging';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/interfaces/request-user.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class IdentityController {
  constructor(
    @Inject(IDENTITY_CLIENT) private readonly client: ClientProxy,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Post('auth/login')
  async login(
    @Body() dto: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await firstValueFrom<any>(
      this.client.send(IDENTITY_PATTERNS.AUTH_LOGIN, dto),
    );
    this.setCookie(res, result.token);
    return { user: result.user, access: result.access };
  }

  @Public()
  @Post('auth/register')
  async register(
    @Body() dto: { fullName: string; email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await firstValueFrom<any>(
      this.client.send(IDENTITY_PATTERNS.AUTH_REGISTER, dto),
    );
    this.setCookie(res, result.token);
    return { user: result.user, access: result.access };
  }

  @Public()
  @Post('auth/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const cookieDomain = this.config.get<string>('COOKIE_DOMAIN', 'localhost');
    res.clearCookie('pccl_session', {
      path: '/',
      ...(cookieDomain !== 'localhost' && cookieDomain !== '127.0.0.1'
        ? { domain: cookieDomain }
        : {}),
    });
    return { message: 'Sesion cerrada' };
  }

  @Get('auth/me')
  me(@CurrentUser() user: RequestUser) {
    return user;
  }

  @Get('users')
  findAllUsers() {
    return firstValueFrom(this.client.send(IDENTITY_PATTERNS.USER_FIND_ALL, {}));
  }

  @Get('users/:id')
  findUser(@Param('id') id: string) {
    return firstValueFrom(this.client.send(IDENTITY_PATTERNS.USER_FIND_BY_ID, { id }));
  }

  @Post('users')
  createUser(
    @Body() dto: any,
    @CurrentUser() user: RequestUser | null,
  ) {
    return firstValueFrom(
      this.client.send(IDENTITY_PATTERNS.USER_CREATE, {
        dto,
        actor: user?.email ?? 'anonymous',
      }),
    );
  }

  @Get('rbac/me')
  getRbacProfile(@CurrentUser() user: RequestUser) {
    return firstValueFrom(
      this.client.send(IDENTITY_PATTERNS.RBAC_PROFILE, { userId: user.sub }),
    );
  }

  @Get('rbac/catalogs')
  getRbacCatalogs() {
    return firstValueFrom(this.client.send(IDENTITY_PATTERNS.RBAC_CATALOGS, {}));
  }

  private setCookie(res: Response, token: string) {
    const cookieDomain = this.config.get<string>('COOKIE_DOMAIN', 'localhost');
    res.cookie('pccl_session', token, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      ...(cookieDomain !== 'localhost' && cookieDomain !== '127.0.0.1'
        ? { domain: cookieDomain }
        : {}),
    });
  }
}

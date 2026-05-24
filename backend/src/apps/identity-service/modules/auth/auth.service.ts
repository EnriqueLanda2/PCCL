import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { PrismaService } from '../../../../prisma/prisma.service';
import { RbacService } from '../rbac/rbac.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { RequestUser } from './interfaces/request-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly rbacService: RbacService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginDto, response: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!user.active) {
      throw new ForbiddenException('Usuario inactivo');
    }

    const profile = await this.rbacService.getAccessProfile(user.id);
    const payload: RequestUser = {
      sub: user.id,
      email: 'system',
      roleIds: user.userRoles.map((ur) => ur.role.id),
      permissions: profile.permissions as string[],
      scope: 'authenticated_user',
    };

    const token = await this.jwtService.signAsync(payload);
    const cookieDomain = this.config.get<string>('COOKIE_DOMAIN', 'localhost');
    const cookieOptions = {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      ...(cookieDomain && cookieDomain !== 'localhost' && cookieDomain !== '127.0.0.1'
        ? { domain: cookieDomain }
        : {}),
    };

    response.cookie('pccl_session', token, cookieOptions);

    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: 'system',
      },
      access: profile,
    };
  }

  async register(dto: RegisterDto, response: Response) {
    /* Check for duplicate email */
    const existing = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta con ese correo electrónico.');
    }

    /* Find the default "Alumno" role — case-insensitive */
    const alumnoRole = await this.prisma.role.findFirst({
      where: { name: { contains: 'alumno', mode: 'insensitive' } },
    });
    if (!alumnoRole) {
      throw new NotFoundException(
        'El rol de alumno no está configurado. Contacta al administrador.',
      );
    }

    /* Create the user with the alumno role */
    await this.usersService.create(
      { fullName: dto.fullName, email: dto.email, password: dto.password, roleIds: [alumnoRole.id] },
      'register',
    );

    /* Auto-login: reuse the login flow with the new credentials */
    return this.login({ email: dto.email, password: dto.password }, response);
  }

  logout(response: Response) {
    const cookieDomain = this.config.get<string>('COOKIE_DOMAIN', 'localhost');
    response.clearCookie('pccl_session', {
      path: '/',
      ...(cookieDomain && cookieDomain !== 'localhost' && cookieDomain !== '127.0.0.1'
        ? { domain: cookieDomain }
        : {}),
    });
    return { message: 'Sesion cerrada' };
  }
}



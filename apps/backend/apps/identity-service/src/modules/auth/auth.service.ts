import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RbacService } from '../rbac/rbac.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';

const RESET_CODE_TTL_MS = 15 * 60_000;
const RESET_CODE_RESEND_COOLDOWN_MS = 60_000;
const RESET_CODE_MAX_ATTEMPTS = 5;
const GENERIC_FORGOT_MESSAGE = 'Si el correo existe, te llegó un código.';
const INVALID_CODE_MESSAGE = 'Código incorrecto.';
const EXPIRED_CODE_MESSAGE = 'El código expiró o se agotaron los intentos. Solicita uno nuevo.';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly rbacService: RbacService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales invalidas');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales invalidas');

    if (!user.active) throw new ForbiddenException('Usuario inactivo');

    const profile = await this.rbacService.getAccessProfile(user.id);
    const payload = {
      sub: user.id,
      email: user.email,
      roleIds: user.userRoles.map((ur) => ur.role.id),
      // Los nombres de rol viajan en el token para que el gateway decida el
      // alcance de datos (admin = global) sin consultar identity en cada request.
      roles: profile.roles as string[],
      permissions: profile.permissions as string[],
      scope: 'authenticated_user',
    };

    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email, avatarUrl: user.avatarUrl },
      access: profile,
    };
  }

  async register(fullName: string, email: string, password: string) {
    const existing = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (existing) throw new ConflictException('Ya existe una cuenta con ese correo electrónico.');

    const alumnoRole = await this.prisma.role.findFirst({
      where: { name: { contains: 'alumno', mode: 'insensitive' } },
    });
    if (!alumnoRole)
      throw new NotFoundException('El rol de alumno no está configurado. Contacta al administrador.');

    await this.usersService.create(
      { fullName, email, password, roleIds: [alumnoRole.id] },
      'register',
    );

    return this.login(email, password);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const existing = await this.prisma.passwordResetCode.findFirst({
        where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
      });
      const recentlyRequested =
        existing && Date.now() - existing.createdAt.getTime() < RESET_CODE_RESEND_COOLDOWN_MS;

      if (!recentlyRequested) {
        await this.prisma.passwordResetCode.updateMany({
          where: { userId: user.id, usedAt: null },
          data: { usedAt: new Date() },
        });

        const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
        const codeHash = await bcrypt.hash(code, 10);
        await this.prisma.passwordResetCode.create({
          data: {
            userId: user.id,
            codeHash,
            expiresAt: new Date(Date.now() + RESET_CODE_TTL_MS),
          },
        });

        this.mailService
          .sendPasswordResetCode(user.email, code)
          .catch((err) => this.logger.error(`No se pudo enviar el código a ${user.email}`, err));
      }
    }

    return { message: GENERIC_FORGOT_MESSAGE };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    const record = user
      ? await this.prisma.passwordResetCode.findFirst({
          where: { userId: user.id, usedAt: null },
          orderBy: { createdAt: 'desc' },
        })
      : null;

    if (!user || !record || record.expiresAt < new Date()) {
      throw new BadRequestException(EXPIRED_CODE_MESSAGE);
    }

    const valid = await bcrypt.compare(code, record.codeHash);
    if (!valid) {
      const updated = await this.prisma.passwordResetCode.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
      });
      const exhausted = updated.attempts >= RESET_CODE_MAX_ATTEMPTS;
      if (exhausted) {
        await this.prisma.passwordResetCode.update({
          where: { id: record.id },
          data: { usedAt: new Date() },
        });
      }
      throw new BadRequestException(exhausted ? EXPIRED_CODE_MESSAGE : INVALID_CODE_MESSAGE);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, updatedBy: 'password-reset' },
      }),
      this.prisma.passwordResetCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return { message: 'Contraseña actualizada.' };
  }
}

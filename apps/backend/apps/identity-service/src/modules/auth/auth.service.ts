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
import { PrismaService } from '../../prisma/prisma.service';
import { RbacService } from '../rbac/rbac.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly rbacService: RbacService,
    private readonly prisma: PrismaService,
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
      permissions: profile.permissions as string[],
      scope: 'authenticated_user',
    };

    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email },
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
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

const USER_INCLUDE = {
  userRoles: {
    include: {
      role: {
        include: {
          rolePrivileges: {
            include: { privilege: { include: { module: true } } },
          },
        },
      },
    },
  },
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto, actor = 'system') {
    const roles = await this.prisma.role.findMany({ where: { id: { in: dto.roleIds } } });
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const created = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName: dto.fullName,
          email: dto.email.toLowerCase(),
          passwordHash,
          createdBy: actor,
          updatedBy: actor,
        },
      });

      if (roles.length > 0) {
        await tx.userRole.createMany({
          data: roles.map((role) => ({
            userId: user.id,
            roleId: role.id,
            createdBy: actor,
            updatedBy: actor,
          })),
        });
      }

      return tx.user.findUnique({ where: { id: user.id }, include: USER_INCLUDE });
    });

    if (!created) throw new NotFoundException('Usuario no encontrado');
    return created;
  }

  async update(id: string, dto: UpdateUserDto, actor = 'system') {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: true },
    });
    if (!existing) throw new NotFoundException('Usuario no encontrado');

    const email = dto.email?.toLowerCase();
    if (email && email !== existing.email) {
      const duplicate = await this.prisma.user.findFirst({
        where: { email, id: { not: id } },
      });
      if (duplicate) throw new ConflictException('Ya existe una cuenta con ese correo electrónico.');
    }

    const roles = dto.roleIds?.length
      ? await this.prisma.role.findMany({ where: { id: { in: dto.roleIds } } })
      : null;

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          fullName: dto.fullName ?? existing.fullName,
          email: email ?? existing.email,
          active: dto.active ?? existing.active,
          updatedBy: actor,
        },
      });

      if (dto.roleIds) {
        await tx.userRole.deleteMany({ where: { userId: id } });
        if (roles && roles.length > 0) {
          await tx.userRole.createMany({
            data: roles.map((role) => ({
              userId: id,
              roleId: role.id,
              createdBy: actor,
              updatedBy: actor,
            })),
          });
        }
      }

      return tx.user.findUnique({ where: { id }, include: USER_INCLUDE });
    });

    if (!updated) throw new NotFoundException('Usuario no encontrado');
    return updated;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: USER_INCLUDE });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), active: true },
      include: USER_INCLUDE,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: { userRoles: { include: { role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Total de usuarios activos — para las estadísticas públicas del landing. */
  countActive() {
    return this.prisma.user.count({ where: { active: true } });
  }

  /** Actualiza la foto de perfil del usuario — solo el propio usuario, vía /users/me/avatar. */
  async updateAvatar(userId: string, avatarUrl: string, actor: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl, updatedBy: actor },
    });
    return { id: userId, avatarUrl };
  }
}

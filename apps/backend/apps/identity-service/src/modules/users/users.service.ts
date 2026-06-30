import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';

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
}

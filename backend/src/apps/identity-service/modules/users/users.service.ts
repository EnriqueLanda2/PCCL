import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto, actor = 'system') {
    const roles = await this.prisma.role.findMany({
      where: { id: { in: dto.roleIds } },
    });
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

      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePrivileges: {
                    include: {
                      privilege: {
                        include: { module: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    if (!created) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return created;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePrivileges: {
                  include: {
                    privilege: {
                      include: { module: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: email.toLowerCase(), active: true },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePrivileges: {
                  include: {
                    privilege: {
                      include: { module: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        userRoles: {
          include: { role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}



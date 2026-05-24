import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccessProfile(userId: string) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePrivileges: {
              include: {
                privilege: {
                  include: {
                    module: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const roles = userRoles.map((x) => x.role.name);
    const permissions = Array.from(
      new Set(
        userRoles.flatMap((userRole) =>
          userRole.role.rolePrivileges.map((rp) => rp.privilege.code),
        ),
      ),
    );

    const menu = this.buildMenu(permissions);
    return { roles, permissions, menu };
  }

  private buildMenu(permissions: string[]) {
    const modules = [
      'dashboard',
      'courses',
      'lessons',
      'inscriptions',
      'califications',
      'certificates',
      'progress',
      'reports',
      'users',
      'rbac',
    ];

    return modules
      .map((module) => ({
        module,
        visible: permissions.some((p) => p.startsWith(`${module}:`)),
      }))
      .filter((m) => m.visible);
  }

  async listCatalogs() {
    const [roles, modules, privileges] = await Promise.all([
      this.prisma.role.findMany(),
      this.prisma.systemModule.findMany(),
      this.prisma.privilege.findMany({ include: { module: true } }),
    ]);

    return { roles, modules, privileges };
  }
}



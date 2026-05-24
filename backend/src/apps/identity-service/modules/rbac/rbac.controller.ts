import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RbacService } from './rbac.service';

@Controller('rbac')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('me')
  getAccessProfile(@CurrentUser() user: { id: string }) {
    return this.rbacService.getAccessProfile(user.id);
  }

  @Get('catalogs')
  @RequirePermission('rbac:read')
  listCatalogs() {
    return this.rbacService.listCatalogs();
  }
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermission('users:create')
  create(@Body() dto: CreateUserDto, @CurrentUser() user: { email: string }) {
    return this.usersService.create(dto, user?.email ?? 'anonymous');
  }

  @Get()
  @RequirePermission('users:read')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermission('users:read')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}

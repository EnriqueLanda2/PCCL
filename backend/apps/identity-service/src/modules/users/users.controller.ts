import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IDENTITY_PATTERNS } from '@app/contracts';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(IDENTITY_PATTERNS.USER_FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern(IDENTITY_PATTERNS.USER_FIND_BY_ID)
  findOne(@Payload() payload: { id: string }) {
    return this.usersService.findOne(payload.id);
  }

  @MessagePattern(IDENTITY_PATTERNS.USER_CREATE)
  create(@Payload() payload: { dto: CreateUserDto; actor: string }) {
    return this.usersService.create(payload.dto, payload.actor);
  }
}

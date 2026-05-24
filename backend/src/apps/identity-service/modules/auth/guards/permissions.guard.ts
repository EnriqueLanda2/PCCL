import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSION } from '../decorators/require-permission.decorator';
import { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(REQUIRED_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user as RequestUser | undefined;

    if (!user) {
      throw new ForbiddenException('Sin usuario autenticado');
    }

    const allowed = required.every((permission) => user.permissions.includes(permission));

    if (!allowed) {
      throw new ForbiddenException('Permisos insuficientes');
    }

    return true;
  }
}

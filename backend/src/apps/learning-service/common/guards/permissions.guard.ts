import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_PERMISSION } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required: string[] = this.reflector.get<string[]>(REQUIRED_PERMISSION, context.getHandler()) || [];
    if (!required.length) return true;
    const req = context.switchToHttp().getRequest();
    const header = req.headers['x-permissions'] || '';
    const perms = String(header).split(',').map((s) => s.trim()).filter(Boolean);
    return required.every((p) => perms.includes(p));
  }
}

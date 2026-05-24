import { SetMetadata } from '@nestjs/common';

export const REQUIRED_PERMISSION = 'required_permission';

// Especifica el permiso requerido para el endpoint.
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(REQUIRED_PERMISSION, permissions);

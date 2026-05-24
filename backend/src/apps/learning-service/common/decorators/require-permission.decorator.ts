import { SetMetadata } from '@nestjs/common';

export const REQUIRED_PERMISSION = 'required_permissions';

export const RequirePermission = (...permissions: string[]) => SetMetadata(REQUIRED_PERMISSION, permissions);

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IDENTITY_PATTERNS } from '@app/contracts';
import { RbacService } from './rbac.service';

@Controller()
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @MessagePattern(IDENTITY_PATTERNS.RBAC_PROFILE)
  getProfile(@Payload() payload: { userId: string }) {
    return this.rbacService.getAccessProfile(payload.userId);
  }

  @MessagePattern(IDENTITY_PATTERNS.RBAC_CATALOGS)
  getCatalogs() {
    return this.rbacService.listCatalogs();
  }
}

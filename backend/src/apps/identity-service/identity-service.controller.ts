import { Controller, Get } from '@nestjs/common';
import { IdentityServiceService } from './identity-service.service';

@Controller()
export class IdentityServiceController {
  constructor(private readonly identityService: IdentityServiceService) {}

  @Get('health')
  health() {
    return this.identityService.health();
  }

  @Get('summary')
  summary() {
    return this.identityService.summary();
  }
}
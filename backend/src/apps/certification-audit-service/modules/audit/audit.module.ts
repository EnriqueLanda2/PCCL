import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditMiddleware } from './middleware/audit.middleware';
import { AuditService } from './audit.service';

@Module({
		providers: [AuditService, AuditMiddleware],
	controllers: [AuditController],
	exports: [AuditService, AuditMiddleware],
})
export class AuditModule {}



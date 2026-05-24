import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
	constructor(private readonly auditService: AuditService) {}

	@Get()
	async list(@Query('limit') limit = '100') {
		const parsedLimit = Number.isNaN(Number(limit))
			? 100
			: Math.min(Number(limit), 500);

		return this.auditService.list(parsedLimit);
	}
}



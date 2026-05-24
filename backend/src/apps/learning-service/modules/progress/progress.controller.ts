import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('progress')
@UseGuards(PermissionsGuard)
export class ProgressController {
	constructor(private readonly progService: ProgressService) {}

	@Post(':inscriptionId')
	@RequirePermission('progress:create')
	create(@Param('inscriptionId') inscriptionId: string) {
		return this.progService.create(inscriptionId, 'system');
	}

	@Get()
	@RequirePermission('progress:read')
	findAll() {
		return this.progService.findAll();
	}

	@Get(':inscriptionId')
	@RequirePermission('progress:read')
	findOne(@Param('inscriptionId') inscriptionId: string) {
		return this.progService.findByInscription(inscriptionId);
	}
}




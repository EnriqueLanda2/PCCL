import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateCalificationDto } from './dtos/create-calification.dto';
import { CalificationsService } from './califications.service';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('califications')
@UseGuards(PermissionsGuard)
export class CalificationsController {
	constructor(private readonly calService: CalificationsService) {}

	@Post()
	@RequirePermission('califications:create')
	create(@Body() dto: CreateCalificationDto) {
		return this.calService.create(dto, 'system');
	}

	@Get()
	@RequirePermission('califications:read')
	findAll() {
		return this.calService.findAll();
	}

	@Get(':id')
	@RequirePermission('califications:read')
	findOne(@Param('id') id: string) {
		return this.calService.findOne(id);
	}

	@Delete(':id')
	@RequirePermission('califications:delete')
	remove(@Param('id') id: string) {
		return this.calService.remove(id);
	}
}




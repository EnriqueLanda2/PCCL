import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { CreateInscriptionDto, UpdateInscriptionDto } from './dtos/inscription.dto';
import { InscriptionsService } from './inscriptions.service';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('inscriptions')
@UseGuards(PermissionsGuard)
export class InscriptionsController {
	constructor(private readonly inscService: InscriptionsService) {}

	@Post()
	@RequirePermission('inscriptions:create')
	create(@Body() dto: CreateInscriptionDto) {
		return this.inscService.create(dto, 'system');
	}

	@Get()
	@RequirePermission('inscriptions:read')
	findAll() {
		return this.inscService.findAll();
	}

	@Get(':id')
	@RequirePermission('inscriptions:read')
	findOne(@Param('id') id: string) {
		return this.inscService.findOne(id);
	}

	@Patch(':id')
	@RequirePermission('inscriptions:update')
	update(@Param('id') id: string, @Body() dto: UpdateInscriptionDto) {
		return this.inscService.update(id, dto, 'system');
	}

	@Delete(':id')
	@RequirePermission('inscriptions:delete')
	remove(@Param('id') id: string) {
		return this.inscService.remove(id);
	}
}



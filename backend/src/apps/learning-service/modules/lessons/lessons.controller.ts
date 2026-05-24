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
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { LessonsService } from './lessons.service';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('lessons')
@UseGuards(PermissionsGuard)
export class LessonsController {
	constructor(private readonly lessonsService: LessonsService) {}

	@Post()
	@RequirePermission('lessons:create')
	create(@Body() dto: CreateLessonDto) {
		return this.lessonsService.create(dto, 'system');
	}

	@Get()
	@RequirePermission('lessons:read')
	findAll() {
		return this.lessonsService.findAll();
	}

	@Get(':id')
	@RequirePermission('lessons:read')
	findOne(@Param('id') id: string) {
		return this.lessonsService.findOne(id);
	}

	@Patch(':id')
	@RequirePermission('lessons:update')
	update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
		return this.lessonsService.update(id, dto, 'system');
	}

	@Delete(':id')
	@RequirePermission('lessons:delete')
	remove(@Param('id') id: string) {
		return this.lessonsService.remove(id);
	}
}




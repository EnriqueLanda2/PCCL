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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('courses')
@UseGuards(PermissionsGuard)
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Post()
	@RequirePermission('courses:create')
	create(@Body() dto: CreateCourseDto) {
		return this.coursesService.create(dto, 'system');
	}

	@Get()
	@RequirePermission('courses:read')
	findAll() {
		return this.coursesService.findAll();
	}

	@Get(':id')
	@RequirePermission('courses:read')
	findOne(@Param('id') id: string) {
		return this.coursesService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() dto: UpdateCourseDto,
	) {
		return this.coursesService.update(id, dto, 'system');
	}

	@Patch(':id/publish')
	@RequirePermission('courses:publish')
	publish(@Param('id') id: string) {
		return this.coursesService.publish(id, 'system');
	}

	@Delete(':id')
	@RequirePermission('courses:delete')
	remove(@Param('id') id: string) {
		return this.coursesService.remove(id);
	}
}




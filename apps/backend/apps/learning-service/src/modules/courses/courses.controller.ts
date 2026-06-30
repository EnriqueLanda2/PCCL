import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Controller()
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @MessagePattern(LEARNING_PATTERNS.COURSE_CREATE)
  create(@Payload() p: { dto: CreateCourseDto; actor: string }) {
    return this.service.create(p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.COURSE_FIND_ALL)
  findAll() { return this.service.findAll(); }

  @MessagePattern(LEARNING_PATTERNS.COURSE_FIND_ONE)
  findOne(@Payload() p: { id: string }) { return this.service.findOne(p.id); }

  @MessagePattern(LEARNING_PATTERNS.COURSE_UPDATE)
  update(@Payload() p: { id: string; dto: UpdateCourseDto; actor: string }) {
    return this.service.update(p.id, p.dto, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.COURSE_DELETE)
  remove(@Payload() p: { id: string }) { return this.service.remove(p.id); }

  @MessagePattern(LEARNING_PATTERNS.COURSE_PUBLISH)
  publish(@Payload() p: { id: string; actor: string }) {
    return this.service.publish(p.id, p.actor);
  }
}

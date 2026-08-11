import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DataScope, LEARNING_PATTERNS } from '@app/contracts';
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
  findAll(@Payload() p: { scope?: DataScope }) { return this.service.findAll(p?.scope); }

  @MessagePattern(LEARNING_PATTERNS.COURSE_FIND_PUBLISHED)
  findPublished() { return this.service.findPublished(); }

  @MessagePattern(LEARNING_PATTERNS.COURSE_FIND_PUBLISHED_ONE)
  findPublishedOne(@Payload() p: { id: string }) {
    return this.service.findPublishedOne(p.id);
  }

  @MessagePattern(LEARNING_PATTERNS.COURSE_COUNT_PUBLISHED)
  countPublished() {
    return this.service.countPublished();
  }

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

  @MessagePattern(LEARNING_PATTERNS.COURSE_REVIEW_FIND_BY_COURSE)
  findReviews(@Payload() p: { courseId: string; viewerId?: string }) {
    return this.service.findReviews(p.courseId, p.viewerId);
  }

  @MessagePattern(LEARNING_PATTERNS.COURSE_REVIEW_UPSERT)
  upsertReview(@Payload() p: { courseId: string; userId: string; rating: number; comment?: string | null; actor: string }) {
    return this.service.upsertReview(p.courseId, p.userId, p.rating, p.comment ?? null, p.actor);
  }

  @MessagePattern(LEARNING_PATTERNS.COURSE_CERTIFICATE_ELIGIBILITY)
  certificateEligibility(@Payload() p: { courseId: string; userId: string }) {
    return this.service.certificateEligibility(p.courseId, p.userId);
  }
}

import { IsIn, IsInt, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { LESSON_CONTENT_TYPES } from './create-lesson.dto';

export class UpdateLessonDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() content?: string;
  @IsString() @IsIn(LESSON_CONTENT_TYPES) @IsOptional() contentType?: string;
  @IsUUID() @IsOptional() courseId?: string;
  @IsUUID() @IsOptional() phaseId?: string;
  @IsInt() @IsPositive() @IsOptional() durationMinutes?: number;
  @IsString() @IsOptional() fileUrl?: string;
}

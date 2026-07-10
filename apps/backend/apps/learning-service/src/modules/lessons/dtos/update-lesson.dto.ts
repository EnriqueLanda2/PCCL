import { IsIn, IsInt, IsOptional, IsPositive, IsString, IsUrl, IsUUID } from 'class-validator';
import { LESSON_CONTENT_TYPES } from './create-lesson.dto';

export class UpdateLessonDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() content?: string;
  @IsString() @IsIn(LESSON_CONTENT_TYPES) @IsOptional() contentType?: string;
  @IsUUID() @IsOptional() courseId?: string;
  @IsInt() @IsPositive() @IsOptional() durationMinutes?: number;
  @IsUrl() @IsOptional() fileUrl?: string;
}

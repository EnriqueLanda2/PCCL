import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, IsUUID } from 'class-validator';

export const LESSON_CONTENT_TYPES = [
  'text', 'video', 'link', 'file', 'quiz', 'practice', 'reading', 'live',
] as const;
export type LessonContentType = (typeof LESSON_CONTENT_TYPES)[number];

export class CreateLessonDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsNotEmpty() content!: string;
  @IsString() @IsIn(LESSON_CONTENT_TYPES) contentType!: LessonContentType;
  @IsUUID() courseId!: string;
  @IsInt() @IsPositive() @IsOptional() durationMinutes?: number;
  @IsUrl() @IsOptional() fileUrl?: string;
}

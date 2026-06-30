import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateLessonDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() content?: string;
  @IsString() @IsIn(['text', 'video', 'link', 'file']) @IsOptional() contentType?: string;
  @IsUUID() @IsOptional() courseId?: string;
}

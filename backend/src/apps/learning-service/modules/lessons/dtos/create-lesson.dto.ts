import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsIn(['text', 'video', 'link', 'file'])
  contentType!: 'text' | 'video' | 'link' | 'file';

  @IsUUID()
  courseId!: string;
}

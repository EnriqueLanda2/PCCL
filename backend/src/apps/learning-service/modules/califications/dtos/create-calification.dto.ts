import { IsIn, IsInt, IsString, IsUUID } from 'class-validator';

export class CreateCalificationDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  @IsIn(['quiz', 'task', 'exam'])
  type!: 'quiz' | 'task' | 'exam';

  @IsInt()
  totalPoints!: number;

  @IsInt()
  maxAttempts!: number;

  @IsUUID()
  lessonId!: string;
}

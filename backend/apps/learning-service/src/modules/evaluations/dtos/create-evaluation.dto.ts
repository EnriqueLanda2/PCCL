import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEvaluationDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsNotEmpty() courseId!: string;
}

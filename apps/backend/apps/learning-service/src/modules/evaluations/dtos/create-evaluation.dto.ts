import { IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export interface KahootQuestionDto {
  prompt: string;
  options: string[];
  correctIndex: number;
  timeLimitSeconds?: number;
}

export class CreateEvaluationDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() topic?: string;
  @IsString() @IsOptional() kind?: 'kahoot';
  @IsInt() @Min(1) @Max(100) @IsOptional() passingScore?: number;
  @IsArray() @IsOptional() questions?: KahootQuestionDto[];
  @IsString() @IsNotEmpty() courseId!: string;
  @IsUUID() @IsOptional() phaseId?: string;
  @IsIn(['start', 'end']) @IsOptional() phasePosition?: 'start' | 'end';
}

import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsIn(['basic', 'intermediate', 'advanced']) @IsOptional() level?: string;
}

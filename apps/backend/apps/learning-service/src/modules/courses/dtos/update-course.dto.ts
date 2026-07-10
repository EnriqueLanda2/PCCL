import { IsIn, IsInt, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class UpdateCourseDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsIn(['basic', 'intermediate', 'advanced']) @IsOptional() level?: string;
  @IsUrl() @IsOptional() coverImageUrl?: string;
  @IsInt() @IsPositive() @IsOptional() durationMinutes?: number;
}

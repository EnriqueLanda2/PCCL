import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUrl, Min } from 'class-validator';

export class UpdateCourseDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsIn(['basic', 'intermediate', 'advanced']) @IsOptional() level?: string;
  @IsUrl() @IsOptional() coverImageUrl?: string;
  @IsInt() @IsPositive() @IsOptional() durationMinutes?: number;
  @IsNumber() @Min(0) @IsOptional() price?: number;
  @IsString() @IsOptional() currency?: string;
  @IsBoolean() @IsOptional() isFree?: boolean;
}

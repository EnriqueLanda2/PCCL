import { IsIn, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class CreateCourseDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsNotEmpty() description!: string;
  @IsString() @IsIn(['basic', 'intermediate', 'advanced']) level!: 'basic' | 'intermediate' | 'advanced';
  /** URL de Cloudinary — la imagen ya fue subida vía POST /uploads/image antes de crear el curso */
  @IsUrl() @IsOptional() coverImageUrl?: string;
  @IsInt() @IsPositive() @IsOptional() durationMinutes?: number;
}

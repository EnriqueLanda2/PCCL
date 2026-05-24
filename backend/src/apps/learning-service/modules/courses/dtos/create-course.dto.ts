import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsIn(['basic', 'intermediate', 'advanced'])
  level!: 'basic' | 'intermediate' | 'advanced';
}

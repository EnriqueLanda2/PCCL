import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateInscriptionDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  courseId!: string;
}

export class UpdateInscriptionDto {
  @IsString()
  @IsOptional()
  status?: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
}

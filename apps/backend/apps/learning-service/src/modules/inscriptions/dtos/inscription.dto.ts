import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateInscriptionDto {
  @IsUUID() userId!: string;
  @IsUUID() courseId!: string;
  @IsString() @IsOptional() accessType?: 'monthly' | 'permanent';
  @IsString() @IsOptional() accessEndsAt?: string | null;
}

export class UpdateInscriptionDto {
  @IsString() @IsOptional() status?: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
}

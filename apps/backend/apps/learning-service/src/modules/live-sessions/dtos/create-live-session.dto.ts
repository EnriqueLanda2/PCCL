import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateLiveSessionDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsNotEmpty() hostName!: string;
  @IsDateString() scheduledAt!: string;
  @IsInt() @IsPositive() @IsOptional() durationMinutes?: number;
  @IsUrl() @IsOptional() joinUrl?: string;
  @IsUUID() @IsOptional() courseId?: string;
}

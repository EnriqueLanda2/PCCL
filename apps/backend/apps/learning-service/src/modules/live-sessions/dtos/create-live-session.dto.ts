import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateLiveSessionDto {
  @IsString() @IsNotEmpty() title!: string;
  @IsString() @IsOptional() hostName?: string;
  @IsDateString() scheduledAt!: string;
  @IsInt() @IsPositive() @IsOptional() durationMinutes?: number;
  @IsUrl() @IsOptional() joinUrl?: string;
  @IsUUID() @IsOptional() courseId?: string;
  @IsUUID() @IsOptional() phaseId?: string;
}

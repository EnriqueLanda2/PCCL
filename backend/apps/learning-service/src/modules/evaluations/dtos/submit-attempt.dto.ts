import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SubmitAttemptDto {
  @IsString() @IsNotEmpty() evaluationId!: string;
  @IsString() @IsNotEmpty() studentId!: string;
  @IsArray() answers!: any[];
}

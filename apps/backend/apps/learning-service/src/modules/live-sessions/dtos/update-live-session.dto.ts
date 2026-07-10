import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateLiveSessionDto } from './create-live-session.dto';

export class UpdateLiveSessionDto extends PartialType(CreateLiveSessionDto) {
  @IsIn(['scheduled', 'live', 'ended', 'canceled']) @IsOptional() status?: string;
}

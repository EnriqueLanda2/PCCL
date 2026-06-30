import { Module } from '@nestjs/common';
import { CalificationsService } from './califications.service';
import { CalificationsController } from './califications.controller';

@Module({ providers: [CalificationsService], controllers: [CalificationsController] })
export class CalificationsModule {}

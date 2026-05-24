import { Module } from '@nestjs/common';
import { CalificationsController } from './califications.controller';
import { CalificationsService } from './califications.service';

@Module({
		providers: [CalificationsService],
	controllers: [CalificationsController],
})
export class CalificationsModule {}



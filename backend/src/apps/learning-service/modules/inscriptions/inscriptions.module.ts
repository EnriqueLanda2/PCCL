import { Module } from '@nestjs/common';
import { InscriptionsController } from './inscriptions.controller';
import { InscriptionsService } from './inscriptions.service';

@Module({
		providers: [InscriptionsService],
	controllers: [InscriptionsController],
})
export class InscriptionsModule {}



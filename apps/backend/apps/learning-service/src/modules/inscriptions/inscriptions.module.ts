import { Module } from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { InscriptionsController } from './inscriptions.controller';

@Module({
  providers: [InscriptionsService],
  controllers: [InscriptionsController],
})
export class InscriptionsModule {}

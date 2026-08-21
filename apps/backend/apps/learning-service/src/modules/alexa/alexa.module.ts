import { Module } from '@nestjs/common';
import { LiveSessionsModule } from '../live-sessions/live-sessions.module';
import { AlexaService } from './alexa.service';
import { AlexaController } from './alexa.controller';

@Module({
  imports: [LiveSessionsModule],
  providers: [AlexaService],
  controllers: [AlexaController],
})
export class AlexaModule {}

import { Module } from '@nestjs/common';
import { PushService } from './push.service';
import { PushController } from './push.controller';
import { FirebaseAdminService } from './firebase-admin.service';

@Module({
  providers: [PushService, FirebaseAdminService],
  controllers: [PushController],
  exports: [PushService],
})
export class PushModule {}

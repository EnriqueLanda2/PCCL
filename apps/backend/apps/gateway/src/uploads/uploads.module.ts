import { Module } from '@nestjs/common';
import { S3StorageService } from '@app/common';
import { UploadsController } from './uploads.controller';

@Module({
  controllers: [UploadsController],
  providers: [S3StorageService],
})
export class UploadsModule {}

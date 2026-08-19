import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { CloudinaryService } from './cloudinary.service';
import { LocalFileService } from './local-file.service';

@Module({
  controllers: [UploadsController],
  providers: [CloudinaryService, LocalFileService],
})
export class UploadsModule {}

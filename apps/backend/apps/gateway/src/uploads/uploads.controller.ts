import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';

const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const DOCUMENT_MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const VIDEO_MAX_BYTES = 200 * 1024 * 1024; // 200 MB

const IMAGE_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const DOCUMENT_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);
const VIDEO_MIME = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);

  constructor(private readonly cloudinary: CloudinaryService) {}

  /** Sube una imagen (portada de curso, etc.) a Cloudinary y devuelve { url } */
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    this.validate(file, IMAGE_MIME, IMAGE_MAX_BYTES, 'Usa PNG, JPG, WEBP o GIF.', '5 MB');
    return this.upload(() => this.cloudinary.uploadImage(file!.buffer), 'la imagen');
  }

  /** Sube un documento de lección (PDF, Word, PowerPoint) a Cloudinary y devuelve { url } */
  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file?: Express.Multer.File) {
    this.validate(file, DOCUMENT_MIME, DOCUMENT_MAX_BYTES, 'Usa PDF, Word o PowerPoint.', '20 MB');
    return this.upload(() => this.cloudinary.uploadDocument(file!.buffer), 'el documento');
  }

  /** Sube un video de lección a Cloudinary y devuelve { url } */
  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file?: Express.Multer.File) {
    this.validate(file, VIDEO_MIME, VIDEO_MAX_BYTES, 'Usa MP4, WEBM o MOV.', '200 MB');
    return this.upload(() => this.cloudinary.uploadVideo(file!.buffer), 'el video');
  }

  private validate(
    file: Express.Multer.File | undefined,
    allowedMime: Set<string>,
    maxBytes: number,
    mimeHint: string,
    sizeHint: string,
  ): asserts file is Express.Multer.File {
    if (!file) throw new BadRequestException('No se recibió ningún archivo.');
    if (!allowedMime.has(file.mimetype)) {
      throw new BadRequestException(`Formato no soportado. ${mimeHint}`);
    }
    if (file.size > maxBytes) {
      throw new BadRequestException(`El archivo no debe superar ${sizeHint}.`);
    }
  }

  private async upload(fn: () => Promise<string>, label: string): Promise<{ url: string }> {
    try {
      const url = await fn();
      return { url };
    } catch (error) {
      this.logger.error('Cloudinary upload failed', error instanceof Error ? error.stack : error);
      throw new InternalServerErrorException(
        `No se pudo subir ${label} a Cloudinary. Verifica CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET en tu .env.`,
      );
    }
  }
}

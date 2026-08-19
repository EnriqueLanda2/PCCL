import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { S3StorageService } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  constructor(private readonly storage: S3StorageService) {}

  /** Sube una imagen (portada de curso, etc.) a S3 y devuelve { url } */
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file?: Express.Multer.File) {
    this.validate(file, IMAGE_MIME, IMAGE_MAX_BYTES, 'Usa PNG, JPG, WEBP o GIF.', '5 MB');
    return this.upload(
      () => this.storage.uploadPublic(file!.buffer, file!.originalname, file!.mimetype, 'image'),
      'la imagen',
    );
  }

  /** Sube un documento de lección (PDF, Word, PowerPoint) a S3 y devuelve { url } */
  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file: Express.Multer.File | undefined) {
    this.validate(file, DOCUMENT_MIME, DOCUMENT_MAX_BYTES, 'Usa PDF, Word o PowerPoint.', '20 MB');
    const url = await this.storage.uploadPublic(file.buffer, file.originalname, file.mimetype, 'document');
    return { url, fileName: file.originalname, mimeType: file.mimetype };
  }

  /** Sube un video de lección a S3 y devuelve { url } */
  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File | undefined) {
    this.validate(file, VIDEO_MIME, VIDEO_MAX_BYTES, 'Usa MP4, WEBM o MOV.', '200 MB');
    const url = await this.storage.uploadPublic(file.buffer, file.originalname, file.mimetype, 'video');
    return { url, fileName: file.originalname, mimeType: file.mimetype };
  }

  /** Proxy para previsualizar documentos remotos con URL pública o firmada. */
  @Get('preview')
  async preview(@Query('url') url: string | undefined, @Res() res: Response) {
    if (!url) throw new BadRequestException('Falta la URL del documento.');
    if (!/^https?:\/\//i.test(url)) throw new BadRequestException('URL inválida.');

    const targetUrl = await this.storage.signDownloadFromUrl(url).catch(() => url);
    const upstream = await fetch(targetUrl);
    if (!upstream.ok) throw new BadRequestException('No se pudo leer el documento remoto.');

    const buffer = Buffer.from(await upstream.arrayBuffer());
    const isPdf = buffer.subarray(0, 5).toString('utf8') === '%PDF-';
    const contentType = isPdf
      ? 'application/pdf'
      : upstream.headers.get('content-type') || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', String(buffer.length));
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Disposition', 'inline; filename="documento.pdf"');
    res.send(buffer);
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
      this.logger.error('S3 upload failed', error instanceof Error ? error.stack : error);
      throw new InternalServerErrorException(
        `No se pudo subir ${label} a S3. Verifica AWS_REGION y AWS_S3_BUCKET en tu .env.`,
      );
    }
  }
}

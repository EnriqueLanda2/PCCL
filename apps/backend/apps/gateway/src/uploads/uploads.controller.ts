import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';
import { LocalFileService } from './local-file.service';

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

  constructor(
    private readonly cloudinary: CloudinaryService,
    private readonly localFiles: LocalFileService,
  ) {}

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
  async uploadDocument(@UploadedFile() file: Express.Multer.File | undefined, @Req() req: Request) {
    this.validate(file, DOCUMENT_MIME, DOCUMENT_MAX_BYTES, 'Usa PDF, Word o PowerPoint.', '20 MB');
    const saved = await this.localFiles.save(file);
    return { url: this.fileUrl(req, saved.fileName), fileName: saved.originalName, mimeType: saved.mimeType };
  }

  /** Sube un video de lección a Cloudinary y devuelve { url } */
  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File | undefined, @Req() req: Request) {
    this.validate(file, VIDEO_MIME, VIDEO_MAX_BYTES, 'Usa MP4, WEBM o MOV.', '200 MB');
    const saved = await this.localFiles.save(file);
    return { url: this.fileUrl(req, saved.fileName), fileName: saved.originalName, mimeType: saved.mimeType };
  }

  /** Sirve archivos locales con MIME y Content-Disposition correctos para visor inline. */
  @Get('files/:fileName')
  async getFile(
    @Param('fileName') fileName: string,
    @Query('download') download: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const file = await this.localFiles.open(fileName);
    const range = req.headers.range;
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename="${encodeURIComponent(file.fileName)}"`);

    if (range && file.mimeType.startsWith('video/')) {
      const [startText, endText] = range.replace(/bytes=/, '').split('-');
      const start = Number.parseInt(startText, 10);
      const end = endText ? Number.parseInt(endText, 10) : file.size - 1;
      if (!Number.isNaN(start) && !Number.isNaN(end) && start <= end) {
        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${file.size}`);
        res.setHeader('Content-Length', String(end - start + 1));
        createReadStream(file.path, { start, end }).pipe(res);
        return;
      }
    }

    res.setHeader('Content-Length', String(file.size));
    file.stream.pipe(res);
  }

  /** Proxy para documentos remotos legacy, p. ej. Cloudinary raw sin extensión/MIME. */
  @Get('preview')
  async preview(@Query('url') url: string | undefined, @Res() res: Response) {
    if (!url) throw new BadRequestException('Falta la URL del documento.');
    if (!/^https?:\/\//i.test(url)) throw new BadRequestException('URL inválida.');

    const upstream = await fetch(url);
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
      this.logger.error('Cloudinary upload failed', error instanceof Error ? error.stack : error);
      throw new InternalServerErrorException(
        `No se pudo subir ${label} a Cloudinary. Verifica CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET en tu .env.`,
      );
    }
  }

  private fileUrl(req: Request, fileName: string): string {
    return `${req.protocol}://${req.get('host')}/uploads/files/${encodeURIComponent(fileName)}`;
  }
}

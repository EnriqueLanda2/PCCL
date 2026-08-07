import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { createReadStream } from 'fs';
import { mkdir, stat, writeFile } from 'fs/promises';
import { basename, extname, join } from 'path';
import { randomUUID } from 'crypto';

const MIME_BY_EXTENSION: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
};

function safeName(originalName: string): string {
  return basename(originalName)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'archivo';
}

@Injectable()
export class LocalFileService {
  private readonly root = join(process.cwd(), 'storage', 'uploads');

  async save(file: Express.Multer.File): Promise<{ fileName: string; originalName: string; mimeType: string }> {
    await mkdir(this.root, { recursive: true });
    const originalName = safeName(file.originalname);
    const extension = extname(originalName).toLowerCase();
    const base = originalName.slice(0, Math.max(0, originalName.length - extension.length));
    const fileName = `${randomUUID()}-${base}${extension}`;
    const target = join(this.root, fileName);

    try {
      await writeFile(target, file.buffer);
      return {
        fileName,
        originalName,
        mimeType: file.mimetype || MIME_BY_EXTENSION[extension] || 'application/octet-stream',
      };
    } catch {
      throw new InternalServerErrorException('No se pudo guardar el archivo localmente.');
    }
  }

  async open(fileName: string) {
    const safeFileName = basename(fileName);
    const path = join(this.root, safeFileName);
    try {
      const info = await stat(path);
      return {
        stream: createReadStream(path),
        path,
        size: info.size,
        fileName: safeFileName,
        mimeType: MIME_BY_EXTENSION[extname(safeFileName).toLowerCase()] || 'application/octet-stream',
      };
    } catch {
      throw new NotFoundException('Archivo no encontrado.');
    }
  }
}

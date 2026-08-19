import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { extname } from 'path';

type UploadKind = 'image' | 'document' | 'video' | 'certificate';

const DEFAULT_PREFIX: Record<UploadKind, string> = {
  image: 'courses/images',
  document: 'lessons/documents',
  video: 'lessons/videos',
  certificate: 'certificates',
};

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'file';
}

@Injectable()
export class S3StorageService {
  private readonly bucket: string;
  private readonly region: string;
  private readonly publicBaseUrl: string;
  private readonly client: S3Client;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.require('AWS_S3_BUCKET');
    this.region = this.require('AWS_REGION');
    this.publicBaseUrl =
      this.config.get<string>('AWS_S3_PUBLIC_BASE_URL')?.trim().replace(/\/+$/, '') ||
      `https://${this.bucket}.s3.${this.region}.amazonaws.com`;

    this.client = new S3Client({
      region: this.region,
      credentials:
        this.config.get<string>('AWS_ACCESS_KEY_ID') && this.config.get<string>('AWS_SECRET_ACCESS_KEY')
          ? {
              accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID')!,
              secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY')!,
            }
          : undefined,
    });
  }

  async uploadPublic(
    buffer: Buffer,
    originalName: string,
    contentType: string,
    kind: UploadKind,
    options?: { prefix?: string; publicId?: string; cacheControl?: string },
  ): Promise<string> {
    const extension = extname(originalName).toLowerCase();
    const safeName = normalizeName(originalName);
    const base = options?.publicId
      ? normalizeName(options.publicId)
      : `${randomUUID()}-${safeName.slice(0, Math.max(0, safeName.length - extension.length))}`;
    const key = `${(options?.prefix ?? DEFAULT_PREFIX[kind]).replace(/^\/+|\/+$/g, '')}/${base}${extension}`;

    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
      CacheControl: options?.cacheControl ?? 'public, max-age=31536000, immutable',
    }));

    return `${this.publicBaseUrl}/${encodeURI(key).replace(/#/g, '%23')}`;
  }

  async signDownloadFromUrl(url: string, expiresInSeconds = 900): Promise<string> {
    const key = this.keyFromUrl(url);
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn: expiresInSeconds },
    );
  }

  async deleteByUrl(url: string): Promise<void> {
    const key = this.keyFromUrl(url);
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  private keyFromUrl(url: string): string {
    if (!url.startsWith(this.publicBaseUrl)) {
      throw new InternalServerErrorException('La URL no pertenece al bucket configurado.');
    }
    return decodeURIComponent(url.slice(this.publicBaseUrl.length + 1));
  }

  private require(name: string): string {
    const value = this.config.get<string>(name)?.trim();
    if (!value) {
      throw new InternalServerErrorException(`Falta configurar ${name} para usar S3.`);
    }
    return value;
  }
}

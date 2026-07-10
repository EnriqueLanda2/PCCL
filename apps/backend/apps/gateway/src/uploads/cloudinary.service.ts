import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /** Sube un buffer de imagen a Cloudinary y devuelve la URL segura (https) resultante */
  uploadImage(buffer: Buffer, folder = 'pccl/courses'): Promise<string> {
    return this.uploadBuffer(buffer, 'image', folder);
  }

  /** Sube un buffer de video a Cloudinary y devuelve la URL segura (https) resultante */
  uploadVideo(buffer: Buffer, folder = 'pccl/lessons/videos'): Promise<string> {
    return this.uploadBuffer(buffer, 'video', folder);
  }

  /** Sube un buffer de documento (PDF, DOCX, etc.) a Cloudinary y devuelve la URL segura (https) resultante */
  uploadDocument(buffer: Buffer, folder = 'pccl/lessons/documents'): Promise<string> {
    return this.uploadBuffer(buffer, 'raw', folder);
  }

  private uploadBuffer(buffer: Buffer, resourceType: 'image' | 'video' | 'raw', folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: resourceType },
        (error, result?: UploadApiResponse) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary no devolvió resultado.'));
            return;
          }
          resolve(result.secure_url);
        },
      );
      stream.end(buffer);
    });
  }
}

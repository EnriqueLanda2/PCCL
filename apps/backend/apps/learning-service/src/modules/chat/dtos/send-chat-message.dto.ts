import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class SendChatMessageDto {
  @IsString() @MinLength(1) message!: string;
  /** Solo importa cuando se crea una conversación nueva (sin conversationId). */
  @IsOptional() @IsUUID() lessonId?: string;
  /** Si se omite, se crea una conversación nueva. */
  @IsOptional() @IsUUID() conversationId?: string;
}

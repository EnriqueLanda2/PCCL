import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LEARNING_PATTERNS } from '@app/contracts';
import { ChatService } from './chat.service';
import { SendChatMessageDto } from './dtos/send-chat-message.dto';

@Controller()
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @MessagePattern(LEARNING_PATTERNS.CHAT_SEND)
  send(@Payload() p: { dto: SendChatMessageDto; userId: string; roles?: string[] }) {
    return this.service.send(p.dto, p.userId, p.roles);
  }

  @MessagePattern(LEARNING_PATTERNS.CHAT_FIND_HISTORY)
  findHistory(@Payload() p: { userId: string; conversationId: string }) {
    return this.service.findHistory(p.userId, p.conversationId);
  }

  @MessagePattern(LEARNING_PATTERNS.CHAT_CLEAR_HISTORY)
  clearHistory(@Payload() p: { userId: string; conversationId: string }) {
    return this.service.clearHistory(p.userId, p.conversationId);
  }

  @MessagePattern(LEARNING_PATTERNS.CHAT_LIST_CONVERSATIONS)
  listConversations(@Payload() p: { userId: string }) {
    return this.service.listConversations(p.userId);
  }

  @MessagePattern(LEARNING_PATTERNS.CHAT_DELETE_FROM)
  deleteFrom(@Payload() p: { userId: string; messageId: string }) {
    return this.service.deleteFrom(p.userId, p.messageId);
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IDENTITY_PATTERNS, PushNotifyUsersPayload, PushTokenRegisterPayload } from '@app/contracts';
import { PushService } from './push.service';

@Controller()
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @MessagePattern(IDENTITY_PATTERNS.PUSH_TOKEN_REGISTER)
  register(@Payload() payload: PushTokenRegisterPayload) {
    return this.pushService.registerToken(payload.userId, payload.token);
  }

  @MessagePattern(IDENTITY_PATTERNS.PUSH_NOTIFY_USERS)
  notify(@Payload() payload: PushNotifyUsersPayload) {
    return this.pushService.notifyUsers(payload.userIds, payload.title, payload.body);
  }

  @MessagePattern(IDENTITY_PATTERNS.NOTIFICATION_FIND_ALL)
  findAll(@Payload() payload: { userId: string }) {
    return this.pushService.findForUser(payload.userId);
  }

  @MessagePattern(IDENTITY_PATTERNS.NOTIFICATION_UNREAD_COUNT)
  unreadCount(@Payload() payload: { userId: string }) {
    return this.pushService.unreadCount(payload.userId);
  }

  @MessagePattern(IDENTITY_PATTERNS.NOTIFICATION_MARK_READ)
  markRead(@Payload() payload: { userId: string; id: string }) {
    return this.pushService.markRead(payload.userId, payload.id);
  }

  @MessagePattern(IDENTITY_PATTERNS.NOTIFICATION_MARK_ALL_READ)
  markAllRead(@Payload() payload: { userId: string }) {
    return this.pushService.markAllRead(payload.userId);
  }
}

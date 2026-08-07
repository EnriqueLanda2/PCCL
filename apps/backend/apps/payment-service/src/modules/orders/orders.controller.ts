import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  PAYMENT_PATTERNS,
  OrderCreatePayload,
  EarningsByCoursePayload,
  OrderFindOnePayload,
  StripeWebhookPayload,
} from '@app/contracts';
import { OrdersService } from './orders.service';

@Controller()
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @MessagePattern(PAYMENT_PATTERNS.ORDER_CREATE)
  create(@Payload() p: OrderCreatePayload) {
    return this.service.create(p);
  }

  @MessagePattern(PAYMENT_PATTERNS.ORDER_FIND_ONE)
  findOne(@Payload() p: OrderFindOnePayload) {
    return this.service.findOne(p.id, p.userId);
  }

  @MessagePattern(PAYMENT_PATTERNS.EARNINGS_BY_COURSE)
  earningsByCourse(@Payload() p: EarningsByCoursePayload) {
    return this.service.earningsByCourse(p);
  }

  @MessagePattern(PAYMENT_PATTERNS.WEBHOOK_STRIPE)
  handleWebhook(@Payload() p: StripeWebhookPayload) {
    return this.service.handleStripeWebhook(p);
  }
}

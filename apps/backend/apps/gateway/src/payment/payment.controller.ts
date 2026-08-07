import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { PAYMENT_PATTERNS } from '@app/contracts';
import { PAYMENT_CLIENT } from '@app/messaging';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/interfaces/request-user.interface';

@Controller('payments')
export class PaymentController {
  constructor(@Inject(PAYMENT_CLIENT) private readonly client: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post('orders')
  createOrder(
    @Body() dto: { courseId: string; accessType?: 'monthly' | 'permanent' },
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(PAYMENT_PATTERNS.ORDER_CREATE, {
        courseId: dto.courseId,
        accessType: dto.accessType,
        userId: u.sub,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  findOrder(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(PAYMENT_PATTERNS.ORDER_FIND_ONE, { id, userId: u.sub }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('earnings/courses')
  earningsByCourse(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(PAYMENT_PATTERNS.EARNINGS_BY_COURSE, {
        requesterEmail: u.email,
        roles: u.roles ?? [],
      }),
    );
  }

  @Public()
  @Post('webhook/stripe')
  handleStripeWebhook(@Req() req: RawBodyRequest<Request>) {
    const signature = req.headers['stripe-signature'];
    if (!req.rawBody || typeof signature !== 'string') {
      throw new BadRequestException('Webhook inválido');
    }
    return firstValueFrom(
      this.client.send(PAYMENT_PATTERNS.WEBHOOK_STRIPE, {
        rawBody: req.rawBody.toString('utf8'),
        signature,
      }),
    );
  }
}

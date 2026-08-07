import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { StripeService } from '../../stripe/stripe.service';

@Module({
  providers: [OrdersService, StripeService],
  controllers: [OrdersController],
})
export class OrdersModule {}

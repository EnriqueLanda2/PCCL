import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  readonly client: Stripe;
  readonly webhookSecret: string;
  private readonly secretKey: string;

  constructor(config: ConfigService) {
    this.secretKey = config.get<string>('STRIPE_SECRET_KEY', '');
    this.client = new Stripe(this.secretKey || 'sk_missing');
    this.webhookSecret = config.get<string>('STRIPE_WEBHOOK_SECRET', '');
  }

  get isConfigured(): boolean {
    return Boolean(this.secretKey);
  }
}

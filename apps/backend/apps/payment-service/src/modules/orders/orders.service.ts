import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import Stripe from 'stripe';
import {
  LEARNING_PATTERNS,
  OrderCreatePayload,
  EarningsByCoursePayload,
  StripeWebhookPayload,
  PAYMENT_PATTERNS,
  CourseAccessType,
  OrderSource,
} from '@app/contracts';
import { LEARNING_CLIENT, PAYMENT_CLIENT } from '@app/messaging';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeService } from '../../stripe/stripe.service';

interface CourseSnapshot {
  id: string;
  title?: string;
  createdBy?: string | null;
  price: string | number;
  currency: string;
  isFree: boolean;
}

const ACCESS_TYPES = new Set<CourseAccessType>(['monthly', 'permanent']);
const ORDER_SOURCES = new Set<OrderSource>(['organic', 'instructor_referral', 'site_promo']);

function normalizeAccessType(value: string | undefined): CourseAccessType {
  return ACCESS_TYPES.has(value as CourseAccessType) ? (value as CourseAccessType) : 'permanent';
}

function normalizeSource(value: string | undefined): OrderSource {
  return ORDER_SOURCES.has(value as OrderSource) ? (value as OrderSource) : 'organic';
}

/** Plataforma se queda 25% en ventas orgánicas, 50% cuando vienen de un
    enlace de referido del instructor o de una promoción del sitio. El resto
    es para el instructor. Redondeo a centavos con el mismo criterio en
    ambos montos para que siempre sumen exactamente `amount`. */
function splitCommission(amount: number, source: OrderSource): { platformAmount: number; instructorAmount: number } {
  const platformShare = source === 'organic' ? 0.25 : 0.5;
  const platformAmount = Math.round(amount * platformShare * 100) / 100;
  const instructorAmount = Math.round((amount - platformAmount) * 100) / 100;
  return { platformAmount, instructorAmount };
}

function addOneMonth(date: Date) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  return next;
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeService,
    @Inject(LEARNING_CLIENT) private readonly learningClient: ClientProxy,
    @Inject(PAYMENT_CLIENT) private readonly paymentClient: ClientProxy,
  ) {}

  async create(payload: OrderCreatePayload) {
    if (!this.stripe.isConfigured) {
      throw new ServiceUnavailableException(
        'La pasarela de pagos no está configurada (falta STRIPE_SECRET_KEY)',
      );
    }

    const course = await firstValueFrom<CourseSnapshot | null>(
      this.learningClient.send(LEARNING_PATTERNS.COURSE_FIND_ONE, {
        id: payload.courseId,
      }),
    ).catch(() => null);

    if (!course) throw new NotFoundException('Curso no encontrado');

    const baseAmount = Number(course.price);
    if (course.isFree || baseAmount <= 0) {
      throw new BadRequestException('Este curso es gratuito, no requiere pago');
    }
    const accessType = normalizeAccessType(payload.accessType);
    const amount = accessType === 'monthly' ? Math.round((baseAmount / 3) * 100) / 100 : baseAmount;
    const source = normalizeSource(payload.source);
    const { platformAmount, instructorAmount } = splitCommission(amount, source);
    const now = new Date();
    const accessEndsAt = accessType === 'monthly' ? addOneMonth(now) : null;

    const paidAccessWhere = accessType === 'permanent'
      ? { accessType: 'permanent' }
      : {
          OR: [
            { accessType: 'permanent' },
            { accessType: 'monthly', accessEndsAt: { gt: now } },
          ],
        };

    const paid = await this.prisma.order.findFirst({
      where: {
        userId: payload.userId,
        courseId: payload.courseId,
        status: 'paid',
        ...paidAccessWhere,
      },
    });
    if (paid) {
      return {
        orderId: paid.id,
        clientSecret: null,
        amount: paid.amount,
        currency: paid.currency,
        status: 'paid',
        accessType: paid.accessType,
        accessEndsAt: paid.accessEndsAt?.toISOString() ?? null,
      };
    }

    const pending = await this.prisma.order.findFirst({
      where: { userId: payload.userId, courseId: payload.courseId, accessType, status: 'pending' },
    });
    if (pending?.providerPaymentIntentId) {
      /* Reconciliar ANTES de reutilizar: si el intent de esta orden ya había
         quedado `succeeded` en Stripe (webhook caído, o un intento previo que
         el usuario no vio confirmarse), reutilizar su `client_secret` monta
         el Payment Element sobre un PaymentIntent muerto y Stripe rechaza
         cualquier confirm con un error genérico de procesamiento. */
      const reconciled = await this.reconcilePendingOrder(pending.id, pending.providerPaymentIntentId);
      if (reconciled.status === 'paid') {
        return {
          orderId: reconciled.id,
          clientSecret: null,
          amount: reconciled.amount,
          currency: reconciled.currency,
          status: 'paid',
          accessType: reconciled.accessType,
          accessEndsAt: reconciled.accessEndsAt?.toISOString() ?? null,
        };
      }
      if (reconciled.status === 'pending' && reconciled.providerPaymentIntentId) {
        const intent = await this.stripe.client.paymentIntents.retrieve(
          reconciled.providerPaymentIntentId,
        );
        return {
          orderId: reconciled.id,
          clientSecret: intent.client_secret,
          amount: reconciled.amount,
          currency: reconciled.currency,
          status: reconciled.status,
          accessType: reconciled.accessType,
          accessEndsAt: reconciled.accessEndsAt?.toISOString() ?? null,
        };
      }
      /* status === 'failed': se descarta el intent muerto y se cae al bloque
         de abajo, que crea uno nuevo. */
    }

    const intent = await this.stripe.client.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: course.currency.toLowerCase(),
      metadata: { courseId: course.id, userId: payload.userId, accessType },
    });

    const order = await this.prisma.order.create({
      data: {
        userId: payload.userId,
        courseId: payload.courseId,
        amount,
        currency: course.currency,
        accessType,
        accessEndsAt,
        startDate: now,
        endDate: accessEndsAt,
        provider: 'stripe',
        providerPaymentIntentId: intent.id,
        source,
        platformAmount,
        instructorAmount,
        createdBy: payload.userId,
        updatedBy: payload.userId,
      },
    });

    return {
      orderId: order.id,
      clientSecret: intent.client_secret,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      accessType: order.accessType,
      accessEndsAt: order.accessEndsAt?.toISOString() ?? null,
    };
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order || order.userId !== userId) {
      throw new NotFoundException('Orden no encontrada');
    }
    if (order.status !== 'pending' || !order.providerPaymentIntentId) return order;
    return this.reconcilePendingOrder(order.id, order.providerPaymentIntentId);
  }

  /**
   * Red de seguridad para cuando el webhook de Stripe no llega (dev sin
   * `stripe listen`, caída puntual del webhook en prod, o un reintento de
   * confirm sobre un PaymentIntent que en Stripe ya había quedado
   * `succeeded`). El polling del frontend llama a `findOne` mientras la
   * orden sigue `pending`; acá se consulta el estado real en Stripe y se
   * reconcilia con la misma lógica idempotente del webhook.
   */
  private async reconcilePendingOrder(orderId: string, paymentIntentId: string) {
    if (this.stripe.isConfigured) {
      try {
        const intent = await this.stripe.client.paymentIntents.retrieve(paymentIntentId);
        if (intent.status === 'succeeded') {
          await this.onPaymentIntentSucceeded(intent);
        } else if (intent.status === 'canceled' || intent.last_payment_error) {
          await this.onPaymentIntentFailed(intent);
        }
      } catch {
        // Stripe no disponible en este instante: se devuelve el estado
        // actual y el próximo poll del frontend lo vuelve a intentar.
      }
    }
    return this.prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  }

  async earningsByCourse(payload: EarningsByCoursePayload) {
    const isAdmin = payload.roles?.includes('admin') ?? false;
    const paidOrders = await this.prisma.order.groupBy({
      by: ['courseId', 'currency'],
      where: { status: 'paid' },
      _count: { _all: true },
      _sum: { amount: true, platformAmount: true, instructorAmount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const rows = await Promise.all(
      paidOrders.map(async (order) => {
        const course = await firstValueFrom<CourseSnapshot | null>(
          this.learningClient.send(LEARNING_PATTERNS.COURSE_FIND_ONE, {
            id: order.courseId,
          }),
        ).catch(() => null);

        if (!course) return null;
        if (!isAdmin && course.createdBy !== payload.requesterEmail) return null;

        return {
          courseId: order.courseId,
          courseTitle: course.title ?? 'Curso sin título',
          instructorEmail: course.createdBy ?? null,
          salesCount: order._count._all,
          grossRevenue: Number(order._sum.amount ?? 0),
          platformRevenue: Number(order._sum.platformAmount ?? 0),
          instructorRevenue: Number(order._sum.instructorAmount ?? 0),
          currency: order.currency,
        };
      }),
    );

    return rows.filter((row): row is NonNullable<typeof row> => Boolean(row));
  }

  async handleStripeWebhook(payload: StripeWebhookPayload) {
    if (!this.stripe.isConfigured || !this.stripe.webhookSecret) {
      throw new ServiceUnavailableException(
        'La pasarela de pagos no está configurada (falta STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET)',
      );
    }

    const event = this.stripe.client.webhooks.constructEvent(
      payload.rawBody,
      payload.signature,
      this.stripe.webhookSecret,
    );

    if (event.type === 'payment_intent.succeeded') {
      await this.onPaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
    } else if (event.type === 'payment_intent.payment_failed') {
      await this.onPaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
    }

    return { received: true };
  }

  private async onPaymentIntentSucceeded(intent: Stripe.PaymentIntent) {
    const order = await this.prisma.order.findUnique({
      where: { providerPaymentIntentId: intent.id },
    });
    if (!order || order.status === 'paid') return; // idempotente: ya procesado o desconocido

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'paid', updatedBy: 'stripe-webhook' },
    });
    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        providerPaymentId: intent.id,
        status: 'succeeded',
        paidAt: new Date(),
        rawPayload: intent as unknown as object,
        createdBy: 'stripe-webhook',
        updatedBy: 'stripe-webhook',
      },
    });

    this.paymentClient.emit(PAYMENT_PATTERNS.EVT_PAYMENT_COMPLETED, {
      orderId: order.id,
      userId: order.userId,
      courseId: order.courseId,
      accessType: order.accessType,
      accessEndsAt: order.accessEndsAt?.toISOString() ?? null,
    });
  }

  private async onPaymentIntentFailed(intent: Stripe.PaymentIntent) {
    const order = await this.prisma.order.findUnique({
      where: { providerPaymentIntentId: intent.id },
    });
    if (!order || order.status === 'paid') return;

    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'failed', updatedBy: 'stripe-webhook' },
    });

    this.paymentClient.emit(PAYMENT_PATTERNS.EVT_PAYMENT_FAILED, {
      orderId: order.id,
      userId: order.userId,
      courseId: order.courseId,
    });
  }
}

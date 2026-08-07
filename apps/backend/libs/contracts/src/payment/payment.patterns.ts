export const PAYMENT_PATTERNS = {
  ORDER_CREATE: 'payment.order.create',
  ORDER_FIND_ONE: 'payment.order.find_one',
  EARNINGS_BY_COURSE: 'payment.earnings.by_course',
  WEBHOOK_STRIPE: 'payment.webhook.stripe',

  EVT_PAYMENT_COMPLETED: 'payment.payment.completed',
  EVT_PAYMENT_FAILED: 'payment.payment.failed',
} as const;

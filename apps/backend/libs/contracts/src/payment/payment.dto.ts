export type CourseAccessType = 'monthly' | 'permanent';

/** De dónde vino la venta — determina el reparto de comisión.
    'organic': 25% plataforma / 75% instructor (default).
    'instructor_referral' | 'site_promo': 50% / 50%. */
export type OrderSource = 'organic' | 'instructor_referral' | 'site_promo';

export interface OrderCreatePayload {
  userId: string;
  courseId: string;
  accessType?: CourseAccessType;
  source?: OrderSource;
}

export interface OrderFindOnePayload {
  id: string;
  userId: string;
}

export interface EarningsByCoursePayload {
  requesterEmail: string;
  roles?: string[];
}

export interface CourseEarnings {
  courseId: string;
  courseTitle: string;
  instructorEmail: string | null;
  salesCount: number;
  grossRevenue: number;
  /** Comisión de la plataforma sobre `grossRevenue` (25% o 50% según `source` de cada venta). */
  platformRevenue: number;
  /** Lo que le corresponde al instructor sobre `grossRevenue`. */
  instructorRevenue: number;
  currency: string;
}

export interface StripeWebhookPayload {
  rawBody: string;
  signature: string;
}

export interface PaymentCompletedEvent {
  orderId: string;
  userId: string;
  courseId: string;
  accessType?: CourseAccessType;
  accessEndsAt?: string | null;
}

export interface PaymentFailedEvent {
  orderId: string;
  userId: string;
  courseId: string;
}

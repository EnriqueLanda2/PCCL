export type CourseAccessType = 'monthly' | 'permanent';

export interface OrderCreatePayload {
  userId: string;
  courseId: string;
  accessType?: CourseAccessType;
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

import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

// Se inlinea en build: debe leerse como acceso estático, no vía variable.
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

export const isStripeConfigured = Boolean(PUBLISHABLE_KEY);

/** Singleton — Stripe.js solo debe cargarse una vez por sesión de navegador. */
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(PUBLISHABLE_KEY);
  }
  return stripePromise;
}

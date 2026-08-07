/* ───────────────────────────────────────────
   CheckoutModal — pago de un curso con costo
   Crea una Order (PaymentIntent de Stripe) al
   abrir, embebe el Payment Element de Stripe
   con la identidad visual de PCCL, confirma el
   pago y espera la confirmación del webhook
   (polling corto) antes de dar acceso al curso.
   ─────────────────────────────────────────── */

'use client';

import { useEffect, useState } from 'react';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { Appearance } from '@stripe/stripe-js';
import { api, getErrorMessage } from '@/lib/api';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import type { Course } from '@/lib/types';
import { Modal } from '@/app/components/ui/Modal';
import { Card } from '@/app/components/ui/Card';
import { WaveSpinner } from '@/app/components/ui/WaveSpinner';

const APPEARANCE: Appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#1E8B48',
    colorBackground: '#F8FBF5',
    colorText: '#17324D',
    colorTextSecondary: '#97A3B2',
    colorDanger: '#BF2600',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    /* En px a propósito: el Payment Element se pinta en un iframe propio de
       Stripe, cuya raíz sigue en 16px. Un rem aquí NO seguiría a --ui-scale y
       el formulario se vería desalineado con el resto del modal. */
    borderRadius: '16px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1px solid #DDE7D7',
      boxShadow: 'none',
      padding: '12px 16px',
    },
    '.Input:focus': {
      border: '1px solid #25A656',
      boxShadow: '0 0 0 2px #D2F2DE',
    },
    '.Label': {
      fontWeight: '500',
      color: '#17324D',
    },
  },
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('es', { style: 'currency', currency }).format(amount);
}

type CourseAccessType = 'monthly' | 'permanent';

function monthlyAmount(amount: number) {
  return Math.round((amount / 3) * 100) / 100;
}

interface CheckoutFormProps {
  orderId: string;
  amount: number;
  currency: string;
  onPaid: () => void;
}

function CheckoutForm({ orderId, amount, currency, onPaid }: Readonly<CheckoutFormProps>) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const waitForPaidOrder = async () => {
    setConfirming(true);
    for (let attempt = 0; attempt < 10; attempt++) {
      await new Promise((r) => setTimeout(r, 1500));
      try {
        const order = await api.getOrder(orderId);
        if (order.status === 'paid') {
          onPaid();
          return;
        }
        if (order.status === 'failed') {
          setError('El pago fue rechazado. Intenta con otro método.');
          setConfirming(false);
          return;
        }
      } catch {
        // sigue intentando
      }
    }
    setError('No pudimos confirmar el pago todavía. Verifica tu correo o intenta de nuevo.');
    setConfirming(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !elementReady) {
      setError('El formulario de pago todavía está cargando. Espera unos segundos e intenta de nuevo.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const submitResult = await elements.submit();
      if (submitResult.error) {
        setError(submitResult.error.message ?? 'Revisa los datos de pago.');
        setSubmitting(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });
      if (confirmError) {
        setError(confirmError.message ?? 'No se pudo procesar el pago.');
        setSubmitting(false);
        return;
      }
      if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
        await waitForPaidOrder();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || confirming;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement
        onReady={() => setElementReady(true)}
        onLoadError={(event) => setError(event.error.message ?? 'No se pudo cargar el formulario de pago.')}
      />

      {error && (
        <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{error}</p>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || busy || !elementReady}
        startIcon={busy ? <CircularProgress size={16} color="inherit" /> : undefined}
        sx={{
          borderRadius: '999px',
          bgcolor: 'var(--green-600)',
          py: 1.15,
          fontFamily: 'var(--font-sans)',
          fontWeight: 800,
          textTransform: 'none',
          boxShadow: '0 12px 24px rgba(30,139,72,0.18)',
          '&:hover': { bgcolor: 'var(--green-700)' },
        }}
      >
        {confirming ? 'Confirmando pago…' : elementReady ? `Pagar ${formatMoney(amount, currency)}` : 'Cargando formulario…'}
      </Button>
    </form>
  );
}

interface CheckoutModalProps {
  open: boolean;
  course: Course;
  onClose: () => void;
  onPaid: () => void;
}

export function CheckoutModal({ open, course, onClose, onPaid }: Readonly<CheckoutModalProps>) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessType, setAccessType] = useState<CourseAccessType>('permanent');

  const amount = course.price ?? 0;
  const currency = course.currency ?? 'USD';
  const selectedAmount = accessType === 'monthly' ? monthlyAmount(amount) : amount;

  useEffect(() => {
    /* Sin clave publicable no se pide la orden: el Payment Element no podría
       montarse igual. El aviso se deriva en el render, no con setState aquí. */
    if (!open || !isStripeConfigured) return;
    let alive = true;
    const timer = window.setTimeout(() => {
      if (!alive) return;
      setOrderId(null);
      setClientSecret(null);
      setError(null);
      setLoading(true);
      api
        .createOrder(course.id, accessType)
        .then((order) => {
          if (!alive) return;
          if (order.status === 'paid') {
            onPaid();
            return;
          }
          setOrderId(order.orderId);
          setClientSecret(order.clientSecret);
        })
        .catch((err) => { if (alive) setError(getErrorMessage(err)); })
        .finally(() => { if (alive) setLoading(false); });
    }, 0);
    return () => { alive = false; window.clearTimeout(timer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, course.id, accessType]);

  /* Estado derivado: la falta de configuración no depende de nada asíncrono. */
  const shownError = isStripeConfigured
    ? error
    : 'Falta configurar NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en el frontend.';

  return (
    <Modal open={open} onClose={onClose} title="Comprar curso" description="Pago seguro procesado por Stripe.">
      <div className="flex flex-col gap-4">
        <Card variant="accent" padding="tight">
          <p className="text-sm font-medium text-[var(--ink)]">{course.title}</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--green-700,#166534)]">
            {formatMoney(selectedAmount, currency)}
          </p>
          <p className="mt-1 text-xs text-[var(--ink-muted)]">
            {accessType === 'monthly'
              ? `Acceso por 1 mes · precio mensual = 1/3 de ${formatMoney(amount, currency)}`
              : 'Acceso permanente al curso completo'}
          </p>
        </Card>

        <ToggleButtonGroup
          exclusive
          value={accessType}
          onChange={(_, value: CourseAccessType | null) => {
            if (value) setAccessType(value);
          }}
          fullWidth
          sx={{
            '& .MuiToggleButton-root': {
              borderRadius: '16px',
              borderColor: '#DDE7D7',
              color: 'var(--ink)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              textTransform: 'none',
              py: 1.25,
            },
            '& .MuiToggleButton-root.Mui-selected': {
              bgcolor: 'var(--green-50)',
              color: 'var(--green-700)',
              borderColor: 'var(--green-400)',
            },
          }}
        >
          <ToggleButton value="monthly">
            Mensual · {formatMoney(monthlyAmount(amount), currency)}
          </ToggleButton>
          <ToggleButton value="permanent">
            Completo · {formatMoney(amount, currency)}
          </ToggleButton>
        </ToggleButtonGroup>

        {loading && (
          <div className="flex justify-center py-6"><WaveSpinner size="sm" /></div>
        )}

        {shownError && (
          <p className="rounded-xl bg-[#FFF1ED] px-3.5 py-2.5 text-[0.8125rem] text-[#BF2600]">{shownError}</p>
        )}

        {!loading && clientSecret && orderId && (
          <Elements key={clientSecret} stripe={getStripe()} options={{ clientSecret, appearance: APPEARANCE }}>
            <CheckoutForm orderId={orderId} amount={selectedAmount} currency={currency} onPaid={onPaid} />
          </Elements>
        )}
      </div>
    </Modal>
  );
}

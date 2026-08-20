'use client';

import type React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Field, Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { appRoutes } from '@/lib/routes';
import { APP_ICONS } from '@/lib/icons';

type Step = 'request' | 'verify';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-10">
      <div className="w-full max-w-md">
        <Link
          href={appRoutes.login}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 no-underline transition-colors hover:text-neutral-800"
        >
          <Icon icon={APP_ICONS.chevronLeft} width={16} height={16} />
          Volver al inicio de sesión
        </Link>

        {step === 'request' ? (
          <RequestCodeCard
            onSent={(sentEmail) => {
              setEmail(sentEmail);
              setStep('verify');
            }}
          />
        ) : (
          <VerifyCodeCard
            email={email}
            onBack={() => setStep('request')}
            onSuccess={() => router.replace(appRoutes.login)}
          />
        )}
      </div>
    </div>
  );
}

function RequestCodeCard({ onSent }: Readonly<{ onSent: (email: string) => void }>) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email.trim());
      onSent(email.trim());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card auth-stagger rounded-2xl border border-neutral-200 bg-neutral-100 p-7 shadow-[0_12px_32px_rgba(23,50,77,0.08)] sm:p-9">
      <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center text-white mb-6 shadow-md">
        <Icon icon={APP_ICONS.lock} width={26} height={26} />
      </div>

      <h2 className="font-serif text-3xl text-neutral-900 mb-1">¿Olvidaste tu contraseña?</h2>
      <p className="text-sm text-neutral-500 mb-7">
        Ingresa tu correo y te mandamos un código para restablecerla.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Correo electrónico">
          <Input
            type="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        {error && (
          <div className="animate-fade-in bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded border-l-4 border-danger-400 leading-relaxed">
            {error}
          </div>
        )}

        <Button variant="primary" size="lg" block loading={loading} type="submit" className="mt-1">
          {loading ? 'Enviando…' : 'Enviar código'}
        </Button>
      </form>
    </div>
  );
}

function VerifyCodeCard({
  email,
  onBack,
  onSuccess,
}: Readonly<{ email: string; onBack: () => void; onSuccess: () => void }>) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(email, code.trim(), password);
      setDone(true);
      setTimeout(onSuccess, 1500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo conectar con el servidor. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-card rounded-2xl border border-neutral-200 bg-neutral-100 p-7 shadow-[0_12px_32px_rgba(23,50,77,0.08)] sm:p-9 text-center">
        <div className="w-12 h-12 rounded-lg bg-success-500 flex items-center justify-center text-white mb-6 shadow-md mx-auto">
          <Icon icon={APP_ICONS.checkFilled} width={26} height={26} />
        </div>
        <h2 className="font-serif text-2xl text-neutral-900 mb-1">Contraseña actualizada</h2>
        <p className="text-sm text-neutral-500">Te llevamos al inicio de sesión…</p>
      </div>
    );
  }

  return (
    <div className="auth-card auth-stagger rounded-2xl border border-neutral-200 bg-neutral-100 p-7 shadow-[0_12px_32px_rgba(23,50,77,0.08)] sm:p-9">
      <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center text-white mb-6 shadow-md">
        <Icon icon={APP_ICONS.key} width={26} height={26} />
      </div>

      <h2 className="font-serif text-3xl text-neutral-900 mb-1">Ingresa el código</h2>
      <p className="text-sm text-neutral-500 mb-7">
        Te lo mandamos a <strong>{email}</strong>. Vence en 15 minutos.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field label="Código de 6 dígitos">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            required
          />
        </Field>

        <Field label="Nueva contraseña" hint="Mínimo 8 caracteres">
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </Field>

        <Field label="Confirmar contraseña">
          <Input
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </Field>

        {error && (
          <div className="animate-fade-in bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded border-l-4 border-danger-400 leading-relaxed">
            {error}
          </div>
        )}

        <Button variant="primary" size="lg" block loading={loading} type="submit" className="mt-1">
          {loading ? 'Verificando…' : 'Restablecer contraseña'}
        </Button>
      </form>

      <button
        type="button"
        onClick={onBack}
        className="text-xs text-neutral-400 text-center mt-6 w-full hover:text-neutral-600 underline-offset-2 hover:underline"
      >
        ¿No te llegó? Pedir otro código
      </button>
    </div>
  );
}

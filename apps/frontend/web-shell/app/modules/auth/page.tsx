'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Field, Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api, ApiError } from '@/lib/api';
import { appRoutes } from '@/lib/routes';

/* Mapa módulo backend → ruta frontend */
const MODULE_ROUTE: Record<string, string> = {
  dashboard: appRoutes.dashboard, courses: appRoutes.courses,
  lessons: appRoutes.lessons, inscriptions: appRoutes.inscriptions,
  califications: appRoutes.califications, certificates: appRoutes.certificates,
  progress: appRoutes.progress, audit: appRoutes.audit,
  users: appRoutes.users, rbac: appRoutes.rbac,
};

function firstRoute(menu: { module: string; visible: boolean }[]): string {
  const first = menu.find((m) => m.visible && MODULE_ROUTE[m.module]);
  return first ? MODULE_ROUTE[first.module] : appRoutes.dashboard;
}

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, access } = await api.login(email, password);
      sessionStorage.setItem('pccl_user',   JSON.stringify(user));
      sessionStorage.setItem('pccl_access', JSON.stringify(access));
      router.replace(firstRoute(access.menu));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 403
          ? 'Tu cuenta está inactiva. Contacta al administrador.'
          : 'Credenciales inválidas. Verifica tu correo y contraseña.');
      } else {
        setError('No se pudo conectar con el servidor. Intenta más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: '1fr 1fr' }}>

      {/* ── Left panel — JIRA navy ── */}
      <div className="bg-neutral-900 text-white flex flex-col px-12 py-10 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -right-32 -top-24 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-32 w-80 h-80 rounded-full bg-warning-500/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <span className="font-serif text-2xl text-white font-bold tracking-tight">PCCL</span>
          <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-primary-300/80">Plataforma</span>
        </div>

        {/* Hero copy */}
        <div className="my-auto relative z-10 max-w-sm">
          <h1 className="font-serif text-4xl lg:text-5xl leading-tight text-white mb-5">
            Un espacio para <em className="text-primary-300 not-italic">enseñar</em> y aprender juntos.
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed mb-8">
            Gestiona cursos, evalúa alumnos y genera constancias — todo desde un solo lugar.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              { icon: '📚', text: 'Cursos, lecciones y evaluaciones' },
              { icon: '📊', text: 'Progreso y certificados en tiempo real' },
              { icon: '🛡️', text: 'Permisos granulares por rol' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-neutral-300">
                <span className="text-base">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-neutral-600 mt-auto">© {new Date().getFullYear()} PCCL · Todos los derechos reservados</p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="bg-white flex flex-col justify-center px-12 py-10">
        <div className="w-full max-w-sm mx-auto">

          {/* Icon */}
          <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center text-2xl mb-8 shadow-md">
            🎓
          </div>

          <h2 className="font-serif text-3xl text-neutral-900 mb-1">Iniciar sesión</h2>
          <p className="text-sm text-neutral-500 mb-8">
            ¿Primera vez?{' '}
            <Link href={appRoutes.register} className="text-primary-500 font-medium hover:text-primary-600">
              Crear cuenta →
            </Link>
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Field label="Correo electrónico" error={error ? ' ' : undefined}>
              <Input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={!!error}
              />
            </Field>

            <Field label="Contraseña">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </Field>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
                <input type="checkbox" className="accent-primary-500 w-4 h-4" />
                Recordarme
              </label>
              <Link href="#" className="text-primary-500 hover:text-primary-600 font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {error && (
              <div className="bg-danger-50 text-danger-600 text-sm px-4 py-3 rounded border-l-4 border-danger-400 leading-relaxed">
                {error}
              </div>
            )}

            <Button variant="primary" size="lg" block loading={loading} type="submit" className="mt-1">
              {loading ? 'Verificando…' : 'Iniciar sesión'}
            </Button>
          </form>

          <p className="text-xs text-neutral-400 text-center mt-6 leading-relaxed">
            ¿Necesitas acceso sin cuenta?{' '}
            <span className="text-neutral-500">Solicítalo a tu administrador.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

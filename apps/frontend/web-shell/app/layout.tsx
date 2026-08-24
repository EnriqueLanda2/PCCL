import type { Metadata } from 'next';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { NavigatorBridge } from '@/app/components/shared/NavigatorBridge';

export const metadata: Metadata = {
  title: 'Rumbo Profesores — PCCL',
  description: 'Plataforma para gestionar cursos, lecciones y certificaciones con un diseño limpio y consistente.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        {/* Si el JS no corre, el contenido escalonado por <Reveal> no debe quedar oculto */}
        <noscript>
          <style>{'.reveal-on-scroll{opacity:1 !important;transform:none !important;}'}</style>
        </noscript>
        <NavigatorBridge />
        <AppRouterCacheProvider options={{ key: 'mui' }}>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}

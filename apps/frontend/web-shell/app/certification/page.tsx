import { DomainPage } from '@/components/domain-page';
import { getMicrofrontend } from '@/lib/microfrontends';
import { appRoutes } from '@/lib/routes';

export default function CertificationPage() {
  const item = getMicrofrontend('certification');

  if (!item) {
    return null;
  }

  return (
    <DomainPage
      title={item.title}
      eyebrow="Microfrontend de certificacion"
      description={item.description}
      purpose={item.purpose}
      services={item.services}
      routes={item.routes}
      backHref={appRoutes.home}
      backLabel="Volver al mapa"
    />
  );
}
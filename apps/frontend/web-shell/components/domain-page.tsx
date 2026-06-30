import Link from 'next/link';

type DomainPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  purpose: string;
  services: string[];
  routes: string[];
  backHref: string;
  backLabel: string;
};

export function DomainPage(props: Readonly<DomainPageProps>) {
  const {
    title,
    eyebrow,
    description,
    purpose,
    services,
    routes,
    backHref,
    backLabel,
  } = props;

  return (
    <main className="page" style={{ padding: 24 }}>
      <section className="dashboard-stack">
        <div className="panel hero">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="hero-copy">{description}</p>
          </div>
          <Link href={backHref} className="hero-note">
            {backLabel}
          </Link>
        </div>

        <div className="dashboard-two-column">
          <div className="panel dashboard-panel">
            <h2>Para que sirve</h2>
            <p className="hero-copy">{purpose}</p>
            <div className="summary-list">
              {services.map((service) => (
                <div key={service} className="summary-item">
                  <span>Backend</span>
                  <strong>{service}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="panel dashboard-panel">
            <h2>Rutas principales</h2>
            <div className="summary-list">
              {routes.map((route) => (
                <div key={route} className="summary-item">
                  <span>Ruta</span>
                  <strong>{route}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
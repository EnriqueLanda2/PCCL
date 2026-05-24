'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { appRoutes } from '@/lib/routes';

type MenuItem = {
  key: string;
  path: string;
  label: string;
};

const menuCatalog: MenuItem[] = [
  { key: 'dashboard', path: appRoutes.dashboard, label: 'Dashboard' },
  { key: 'courses', path: appRoutes.courses, label: 'Cursos' },
  { key: 'lessons', path: appRoutes.lessons, label: 'Lecciones' },
  { key: 'inscriptions', path: appRoutes.inscriptions, label: 'Inscripciones' },
  { key: 'califications', path: appRoutes.califications, label: 'Calificaciones' },
  { key: 'certificates', path: appRoutes.certificates, label: 'Certificados' },
  { key: 'progress', path: appRoutes.progress, label: 'Progreso' },
  { key: 'reports', path: appRoutes.audit, label: 'Auditoria' },
  { key: 'users', path: appRoutes.users, label: 'Usuarios' },
  { key: 'rbac', path: appRoutes.rbac, label: 'RBAC' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [visibleKeys, setVisibleKeys] = useState<string[]>(
    menuCatalog.map((item) => item.key),
  );
  const [profileLabel, setProfileLabel] = useState('Sesion activa');

  useEffect(() => {
    api
      .access()
      .then((profile) => {
        setVisibleKeys(profile.menu.map((item) => item.module));
        setProfileLabel(profile.roles.length ? profile.roles.join(', ') : 'Usuario autenticado');
      })
      .catch(() => {
        setVisibleKeys(menuCatalog.map((item) => item.key));
        setProfileLabel('Usuario autenticado');
      });
  }, []);

  const menu = menuCatalog.filter((item) => visibleKeys.includes(item.key));

  const handleLogout = async () => {
    await api.logout();
    router.replace(appRoutes.login);
  };

  return (
    <aside className="sidebar">
      <div className="brand">PCCL</div>
      <p className="sidebar-subtitle">{profileLabel}</p>
      <nav className="nav">
        {menu.map((item) => (
          <Link
            key={item.key}
            href={item.path}
            className={`nav-link ${pathname.startsWith(item.path) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: 20 }}>
        <button className="btn ghost" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}

const { PrismaClient } = require('../src/prisma/generated');
const bcrypt = require('bcrypt');
const { users: SEED_USERS } = require('../../../prisma/seed-shared');

const prisma = new PrismaClient();

const baseRoles = ['alumno', 'instructor', 'admin', 'revisor'];

/* ── Catálogo de módulos del sistema (debe calzar con buildMenu() en rbac.service.ts) ── */
const MODULES = [
  { key: 'dashboard',     name: 'Resumen' },
  { key: 'courses',       name: 'Cursos' },
  { key: 'lessons',       name: 'Lecciones' },
  { key: 'inscriptions',  name: 'Inscripciones' },
  { key: 'califications', name: 'Calificaciones' },
  { key: 'certificates',  name: 'Certificaciones' },
  { key: 'progress',      name: 'Progreso' },
  { key: 'reports',       name: 'Auditoría' },
  { key: 'users',         name: 'Usuarios' },
  { key: 'rbac',          name: 'RBAC' },
];

/* ── Privilegios por módulo (code = "modulo:accion") ── */
const PRIVILEGES = [
  { code: 'dashboard:read',      action: 'read',     module: 'dashboard' },
  { code: 'courses:read',        action: 'read',     module: 'courses' },
  { code: 'courses:create',      action: 'create',   module: 'courses' },
  { code: 'courses:update',      action: 'update',   module: 'courses' },
  { code: 'courses:delete',      action: 'delete',   module: 'courses' },
  { code: 'lessons:read',        action: 'read',     module: 'lessons' },
  { code: 'lessons:create',      action: 'create',   module: 'lessons' },
  { code: 'lessons:update',      action: 'update',   module: 'lessons' },
  { code: 'lessons:delete',      action: 'delete',   module: 'lessons' },
  { code: 'inscriptions:read',   action: 'read',     module: 'inscriptions' },
  { code: 'inscriptions:create', action: 'create',   module: 'inscriptions' },
  { code: 'inscriptions:update', action: 'update',   module: 'inscriptions' },
  { code: 'inscriptions:delete', action: 'delete',   module: 'inscriptions' },
  { code: 'califications:read',   action: 'read',   module: 'califications' },
  { code: 'califications:create', action: 'create', module: 'califications' },
  { code: 'califications:delete', action: 'delete', module: 'califications' },
  { code: 'certificates:read',     action: 'read',     module: 'certificates' },
  { code: 'certificates:download', action: 'download', module: 'certificates' },
  { code: 'progress:read',       action: 'read',     module: 'progress' },
  { code: 'reports:audit',       action: 'audit',    module: 'reports' },
  { code: 'users:read',          action: 'read',     module: 'users' },
  { code: 'users:create',        action: 'create',   module: 'users' },
  { code: 'users:update',        action: 'update',   module: 'users' },
  { code: 'rbac:read',           action: 'read',     module: 'rbac' },
  { code: 'rbac:manage',         action: 'manage',   module: 'rbac' },
];

/* ── Qué privilegios recibe cada rol base ── */
const ROLE_PRIVILEGES = {
  admin: PRIVILEGES.map((p) => p.code),
  instructor: [
    'dashboard:read',
    'courses:read', 'courses:create', 'courses:update',
    'lessons:read', 'lessons:create', 'lessons:update',
    'inscriptions:read',
    'califications:read', 'califications:create',
    'certificates:read', 'certificates:download',
    'progress:read',
  ],
  alumno: [
    'dashboard:read',
    'courses:read',
    'lessons:read',
    'inscriptions:read', 'inscriptions:create',
    'califications:read',
    'certificates:read', 'certificates:download',
    'progress:read',
  ],
  revisor: [
    'dashboard:read',
    'courses:read',
    'lessons:read',
    'califications:read',
    'certificates:read',
    'progress:read',
    'reports:audit',
  ],
};

async function upsertUser({ id, fullName, email, password, roleName }, roleIdByName) {
  const passwordHash = await bcrypt.hash(password, 12);
  const roleId = roleIdByName[roleName];
  if (!roleId) throw new Error(`No se encontró el rol requerido: ${roleName}`);

  const user = await prisma.user.upsert({
    where: { email },
    update: { fullName, passwordHash, active: true, updatedBy: 'seed' },
    create: { id, fullName, email, passwordHash, active: true, createdBy: 'seed', updatedBy: 'seed' },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId } },
    update: { updatedBy: 'seed' },
    create: { userId: user.id, roleId, createdBy: 'seed', updatedBy: 'seed' },
  });

  return user;
}

async function main() {
  /* ── Roles base ── */
  for (const name of baseRoles) {
    await prisma.role.upsert({
      where: { name },
      update: { active: true, updatedBy: 'seed' },
      create: { name, active: true, createdBy: 'seed', updatedBy: 'seed' },
    });
  }
  const roles = await prisma.role.findMany({ where: { name: { in: baseRoles } } });
  const roleIdByName = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  /* ── Usuarios de prueba (staff + alumnos) ── */
  const userEntries = Object.values(SEED_USERS);
  for (const entry of userEntries) {
    await upsertUser(entry, roleIdByName);
  }

  /* ── Módulos del sistema ── */
  for (const mod of MODULES) {
    await prisma.systemModule.upsert({
      where: { key: mod.key },
      update: { name: mod.name, updatedBy: 'seed' },
      create: { key: mod.key, name: mod.name, createdBy: 'seed', updatedBy: 'seed' },
    });
  }
  const modules = await prisma.systemModule.findMany();
  const moduleIdByKey = Object.fromEntries(modules.map((m) => [m.key, m.id]));

  /* ── Privilegios ── */
  for (const priv of PRIVILEGES) {
    const moduleId = moduleIdByKey[priv.module];
    if (!moduleId) throw new Error(`Módulo no encontrado para el privilegio: ${priv.code}`);
    await prisma.privilege.upsert({
      where: { code: priv.code },
      update: { action: priv.action, moduleId, updatedBy: 'seed' },
      create: { code: priv.code, action: priv.action, moduleId, createdBy: 'seed', updatedBy: 'seed' },
    });
  }
  const privileges = await prisma.privilege.findMany();
  const privilegeIdByCode = Object.fromEntries(privileges.map((p) => [p.code, p.id]));

  /* ── Asignación rol → privilegios ── */
  for (const [roleName, codes] of Object.entries(ROLE_PRIVILEGES)) {
    const roleId = roleIdByName[roleName];
    for (const code of codes) {
      const privilegeId = privilegeIdByCode[code];
      if (!privilegeId) throw new Error(`Privilegio no encontrado: ${code}`);
      await prisma.rolePrivilege.upsert({
        where: { roleId_privilegeId: { roleId, privilegeId } },
        update: { updatedBy: 'seed' },
        create: { roleId, privilegeId, createdBy: 'seed', updatedBy: 'seed' },
      });
    }
  }

  console.log(`Seed identity completado: ${baseRoles.length} roles, ${MODULES.length} módulos, ${PRIVILEGES.length} privilegios, ${userEntries.length} usuarios asegurados.`);
  for (const u of userEntries) console.log(`  · ${u.roleName.padEnd(10)} ${u.email} / ${u.password}`);
}

main()
  .catch((error) => {
    console.error('Identity seed failed');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

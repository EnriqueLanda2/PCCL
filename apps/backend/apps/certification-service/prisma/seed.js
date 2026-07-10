const { PrismaClient } = require('../src/prisma/generated');
const { users, inscriptions: INSCRIPTION_IDS } = require('../../../prisma/seed-shared');

const prisma = new PrismaClient();

/* ── Certificados de prueba (certificateNumber es único → upsert idempotente) ── */
const CERTIFICATES = [
  {
    certificateNumber: 'RB-2026-0312',
    inscriptionId: INSCRIPTION_IDS.sofiaApis,
    status: 'valid',
    issuedAt: new Date('2026-06-12T10:00:00Z'),
    expiresAt: null,
  },
  {
    certificateNumber: 'RB-2026-0298',
    inscriptionId: INSCRIPTION_IDS.robertoPostgres,
    status: 'valid',
    issuedAt: new Date('2026-05-28T10:00:00Z'),
    expiresAt: null,
  },
  {
    certificateNumber: 'RB-2026-0285',
    inscriptionId: INSCRIPTION_IDS.luciaApis,
    status: 'valid',
    issuedAt: new Date('2026-05-15T10:00:00Z'),
    expiresAt: null,
  },
  {
    certificateNumber: 'RB-2025-0142',
    inscriptionId: INSCRIPTION_IDS.marianaDataViz,
    status: 'expired',
    issuedAt: new Date('2025-01-10T10:00:00Z'),
    expiresAt: new Date('2026-01-10T10:00:00Z'),
  },
  {
    certificateNumber: 'RB-2025-0099',
    inscriptionId: INSCRIPTION_IDS.diegoA11y,
    status: 'revoked',
    issuedAt: new Date('2025-02-02T10:00:00Z'),
    expiresAt: null,
  },
];

/* ── Bitácora de ejemplo — solo se inserta si la tabla está vacía ── */
const AUDIT_LOGS = [
  { method: 'POST', endpoint: '/auth/login', transactionType: 'auth', actorScope: 'anonymous', actorIdentifier: users.admin.email,      browser: 'Chrome 126 / Windows', description: 'Inicio de sesión exitoso.', statusCode: 200 },
  { method: 'POST', endpoint: '/auth/login', transactionType: 'auth', actorScope: 'anonymous', actorIdentifier: 'desconocido@correo.com', browser: 'Firefox 128 / Linux',  description: 'Intento de inicio de sesión fallido: credenciales inválidas.', statusCode: 401 },
  { method: 'GET',  endpoint: '/courses', transactionType: 'read',   actorScope: 'user', actorIdentifier: users.instructor.email, browser: 'Chrome 126 / Windows', description: 'Listado de cursos consultado.', statusCode: 200 },
  { method: 'POST', endpoint: '/courses', transactionType: 'create', actorScope: 'user', actorIdentifier: users.instructor.email, browser: 'Chrome 126 / Windows', description: 'Curso "APIs REST con Node.js y Express" creado.', statusCode: 201 },
  { method: 'PATCH', endpoint: '/courses/:id/publish', transactionType: 'update', actorScope: 'user', actorIdentifier: users.instructor.email, browser: 'Chrome 126 / Windows', description: 'Curso publicado.', statusCode: 200 },
  { method: 'POST', endpoint: '/inscriptions', transactionType: 'create', actorScope: 'user', actorIdentifier: users.sofia.email, browser: 'Safari 17 / macOS', description: 'Inscripción creada para "APIs REST con Node.js y Express".', statusCode: 201 },
  { method: 'GET',  endpoint: '/progress/:inscriptionId', transactionType: 'read', actorScope: 'user', actorIdentifier: users.mariana.email, browser: 'Edge 126 / Windows', description: 'Consulta de avance de curso.', statusCode: 200 },
  { method: 'POST', endpoint: '/evaluations/:id/attempts', transactionType: 'create', actorScope: 'user', actorIdentifier: users.sofia.email, browser: 'Safari 17 / macOS', description: 'Intento de evaluación registrado.', statusCode: 201 },
  { method: 'POST', endpoint: '/certificates/:inscriptionId', transactionType: 'create', actorScope: 'system', actorIdentifier: 'certification-service', browser: null, description: 'Certificado RB-2026-0312 emitido automáticamente.', statusCode: 201 },
  { method: 'GET',  endpoint: '/certificates/:id/download', transactionType: 'read', actorScope: 'user', actorIdentifier: users.roberto.email, browser: 'Chrome 126 / Android', description: 'Descarga de PDF de certificado.', statusCode: 200 },
  { method: 'GET',  endpoint: '/certificates', transactionType: 'read', actorScope: 'user', actorIdentifier: users.admin.email, browser: 'Chrome 126 / Windows', description: 'Listado de certificados consultado.', statusCode: 200 },
  { method: 'PATCH', endpoint: '/users/:id', transactionType: 'update', actorScope: 'user', actorIdentifier: users.admin.email, browser: 'Chrome 126 / Windows', description: 'Datos de usuario actualizados.', statusCode: 200 },
  { method: 'DELETE', endpoint: '/lessons/:id', transactionType: 'delete', actorScope: 'user', actorIdentifier: users.instructor.email, browser: 'Chrome 126 / Windows', description: 'Intento de eliminar lección sin permisos.', statusCode: 403 },
  { method: 'GET',  endpoint: '/audit', transactionType: 'read', actorScope: 'user', actorIdentifier: users.revisor.email, browser: 'Firefox 128 / Windows', description: 'Bitácora de auditoría consultada.', statusCode: 200 },
  { method: 'GET',  endpoint: '/courses/9999', transactionType: 'read', actorScope: 'user', actorIdentifier: users.ana.email, browser: 'Chrome 126 / Android', description: 'Curso no encontrado.', statusCode: 404 },
];

async function main() {
  for (const cert of CERTIFICATES) {
    await prisma.certificate.upsert({
      where: { certificateNumber: cert.certificateNumber },
      update: {
        status: cert.status,
        issuedAt: cert.issuedAt,
        expiresAt: cert.expiresAt,
        updatedBy: 'seed',
      },
      create: {
        certificateNumber: cert.certificateNumber,
        inscriptionId: cert.inscriptionId,
        status: cert.status,
        issuedAt: cert.issuedAt,
        expiresAt: cert.expiresAt,
        pdfUrl: null,
        createdBy: 'seed',
        updatedBy: 'seed',
      },
    });
  }

  const existingLogs = await prisma.auditLog.count();
  if (existingLogs === 0) {
    await prisma.auditLog.createMany({
      data: AUDIT_LOGS.map((log) => ({ ...log, createdBy: 'seed', updatedBy: 'seed' })),
    });
  }

  console.log(`Seed certification completado: ${CERTIFICATES.length} certificados asegurados, ${existingLogs === 0 ? AUDIT_LOGS.length : 0} registros de auditoría insertados.`);
}

main()
  .catch((error) => {
    console.error('Certification seed failed');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

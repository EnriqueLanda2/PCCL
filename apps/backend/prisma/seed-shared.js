/**
 * seed-shared.js — identificadores fijos compartidos entre los tres
 * seeds (identity/learning/certification). Cada microservicio tiene
 * su propia base de datos sin foreign keys reales entre sí, así que
 * estos UUIDs fijos son la única forma de enlazar entidades entre
 * bases (p. ej. Inscription.userId → User.id, Certificate.inscriptionId
 * → Inscription.id). No depende de Prisma: es solo un módulo de datos
 * plano que cualquiera de los tres `seed.js` puede `require()`.
 */

const users = {
  admin:      { id: '11111111-1111-4111-8111-111111111101', email: 'admin@prueba.com',      fullName: 'Usuario de prueba',      password: 'Admin1234!',      roleName: 'admin' },
  instructor: { id: '11111111-1111-4111-8111-111111111102', email: 'instructor@prueba.com', fullName: 'Instructor de prueba',   password: 'Instructor1234!', roleName: 'instructor' },
  revisor:    { id: '11111111-1111-4111-8111-111111111103', email: 'revisor@prueba.com',    fullName: 'Valeria Cortés',         password: 'Revisor1234!',    roleName: 'revisor' },
  sofia:      { id: '11111111-1111-4111-8111-111111111110', email: 'sofia.ramirez@prueba.com',   fullName: 'Sofía Ramírez',    password: 'Alumno1234!', roleName: 'alumno' },
  mariana:    { id: '11111111-1111-4111-8111-111111111111', email: 'mariana.lopez@prueba.com',   fullName: 'Mariana López',    password: 'Alumno1234!', roleName: 'alumno' },
  diego:      { id: '11111111-1111-4111-8111-111111111112', email: 'diego.hernandez@prueba.com', fullName: 'Diego Hernández',  password: 'Alumno1234!', roleName: 'alumno' },
  carlos:     { id: '11111111-1111-4111-8111-111111111113', email: 'carlos.mendoza@prueba.com',  fullName: 'Carlos Mendoza',   password: 'Alumno1234!', roleName: 'alumno' },
  beto:       { id: '11111111-1111-4111-8111-111111111114', email: 'beto.sanchez@prueba.com',    fullName: 'Beto Sánchez',     password: 'Alumno1234!', roleName: 'alumno' },
  ana:        { id: '11111111-1111-4111-8111-111111111115', email: 'ana.gomez@prueba.com',       fullName: 'Ana Gómez',        password: 'Alumno1234!', roleName: 'alumno' },
  roberto:    { id: '11111111-1111-4111-8111-111111111116', email: 'roberto.diaz@prueba.com',    fullName: 'Roberto Díaz',     password: 'Alumno1234!', roleName: 'alumno' },
  lucia:      { id: '11111111-1111-4111-8111-111111111117', email: 'lucia.ortega@prueba.com',    fullName: 'Lucía Ortega',     password: 'Alumno1234!', roleName: 'alumno' },
};

/** IDs fijos de Inscription — creados en learning-service, referenciados por certification-service */
const inscriptions = {
  marianaApis:     '22222222-2222-4222-8222-222222222201',
  diegoPostgres:   '22222222-2222-4222-8222-222222222202',
  sofiaApis:       '22222222-2222-4222-8222-222222222203',
  carlosApis:      '22222222-2222-4222-8222-222222222204',
  betoPostgres:    '22222222-2222-4222-8222-222222222205',
  anaApis:         '22222222-2222-4222-8222-222222222206',
  robertoPostgres: '22222222-2222-4222-8222-222222222207',
  luciaApis:       '22222222-2222-4222-8222-222222222208',
  marianaDataViz:  '22222222-2222-4222-8222-222222222209',
  diegoA11y:       '22222222-2222-4222-8222-222222222210',
};

module.exports = { users, inscriptions };

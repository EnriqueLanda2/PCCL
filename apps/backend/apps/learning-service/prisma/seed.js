const { PrismaClient } = require('../src/prisma/generated');
const { users, inscriptions: INSCRIPTION_IDS } = require('../../../prisma/seed-shared');

const prisma = new PrismaClient();

/* Imágenes reales (Unsplash, CDN estable, sin API key) — una por curso, temática */
const IMG = {
  apisRest:      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=600&fit=crop',
  postgres:      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=900&h=600&fit=crop',
  docker:        'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=900&h=600&fit=crop',
  microservices: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=600&fit=crop',
  dataViz:       'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop',
  a11y:          'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=900&h=600&fit=crop',
  criticalThink: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&h=600&fit=crop',
};

/* ── Catálogo de cursos — título + descripción + nivel + lecciones (con duración y tipo real) ── */
const COURSES = [
  {
    key: 'apisRest',
    title: 'APIs REST con Node.js y Express',
    description: 'Diseña y construye APIs REST robustas con Node.js, Express, autenticación JWT y persistencia con Prisma.',
    status: 'published',
    level: 'intermediate',
    coverImageUrl: IMG.apisRest,
    lessons: [
      { title: 'Introducción a Node.js y npm', contentType: 'reading', durationMinutes: 18, content: 'Repaso del runtime de Node.js, el sistema de módulos y cómo administrar dependencias con npm.' },
      { title: 'Fundamentos de Express', contentType: 'video', durationMinutes: 32, content: 'Video: instalación de Express, primer servidor HTTP y estructura de un proyecto backend.' },
      { title: 'Rutas y controladores REST', contentType: 'video', durationMinutes: 38, content: 'Video: diseño de rutas REST, verbos HTTP y separación en controladores.' },
      { title: 'Middlewares y manejo de errores', contentType: 'file', durationMinutes: 22, content: 'PDF descargable: guía de middlewares personalizados y manejo centralizado de errores.' },
      { title: 'Autenticación con JWT', contentType: 'video', durationMinutes: 41, content: 'Video: emisión y verificación de JSON Web Tokens, cookies httpOnly y guards.' },
      { title: 'Validación de datos con class-validator', contentType: 'practice', durationMinutes: 35, content: 'Práctica guiada: DTOs, decoradores de validación y manejo de errores 400.' },
      { title: 'Conectando PostgreSQL con Prisma', contentType: 'video', durationMinutes: 44, content: 'Video: modelado de esquema, migraciones y consultas con Prisma Client.' },
      { title: 'Testing de endpoints con Jest', contentType: 'practice', durationMinutes: 39, content: 'Práctica guiada: pruebas de integración con supertest y mocks de Prisma.' },
      { title: 'Quiz final: diseño de APIs REST', contentType: 'quiz', durationMinutes: 25, content: 'Cuestionario de opción múltiple sobre el diseño de APIs REST.' },
    ],
  },
  {
    key: 'postgres',
    title: 'Bases de datos con PostgreSQL',
    description: 'Modelado relacional, consultas SQL, índices y transacciones en PostgreSQL para aplicaciones reales.',
    status: 'published',
    level: 'intermediate',
    coverImageUrl: IMG.postgres,
    lessons: [
      { title: 'Modelado relacional y normalización', contentType: 'reading', durationMinutes: 24, content: 'Formas normales, claves foráneas y buenas prácticas de modelado.' },
      { title: 'Consultas SQL esenciales', contentType: 'video', durationMinutes: 36, content: 'Video: SELECT, JOIN, agregaciones y subconsultas.' },
      { title: 'Índices y rendimiento', contentType: 'video', durationMinutes: 33, content: 'Video: cuándo y cómo indexar, lectura de EXPLAIN ANALYZE.' },
      { title: 'Transacciones e integridad', contentType: 'file', durationMinutes: 20, content: 'PDF descargable: niveles de aislamiento y control de concurrencia.' },
      { title: 'Quiz: fundamentos de PostgreSQL', contentType: 'quiz', durationMinutes: 22, content: 'Cuestionario sobre modelado, consultas y transacciones.' },
    ],
  },
  {
    key: 'docker',
    title: 'Docker en producción',
    description: 'Contenerización de aplicaciones, Dockerfiles eficientes y orquestación básica con Docker Compose.',
    status: 'draft',
    level: 'advanced',
    coverImageUrl: IMG.docker,
    lessons: [
      { title: 'Contenedores vs. máquinas virtuales', contentType: 'reading', durationMinutes: 15, content: 'Diferencias de aislamiento, rendimiento y casos de uso.' },
      { title: 'Escribiendo un Dockerfile eficiente', contentType: 'video', durationMinutes: 28, content: 'Video: capas, cache de build y multi-stage builds.' },
      { title: 'Orquestación básica con Docker Compose', contentType: 'practice', durationMinutes: 34, content: 'Práctica guiada: levantar varios servicios con docker-compose.yml.' },
    ],
  },
  {
    key: 'microservices',
    title: 'Arquitectura de microservicios',
    description: 'Principios de diseño, comunicación entre servicios y patrones de resiliencia para sistemas distribuidos.',
    status: 'draft',
    level: 'advanced',
    coverImageUrl: IMG.microservices,
    lessons: [
      { title: 'Principios de arquitectura de microservicios', contentType: 'reading', durationMinutes: 20, content: 'Cuándo conviene (y cuándo no) dividir un sistema en microservicios.' },
      { title: 'Comunicación entre servicios', contentType: 'video', durationMinutes: 30, content: 'Video: REST, mensajería asíncrona y contratos de API.' },
      { title: 'Patrones de resiliencia', contentType: 'file', durationMinutes: 18, content: 'PDF descargable: circuit breaker, retries y timeouts.' },
    ],
  },
  {
    key: 'dataViz',
    title: 'Fundamentos de visualización de datos',
    description: 'Principios de diseño, storytelling y herramientas para comunicar datos con claridad y honestidad visual.',
    status: 'published',
    level: 'basic',
    coverImageUrl: IMG.dataViz,
    lessons: [
      { title: 'Principios del diseño de gráficas', contentType: 'reading', durationMinutes: 16, content: 'Percepción visual, tinta-dato y elección de escalas.' },
      { title: 'Eligiendo el gráfico correcto', contentType: 'video', durationMinutes: 24, content: 'Video: cuándo usar barras, líneas, dispersión y mapas de calor.' },
      { title: 'Storytelling con datos', contentType: 'video', durationMinutes: 27, content: 'Video: estructura narrativa para presentar hallazgos.' },
      { title: 'Herramientas: D3 y Recharts', contentType: 'practice', durationMinutes: 38, content: 'Práctica guiada: primeras gráficas interactivas en el navegador.' },
      { title: 'Accesibilidad en visualizaciones', contentType: 'file', durationMinutes: 15, content: 'PDF descargable: contraste de color y alternativas textuales.' },
      { title: 'Quiz: lectura crítica de gráficas', contentType: 'quiz', durationMinutes: 20, content: 'Cuestionario sobre buenas y malas prácticas de visualización.' },
    ],
  },
  {
    key: 'a11y',
    title: 'Interfaces accesibles para todos',
    description: 'Navegación por teclado, lectores de pantalla, ARIA y auditoría de accesibilidad para interfaces inclusivas.',
    status: 'published',
    level: 'intermediate',
    coverImageUrl: IMG.a11y,
    lessons: [
      { title: 'Fundamentos de accesibilidad web', contentType: 'reading', durationMinutes: 19, content: 'Principios POUR y por qué la accesibilidad es para todos.' },
      { title: 'Navegación por teclado', contentType: 'video', durationMinutes: 22, content: 'Video: foco visible, orden de tabulación y atajos.' },
      { title: 'Lectores de pantalla y ARIA', contentType: 'video', durationMinutes: 31, content: 'Video: roles, estados y propiedades ARIA en componentes reales.' },
      { title: 'Contraste y tipografía inclusiva', contentType: 'file', durationMinutes: 14, content: 'PDF descargable: ratios de contraste WCAG y tamaños mínimos.' },
      { title: 'Auditoría con herramientas automáticas', contentType: 'practice', durationMinutes: 29, content: 'Práctica guiada: axe, Lighthouse y pruebas manuales.' },
      { title: 'Quiz: WCAG en la práctica', contentType: 'quiz', durationMinutes: 18, content: 'Cuestionario sobre criterios de éxito de WCAG 2.2.' },
    ],
  },
  {
    key: 'criticalThink',
    title: 'Pensamiento crítico para investigación',
    description: 'Identificación de sesgos, evaluación de fuentes y construcción de argumentos sólidos para la investigación.',
    status: 'published',
    level: 'basic',
    coverImageUrl: IMG.criticalThink,
    lessons: [
      { title: '¿Qué es el pensamiento crítico?', contentType: 'reading', durationMinutes: 17, content: 'Definición, componentes y por qué importa en la investigación.' },
      { title: 'Identificando sesgos cognitivos', contentType: 'video', durationMinutes: 25, content: 'Video: sesgo de confirmación, anclaje y disponibilidad.' },
      { title: 'Evaluando fuentes de investigación', contentType: 'file', durationMinutes: 16, content: 'PDF descargable: checklist para evaluar la calidad de una fuente.' },
      { title: 'Quiz: argumentación sólida', contentType: 'quiz', durationMinutes: 15, content: 'Cuestionario sobre falacias y estructura argumentativa.' },
    ],
  },
];

/* Duración total del curso = suma de sus lecciones */
for (const c of COURSES) {
  c.durationMinutes = c.lessons.reduce((sum, l) => sum + l.durationMinutes, 0);
}

/* ── Inscripciones de prueba (id fijo → certification-service las referencia) ── */
const INSCRIPTIONS = [
  { id: INSCRIPTION_IDS.marianaApis,     userId: users.mariana.id, courseKey: 'apisRest',       status: 'in-progress', progress: 82,  completed: false },
  { id: INSCRIPTION_IDS.diegoPostgres,   userId: users.diego.id,   courseKey: 'postgres',       status: 'in-progress', progress: 64,  completed: false },
  { id: INSCRIPTION_IDS.sofiaApis,       userId: users.sofia.id,   courseKey: 'apisRest',       status: 'completed',   progress: 100, completed: true },
  { id: INSCRIPTION_IDS.carlosApis,      userId: users.carlos.id,  courseKey: 'apisRest',       status: 'in-progress', progress: 45,  completed: false },
  { id: INSCRIPTION_IDS.betoPostgres,    userId: users.beto.id,    courseKey: 'postgres',       status: 'in-progress', progress: 90,  completed: false },
  { id: INSCRIPTION_IDS.anaApis,         userId: users.ana.id,     courseKey: 'apisRest',       status: 'in-progress', progress: 12,  completed: false },
  { id: INSCRIPTION_IDS.robertoPostgres, userId: users.roberto.id, courseKey: 'postgres',       status: 'completed',   progress: 100, completed: true },
  { id: INSCRIPTION_IDS.luciaApis,       userId: users.lucia.id,   courseKey: 'apisRest',       status: 'completed',   progress: 100, completed: true },
  { id: INSCRIPTION_IDS.marianaDataViz,  userId: users.mariana.id, courseKey: 'dataViz',        status: 'completed',   progress: 100, completed: true },
  { id: INSCRIPTION_IDS.diegoA11y,       userId: users.diego.id,   courseKey: 'a11y',           status: 'completed',   progress: 100, completed: true },
];

async function main() {
  const courseIdByKey = {};
  const lessonIdsByCourseKey = {};
  const evaluationIdByCourseKey = {};
  let createdCourses = 0, updatedCourses = 0, createdLessons = 0, createdCalifications = 0, createdEvaluations = 0;

  for (const c of COURSES) {
    const existing = await prisma.course.findFirst({ where: { title: c.title } });
    let courseId;
    let isNew;

    if (existing) {
      await prisma.course.update({
        where: { id: existing.id },
        data: {
          coverImageUrl: c.coverImageUrl,
          durationMinutes: c.durationMinutes,
          updatedBy: 'seed',
        },
      });
      courseId = existing.id;
      isNew = false;
      updatedCourses += 1;
    } else {
      const created = await prisma.course.create({
        data: {
          title: c.title,
          description: c.description,
          status: c.status,
          level: c.level,
          coverImageUrl: c.coverImageUrl,
          durationMinutes: c.durationMinutes,
          createdBy: 'seed',
          updatedBy: 'seed',
        },
      });
      courseId = created.id;
      isNew = true;
      createdCourses += 1;
    }
    courseIdByKey[c.key] = courseId;

    /* Estos 7 cursos son "de catálogo" (dueños: seed) — sus lecciones siempre
       se reemplazan por la definición de arriba, así una nueva corrida del seed
       también enriquece cursos que ya existían (duración, tipos de contenido). */
    if (!isNew) {
      await prisma.calification.deleteMany({ where: { lesson: { courseId } } });
      await prisma.lesson.deleteMany({ where: { courseId } });
    }

    const lessonIds = [];
    for (const lesson of c.lessons) {
      const created = await prisma.lesson.create({
        data: {
          title: lesson.title,
          content: lesson.content,
          contentType: lesson.contentType,
          durationMinutes: lesson.durationMinutes,
          courseId,
          createdBy: 'seed',
          updatedBy: 'seed',
        },
      });
      lessonIds.push({ id: created.id, contentType: created.contentType });
      createdLessons += 1;
    }
    lessonIdsByCourseKey[c.key] = lessonIds;

    /* Calificaciones — una por lección de tipo "quiz" */
    for (const lesson of lessonIds) {
      if (lesson.contentType !== 'quiz') continue;
      await prisma.calification.create({
        data: {
          title: 'Evaluación de la lección',
          content: 'Cuestionario de opción múltiple sobre el contenido de la lección.',
          type: 'quiz',
          totalPoints: 100,
          maxAttempts: 2,
          lessonId: lesson.id,
          createdBy: 'seed',
          updatedBy: 'seed',
        },
      });
      createdCalifications += 1;
    }

    /* Evaluación final — solo para cursos publicados; reutiliza la existente si ya había una */
    if (c.status === 'published') {
      const existingEvaluation = await prisma.evaluation.findFirst({ where: { courseId } });
      if (existingEvaluation) {
        evaluationIdByCourseKey[c.key] = existingEvaluation.id;
      } else {
        const evaluation = await prisma.evaluation.create({
          data: {
            title: `Examen final: ${c.title}`,
            description: 'Evaluación integradora del curso completo.',
            courseId,
            createdBy: 'seed',
            updatedBy: 'seed',
          },
        });
        evaluationIdByCourseKey[c.key] = evaluation.id;
        createdEvaluations += 1;
      }
    }
  }

  /* ── Inscripciones (idempotente por id fijo) ── */
  let upsertedInscriptions = 0;
  for (const ins of INSCRIPTIONS) {
    await prisma.inscription.upsert({
      where: { id: ins.id },
      update: {
        status: ins.status,
        progressPercentage: ins.progress,
        completedAt: ins.completed ? new Date() : null,
        updatedBy: 'seed',
      },
      create: {
        id: ins.id,
        userId: ins.userId,
        courseId: courseIdByKey[ins.courseKey],
        status: ins.status,
        progressPercentage: ins.progress,
        completedAt: ins.completed ? new Date() : null,
        createdBy: 'seed',
        updatedBy: 'seed',
      },
    });

    const existingProgress = await prisma.progress.findFirst({ where: { inscriptionId: ins.id } });
    const progressData = {
      lessonsCompleted: Math.round((ins.progress / 100) * lessonIdsByCourseKey[ins.courseKey].length),
      evaluationsCompleted: ins.completed ? 1 : 0,
      averageScore: ins.completed ? 92 : Math.round(ins.progress * 0.9),
      progressPercentage: ins.progress,
      lastAccessAt: new Date(),
      updatedBy: 'seed',
    };
    if (existingProgress) {
      await prisma.progress.update({ where: { id: existingProgress.id }, data: progressData });
    } else {
      await prisma.progress.create({ data: { ...progressData, inscriptionId: ins.id, createdBy: 'seed' } });
    }

    upsertedInscriptions += 1;
  }

  /* ── Intentos de evaluación para quienes completaron un curso publicado ── */
  let attemptsChecked = 0;
  for (const ins of INSCRIPTIONS) {
    if (!ins.completed) continue;
    const evaluationId = evaluationIdByCourseKey[ins.courseKey];
    if (!evaluationId) continue;
    const existingAttempt = await prisma.evaluationAttempt.findFirst({
      where: { evaluationId, studentId: ins.userId },
    });
    if (existingAttempt) continue;
    await prisma.evaluationAttempt.create({
      data: {
        evaluationId,
        studentId: ins.userId,
        answers: { respuestas: ['a', 'b', 'c'], completado: true },
        score: 92 + Math.floor(Math.random() * 8),
        createdBy: 'seed',
        updatedBy: 'seed',
      },
    });
    attemptsChecked += 1;
  }

  console.log(
    `Seed learning completado: ${createdCourses} cursos creados, ${updatedCourses} actualizados, ` +
    `${createdLessons} lecciones, ${createdCalifications} calificaciones, ${createdEvaluations} evaluaciones, ` +
    `${upsertedInscriptions} inscripciones aseguradas, ${attemptsChecked} intentos nuevos.`,
  );
}

main()
  .catch((error) => {
    console.error('Learning seed failed');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

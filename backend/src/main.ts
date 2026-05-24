import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyHandler } from './common/http-proxy';
import { configureHttpApp } from './common/http-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  configureHttpApp(
    app,
    config.get<string>('FRONTEND_URL', 'http://localhost:3001'),
  );

  const identityServiceUrl = config.get<string>(
    'IDENTITY_SERVICE_URL',
    'http://localhost:4001',
  );
  const learningServiceUrl = config.get<string>(
    'LEARNING_SERVICE_URL',
    'http://localhost:4002',
  );
  const certificationServiceUrl = config.get<string>(
    'CERTIFICATION_SERVICE_URL',
    'http://localhost:4003',
  );

  app.use(['/auth', '/users', '/rbac'], createProxyHandler(identityServiceUrl));
  app.use(
    ['/courses', '/lessons', '/inscriptions', '/progress', '/califications'],
    createProxyHandler(learningServiceUrl),
  );
  app.use(
    ['/certificates', '/audit'],
    createProxyHandler(certificationServiceUrl),
  );

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
}

void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});

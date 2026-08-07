import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureHttpApp } from '@app/common';
import { RpcHttpExceptionFilter } from './common/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const config = app.get(ConfigService);
  configureHttpApp(app, config.get<string>('FRONTEND_URL', 'http://localhost:3002'));
  /* Sin esto, cualquier excepción lanzada dentro de un microservicio llega al
     navegador como 500 en vez de su código real (404, 403, …). */
  app.useGlobalFilters(new RpcHttpExceptionFilter());

  const port = config.get<number>('PORT', 3010);
  await app.listen(port);
  console.log(`gateway listening on port ${port}`);
}

void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

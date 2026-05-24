import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { configureHttpApp } from '../../common/http-app';
import { LearningServiceModule } from './learning-service.module';

async function bootstrap() {
  const app = await NestFactory.create(LearningServiceModule);
  const config = app.get(ConfigService);
  configureHttpApp(
    app,
    config.get<string>('FRONTEND_URL', 'http://localhost:3001'),
  );

  const port = config.get<number>('PORT', 4002);
  await app.listen(port);
}

void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});

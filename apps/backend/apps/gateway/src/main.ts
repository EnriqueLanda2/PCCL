import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureHttpApp } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  configureHttpApp(app, config.get<string>('FRONTEND_URL', 'http://localhost:3002'));

  const port = config.get<number>('PORT', 3010);
  await app.listen(port);
  console.log(`gateway listening on port ${port}`);
}

void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

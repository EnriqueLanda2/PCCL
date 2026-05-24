import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IdentityServiceModule } from './identity-service.module';
import { configureHttpApp } from '../../common/http-app';

async function bootstrap() {
  const app = await NestFactory.create(IdentityServiceModule);
  const config = app.get(ConfigService);
  configureHttpApp(app, config.get<string>('FRONTEND_URL', 'http://localhost:3001'));

  const port = config.get<number>('PORT', 4001);
  await app.listen(port);
}

void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
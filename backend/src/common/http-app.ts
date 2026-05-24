import { ValidationPipe, type INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

export function configureHttpApp(
  app: INestApplication,
  frontendUrl: string,
) {
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
}
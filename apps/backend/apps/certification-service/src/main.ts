import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ServiceExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: { servers: [process.env.NATS_URL ?? 'nats://localhost:4222'] },
    },
  );

  /* Conserva el código real de las excepciones al cruzar NATS. */
  app.useGlobalFilters(new ServiceExceptionFilter());

  await app.listen();
  console.log('certification-service listening on NATS');
}

void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

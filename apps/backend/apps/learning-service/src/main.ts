import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: { servers: [process.env.NATS_URL ?? 'nats://localhost:4222'] },
  });

  await app.listen();
  console.log('learning-service listening on NATS');
}

void bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

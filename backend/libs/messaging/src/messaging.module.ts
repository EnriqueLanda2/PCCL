import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  IDENTITY_CLIENT,
  LEARNING_CLIENT,
  CERTIFICATION_CLIENT,
} from './clients';

@Module({})
export class MessagingModule {
  static forGateway(): DynamicModule {
    return {
      module: MessagingModule,
      global: true,
      imports: [
        ClientsModule.registerAsync([
          {
            name: IDENTITY_CLIENT,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.NATS,
              options: { servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')] },
            }),
          },
          {
            name: LEARNING_CLIENT,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.NATS,
              options: { servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')] },
            }),
          },
          {
            name: CERTIFICATION_CLIENT,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.NATS,
              options: { servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')] },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  static forLearning(): DynamicModule {
    return {
      module: MessagingModule,
      global: true,
      imports: [
        ClientsModule.registerAsync([
          {
            name: IDENTITY_CLIENT,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.NATS,
              options: { servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')] },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }

  static forCertification(): DynamicModule {
    return {
      module: MessagingModule,
      global: true,
      imports: [
        ClientsModule.registerAsync([
          {
            name: LEARNING_CLIENT,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              transport: Transport.NATS,
              options: { servers: [config.get<string>('NATS_URL', 'nats://localhost:4222')] },
            }),
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}

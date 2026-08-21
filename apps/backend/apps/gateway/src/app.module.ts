import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MessagingModule } from '@app/messaging';
import { JwtStrategy } from './auth/jwt.strategy';
import { IdentityController } from './identity/identity.controller';
import { LearningController } from './learning/learning.controller';
import { JaasService } from './learning/jaas.service';
import { CertificationController } from './certification/certification.controller';
import { PaymentController } from './payment/payment.controller';
import { StatsController } from './stats/stats.controller';
import { UploadsModule } from './uploads/uploads.module';
import { AlexaController } from './alexa/alexa.controller';
import { AlexaApiKeyGuard } from './alexa/alexa-api-key.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET', 'pccl_secret'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') as NonNullable<
            JwtModuleOptions['signOptions']
          >['expiresIn'],
        },
      }),
    }),
    MessagingModule.forGateway(),
    UploadsModule,
  ],
  providers: [JwtStrategy, JaasService, AlexaApiKeyGuard],
  controllers: [
    IdentityController,
    LearningController,
    CertificationController,
    PaymentController,
    StatsController,
    AlexaController,
  ],
})
export class AppModule {}

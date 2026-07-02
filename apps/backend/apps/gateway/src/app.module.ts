import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MessagingModule } from '@app/messaging';
import { JwtStrategy } from './auth/jwt.strategy';
import { IdentityController } from './identity/identity.controller';
import { LearningController } from './learning/learning.controller';
import { CertificationController } from './certification/certification.controller';

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
  ],
  providers: [JwtStrategy],
  controllers: [
    IdentityController,
    LearningController,
    CertificationController,
  ],
})
export class AppModule {}

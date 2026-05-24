import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { RbacModule } from '../rbac/rbac.module';
import { PermissionsGuard } from './guards/permissions.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategys/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../../../prisma/prisma.module';


@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    forwardRef(() => UsersModule),
    forwardRef(() => RbacModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET', 'pccl_secret'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d') ,
        }, 
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, PermissionsGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard, PermissionsGuard],
})
export class AuthModule {}

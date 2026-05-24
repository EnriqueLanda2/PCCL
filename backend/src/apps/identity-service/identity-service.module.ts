import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { IdentityServiceController } from './identity-service.controller';
import { IdentityServiceService } from './identity-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RbacModule,
  ],
  controllers: [IdentityServiceController],
  providers: [IdentityServiceService],
})
export class IdentityServiceModule {}
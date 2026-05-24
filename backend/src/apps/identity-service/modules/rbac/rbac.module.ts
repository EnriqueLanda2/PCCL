import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  providers: [RbacService],
  controllers: [RbacController],
  exports: [RbacService],
})
export class RbacModule {}

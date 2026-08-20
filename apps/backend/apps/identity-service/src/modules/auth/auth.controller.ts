import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IDENTITY_PATTERNS } from '@app/contracts';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(IDENTITY_PATTERNS.AUTH_LOGIN)
  login(@Payload() payload: { email: string; password: string }) {
    return this.authService.login(payload.email, payload.password);
  }

  @MessagePattern(IDENTITY_PATTERNS.AUTH_REGISTER)
  register(@Payload() payload: { fullName: string; email: string; password: string }) {
    return this.authService.register(payload.fullName, payload.email, payload.password);
  }

  @MessagePattern(IDENTITY_PATTERNS.AUTH_FORGOT_PASSWORD)
  forgotPassword(@Payload() payload: { email: string }) {
    return this.authService.forgotPassword(payload.email);
  }

  @MessagePattern(IDENTITY_PATTERNS.AUTH_RESET_PASSWORD)
  resetPassword(@Payload() payload: { email: string; code: string; newPassword: string }) {
    return this.authService.resetPassword(payload.email, payload.code, payload.newPassword);
  }
}

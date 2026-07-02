import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CERTIFICATION_PATTERNS } from '@app/contracts';
import { CERTIFICATION_CLIENT } from '@app/messaging';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/interfaces/request-user.interface';

@Controller()
@UseGuards(JwtAuthGuard)
export class CertificationController {
  constructor(
    @Inject(CERTIFICATION_CLIENT) private readonly client: ClientProxy,
  ) {}

  @Post('certificates/:inscriptionId')
  generate(
    @Param('inscriptionId') inscriptionId: string,
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_GENERATE, {
        inscriptionId,
        actor: u?.email ?? 'anonymous',
      }),
    );
  }

  @Get('certificates')
  findAll() {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_FIND_ALL, {}),
    );
  }

  @Get('certificates/:id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_FIND_ONE, { id }),
    );
  }

  @Get('certificates/:id/download')
  downloadPdf(@Param('id') id: string) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_DOWNLOAD_PDF, { id }),
    );
  }

  @Get('audit')
  listAudit(@Query('limit') limit = '100') {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.AUDIT_LIST, {
        limit: Math.min(Number(limit) || 100, 500),
      }),
    );
  }
}

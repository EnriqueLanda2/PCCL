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
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/interfaces/request-user.interface';
import { resolveScope } from '../auth/data-scope';

@Controller()
@UseGuards(JwtAuthGuard)
export class CertificationController {
  constructor(
    @Inject(CERTIFICATION_CLIENT) private readonly client: ClientProxy,
  ) {}

  /** El alumno ya no emite directo — pide, y queda pendiente de aprobación. */
  @Post('certificates/requests/:inscriptionId')
  requestCertificate(
    @Param('inscriptionId') inscriptionId: string,
    @CurrentUser() u: RequestUser,
  ) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_REQUEST_CREATE, {
        inscriptionId,
        actor: u?.email ?? 'anonymous',
      }),
    );
  }

  @Get('certificates/requests/mine/:inscriptionId')
  findMyCertificateRequest(@Param('inscriptionId') inscriptionId: string) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_REQUEST_FIND_MINE, { inscriptionId }),
    );
  }

  /** Cola de solicitudes pendientes — solo admin/instructor la usan, pero no
      hace falta un guard extra: el scope ya acota a "sus" cursos y un
      alumno normal (scope 'user') recibe [] acá abajo. */
  @Get('certificates/requests/pending')
  findPendingCertificateRequests(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_REQUEST_FIND_PENDING, { scope: resolveScope(u) }),
    );
  }

  @Post('certificates/requests/:id/approve')
  approveCertificateRequest(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_REQUEST_APPROVE, { id, actor: u?.email ?? 'anonymous' }),
    );
  }

  @Post('certificates/requests/:id/reject')
  rejectCertificateRequest(@Param('id') id: string, @CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_REQUEST_REJECT, { id, actor: u?.email ?? 'anonymous' }),
    );
  }

  @Get('certificates/eligibility/:inscriptionId')
  eligibility(@Param('inscriptionId') inscriptionId: string) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_ELIGIBILITY, {
        inscriptionId,
      }),
    );
  }

  @Get('certificates')
  findAll(@CurrentUser() u: RequestUser) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_FIND_ALL, {
        scope: resolveScope(u),
      }),
    );
  }

  /**
   * Verificación pública de un certificado por folio — destino del QR
   * impreso al reverso de la tarjeta. Se declara antes de
   * `certificates/:id/download` para que gane el match de ruta.
   */
  @Public()
  @Get('certificates/verify/:folio')
  verifyByFolio(@Param('folio') folio: string) {
    return firstValueFrom(
      this.client.send(CERTIFICATION_PATTERNS.CERT_VERIFY_FOLIO, { folio }),
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

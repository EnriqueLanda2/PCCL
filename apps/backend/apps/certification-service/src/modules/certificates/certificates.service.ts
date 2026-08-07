import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DataScope, IDENTITY_PATTERNS, LEARNING_PATTERNS } from '@app/contracts';
import { IDENTITY_CLIENT, LEARNING_CLIENT } from '@app/messaging';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(LEARNING_CLIENT) private readonly learningClient: ClientProxy,
    @Inject(IDENTITY_CLIENT) private readonly identityClient: ClientProxy,
  ) {}

  async generate(inscriptionId: string, actor: string) {
    const insc = await firstValueFrom<{
      status: string;
      userId: string;
    } | null>(
      this.learningClient.send(LEARNING_PATTERNS.INSCRIPTION_FIND_ONE, {
        id: inscriptionId,
      }),
    ).catch(() => null);

    if (!insc) throw new NotFoundException('Inscripcion no encontrada');
    if (insc.status !== 'completed')
      throw new BadRequestException('Curso no completado');

    const existing = await this.prisma.certificate.findFirst({
      where: { inscriptionId },
    });
    if (existing) throw new BadRequestException('Certificado ya existe');

    const now = new Date();
    const expiry = new Date(now);
    expiry.setFullYear(expiry.getFullYear() + 2);

    const certNum = `CERT-${inscriptionId.slice(0, 8).toUpperCase()}-${Date.now()}`;
    const cert = await this.prisma.certificate.create({
      data: {
        inscriptionId,
        // Dueño copiado desde la inscripción: permite filtrar por alumno sin
        // salir de esta base de datos.
        userId: insc.userId ?? null,
        certificateNumber: certNum,
        issuedAt: now,
        expiresAt: expiry,
        createdBy: actor,
        updatedBy: actor,
      },
    });
    return this.findOne(cert.id);
  }

  async findOne(id: string) {
    const cert = await this.prisma.certificate.findUnique({ where: { id } });
    if (!cert) throw new NotFoundException('Certificado no encontrado');
    return cert;
  }

  /**
   * Lista de constancias acotada al alcance de la sesión.
   *
   *  · all        → todas.
   *  · user       → filtro directo por la columna desnormalizada user_id.
   *  · instructor → learning-service resuelve qué inscripciones pertenecen a
   *                 sus cursos; aquí no se puede unir contra `courses` porque
   *                 vive en otra base.
   */
  async findAll(scope?: DataScope) {
    const order = { issuedAt: 'desc' } as const;

    switch (scope?.kind) {
      case 'all':
        return this.prisma.certificate.findMany({ orderBy: order });

      case 'user':
        if (!scope.userId) return [];
        return this.prisma.certificate.findMany({
          where: { userId: scope.userId },
          orderBy: order,
        });

      case 'instructor': {
        const inscriptionIds = await firstValueFrom<string[]>(
          this.learningClient.send(
            LEARNING_PATTERNS.INSCRIPTION_FIND_IDS_BY_SCOPE,
            { scope },
          ),
        ).catch(() => [] as string[]);
        if (inscriptionIds.length === 0) return [];
        return this.prisma.certificate.findMany({
          where: { inscriptionId: { in: inscriptionIds } },
          orderBy: order,
        });
      }

      default:
        return [];
    }
  }

  async downloadPdf(id: string) {
    const cert = await this.findOne(id);
    if (!cert.pdfUrl) throw new NotFoundException('PDF no generado');
    return { url: cert.pdfUrl };
  }

  /**
   * Verificación pública por folio — la usa /validate/[folio] sin sesión.
   * No lanza NotFound: devuelve { found: false } para que el visitante
   * reciba un 200 y el frontend distinga "folio inexistente" de "servicio
   * caído". Solo se exponen los campos impresos en la tarjeta; nunca ids
   * internos, correos ni la URL del PDF.
   */
  async verifyByFolio(folio: string) {
    const normalized = (folio ?? '').trim();
    if (!normalized) return { found: false as const };

    const cert = await this.prisma.certificate.findFirst({
      where: { certificateNumber: { equals: normalized, mode: 'insensitive' } },
    });
    if (!cert) return { found: false as const };

    const inscription = await firstValueFrom<{
      userId: string;
      course: { title: string } | null;
    } | null>(
      this.learningClient.send(LEARNING_PATTERNS.INSCRIPTION_FIND_ONE, {
        id: cert.inscriptionId,
      }),
    ).catch(() => null);

    const student = inscription?.userId
      ? await firstValueFrom<{ fullName: string } | null>(
          this.identityClient.send(IDENTITY_PATTERNS.USER_FIND_BY_ID, {
            id: inscription.userId,
          }),
        ).catch(() => null)
      : null;

    return {
      found: true as const,
      certificate: {
        certificateNumber: cert.certificateNumber,
        status: cert.status,
        issuedAt: cert.issuedAt,
        expiresAt: cert.expiresAt,
        studentName: student?.fullName ?? null,
        courseTitle: inscription?.course?.title ?? null,
      },
    };
  }
}

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DataScope, IDENTITY_PATTERNS, LEARNING_PATTERNS } from '@app/contracts';
import { IDENTITY_CLIENT, LEARNING_CLIENT } from '@app/messaging';
import { PrismaService } from '../../prisma/prisma.service';
import { CertificatePdfService } from './certificate-pdf.service';

@Injectable()
export class CertificatesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(LEARNING_CLIENT) private readonly learningClient: ClientProxy,
    @Inject(IDENTITY_CLIENT) private readonly identityClient: ClientProxy,
    private readonly pdf: CertificatePdfService,
    private readonly config: ConfigService,
  ) {}

  /** Emisión real del certificado — ya NO se llama directo desde el alumno,
      solo desde `approveRequest` una vez que un admin/instructor aprobó la
      solicitud. Se deja como método aparte porque sigue siendo el único
      lugar que sabe generar el folio y la fecha de vencimiento. */
  private async issue(inscriptionId: string, actor: string) {
    const insc = await firstValueFrom<{
      status: string;
      userId: string;
      course?: { title: string; instructorName?: string | null; createdBy?: string | null } | null;
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
    if (existing) return existing;

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

    /* Si esto falla (ej. Cloudinary caído), el certificado ya existe y
       `downloadPdf` lo reintenta on-demand — no se deja que un error acá
       tumbe la aprobación de la solicitud. */
    return this.generatePdf(
      cert,
      insc.userId,
      insc.course?.title,
      insc.course?.instructorName ?? insc.course?.createdBy,
    ).catch(() => cert);
  }

  /** Arma el PDF, lo sube y actualiza `pdfUrl` en el registro. Separado de
      `issue()` porque `downloadPdf` también lo necesita para certificados
      emitidos antes de que existiera esta generación (pdfUrl null). */
  private async generatePdf(
    cert: { id: string; certificateNumber: string; status: string; issuedAt: Date; expiresAt: Date | null },
    userId: string | null | undefined,
    courseTitle: string | null | undefined,
    instructorName: string | null | undefined,
  ) {
    const student = userId
      ? await firstValueFrom<{ fullName: string } | null>(
          this.identityClient.send(IDENTITY_PATTERNS.USER_FIND_BY_ID, { id: userId }),
        ).catch(() => null)
      : null;

    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3002');
    const pdfUrl = await this.pdf.generateAndUpload({
      studentName: student?.fullName ?? 'Estudiante',
      courseTitle: courseTitle ?? 'Curso',
      instructorName: instructorName ?? 'Instructor del curso',
      certificateNumber: cert.certificateNumber,
      status: cert.status === 'expired' || cert.status === 'revoked' ? cert.status : 'valid',
      issuedAt: cert.issuedAt,
      expiresAt: cert.expiresAt,
      verifyUrl: `${frontendUrl}/validate/${encodeURIComponent(cert.certificateNumber)}`,
    });
    return this.prisma.certificate.update({ where: { id: cert.id }, data: { pdfUrl } });
  }

  /** El alumno pide su certificado. Llegar hasta acá ya implica
      `eligibility.eligible` (lanza si no) — es decir, todas las lecciones
      completadas y todos los exámenes aprobados — así que se aprueba y
      emite en el momento, sin cola de revisión manual. `approveRequest`
      sigue existiendo para el caso poco común de una solicitud vieja que
      haya quedado "pending" de antes de este cambio. */
  async requestCertificate(inscriptionId: string, actor: string) {
    const eligibility = await this.eligibility(inscriptionId);
    if (!eligibility.eligible) {
      throw new BadRequestException(eligibility.reason ?? 'Curso no completado');
    }

    const existingCert = await this.prisma.certificate.findFirst({ where: { inscriptionId } });
    const existingRequest = await this.prisma.certificateRequest.findUnique({ where: { inscriptionId } });
    if (existingCert && existingRequest?.status === 'approved') return existingRequest;

    const cert = existingCert ?? (await this.issue(inscriptionId, actor));
    const approvedData = {
      status: 'approved' as const,
      reviewedBy: actor,
      reviewedAt: new Date(),
      certificateId: cert.id,
    };

    if (existingRequest) {
      return this.prisma.certificateRequest.update({ where: { id: existingRequest.id }, data: approvedData });
    }

    return this.prisma.certificateRequest.create({
      data: {
        inscriptionId,
        userId: eligibility.userId,
        courseId: eligibility.courseId,
        ...approvedData,
      },
    });
  }

  /** Estado de la solicitud para ESTA inscripción — lo que el alumno ve en
      su propia pantalla ("sin pedir" / "pendiente" / "rechazada", o nada si
      ya tiene el Certificate real). */
  findMyRequest(inscriptionId: string) {
    return this.prisma.certificateRequest.findUnique({ where: { inscriptionId } });
  }

  /** Cola de solicitudes para admin/instructor. Mismo criterio de alcance
      que `findAll`: instructor solo ve las de sus propios cursos. */
  async findPendingRequests(scope?: DataScope) {
    const where: { status: string; inscriptionId?: { in: string[] } } = { status: 'pending' };

    if (scope?.kind === 'instructor') {
      const inscriptionIds = await firstValueFrom<string[]>(
        this.learningClient.send(LEARNING_PATTERNS.INSCRIPTION_FIND_IDS_BY_SCOPE, { scope }),
      ).catch(() => [] as string[]);
      if (inscriptionIds.length === 0) return [];
      where.inscriptionId = { in: inscriptionIds };
    } else if (scope?.kind !== 'all') {
      return [];
    }

    return this.prisma.certificateRequest.findMany({ where, orderBy: { createdAt: 'asc' } });
  }

  async approveRequest(id: string, actor: string) {
    const request = await this.prisma.certificateRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Solicitud no encontrada');
    if (request.status !== 'pending') throw new BadRequestException('Esta solicitud ya fue resuelta');

    const cert = await this.issue(request.inscriptionId, actor);
    await this.prisma.certificateRequest.update({
      where: { id },
      data: { status: 'approved', reviewedBy: actor, reviewedAt: new Date(), certificateId: cert.id },
    });
    return this.findOne(cert.id);
  }

  async rejectRequest(id: string, actor: string) {
    const request = await this.prisma.certificateRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Solicitud no encontrada');
    if (request.status !== 'pending') throw new BadRequestException('Esta solicitud ya fue resuelta');

    return this.prisma.certificateRequest.update({
      where: { id },
      data: { status: 'rejected', reviewedBy: actor, reviewedAt: new Date() },
    });
  }

  async eligibility(inscriptionId: string) {
    return firstValueFrom<{
      inscriptionId: string;
      courseId: string;
      userId: string;
      eligible: boolean;
      lessonsCompleted: number;
      lessonsTotal: number;
      evaluationsPassed: number;
      evaluationsTotal: number;
      missingEvaluations: string[];
      reason: string | null;
    }>(
      this.learningClient.send(
        LEARNING_PATTERNS.INSCRIPTION_CERTIFICATE_ELIGIBILITY,
        { id: inscriptionId },
      ),
    );
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

  /** Certificados emitidos antes de que existiera la generación de PDF (o
      cuyo intento en `issue()` falló) llegan acá con `pdfUrl` null — se
      genera en el momento en vez de devolver un 404 al alumno. */
  async downloadPdf(id: string) {
    const cert = await this.findOne(id);
    if (cert.pdfUrl) return { url: cert.pdfUrl };

    const insc = await firstValueFrom<{
      userId: string;
      course?: { title: string; instructorName?: string | null; createdBy?: string | null } | null;
    } | null>(
      this.learningClient.send(LEARNING_PATTERNS.INSCRIPTION_FIND_ONE, { id: cert.inscriptionId }),
    ).catch(() => null);

    const updated = await this.generatePdf(
      cert,
      cert.userId ?? insc?.userId,
      insc?.course?.title,
      insc?.course?.instructorName ?? insc?.course?.createdBy,
    );
    if (!updated.pdfUrl) throw new NotFoundException('No se pudo generar el PDF. Intenta de nuevo.');
    return { url: updated.pdfUrl };
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

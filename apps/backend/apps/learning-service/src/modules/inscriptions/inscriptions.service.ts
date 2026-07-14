import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IDENTITY_PATTERNS } from '@app/contracts';
import { IDENTITY_CLIENT } from '@app/messaging';
import { PrismaService } from '../../prisma/prisma.service';
import { buildUserDirectory } from '../../common/user-directory';
import {
  CreateInscriptionDto,
  UpdateInscriptionDto,
} from './dtos/inscription.dto';

@Injectable()
export class InscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(IDENTITY_CLIENT) private readonly identityClient: ClientProxy,
  ) {}

  async create(dto: CreateInscriptionDto, actor: string) {
    const [user, course] = await Promise.all([
      firstValueFrom<unknown>(
        this.identityClient.send(IDENTITY_PATTERNS.USER_FIND_BY_ID, {
          id: dto.userId,
        }),
      ).catch(() => null),
      this.prisma.course.findUnique({ where: { id: dto.courseId } }),
    ]);

    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!course) throw new NotFoundException('Curso no encontrado');

    const existing = await this.prisma.inscription.findFirst({
      where: { userId: dto.userId, courseId: dto.courseId },
    });
    if (existing) throw new ConflictException('Ya inscrito');

    const insc = await this.prisma.inscription.create({
      data: {
        userId: dto.userId,
        courseId: dto.courseId,
        createdBy: actor,
        updatedBy: actor,
      },
    });
    return this.findOne(insc.id);
  }

  async findAll() {
    const [inscriptions, directory] = await Promise.all([
      this.prisma.inscription.findMany({
        include: { course: true },
        orderBy: { createdAt: 'desc' },
      }),
      buildUserDirectory(this.identityClient),
    ]);
    return inscriptions.map((insc) => ({
      ...insc,
      user: directory.get(insc.userId) ?? null,
    }));
  }

  async findOne(id: string) {
    const insc = await this.prisma.inscription.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!insc) throw new NotFoundException('Inscripcion no encontrada');
    return insc;
  }

  async update(id: string, dto: UpdateInscriptionDto, actor: string) {
    await this.findOne(id);
    await this.prisma.inscription.update({
      where: { id },
      data: {
        ...dto,
        updatedBy: actor,
        ...(dto.status === 'completed'
          ? { completedAt: new Date(), progressPercentage: 100 }
          : {}),
      },
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.inscription.delete({ where: { id } });
    return { id, deleted: true };
  }
}

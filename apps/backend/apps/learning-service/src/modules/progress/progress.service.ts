import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IDENTITY_CLIENT } from '@app/messaging';
import { PrismaService } from '../../prisma/prisma.service';
import { buildUserDirectory } from '../../common/user-directory';

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(IDENTITY_CLIENT) private readonly identityClient: ClientProxy,
  ) {}

  async create(inscriptionId: string, actor: string) {
    const insc = await this.prisma.inscription.findUnique({ where: { id: inscriptionId } });
    if (!insc) throw new NotFoundException('Inscripcion no encontrada');
    const prog = await this.prisma.progress.create({
      data: { inscriptionId, createdBy: actor, updatedBy: actor },
    });
    return this.findByInscription(prog.inscriptionId);
  }

  async findByInscription(inscriptionId: string) {
    const prog = await this.prisma.progress.findFirst({
      where: { inscriptionId },
      include: { inscription: true },
    });
    if (!prog) throw new NotFoundException('Progreso no encontrado');
    return prog;
  }

  async findAll() {
    const [items, directory] = await Promise.all([
      this.prisma.progress.findMany({
        include: { inscription: { include: { course: true } } },
        orderBy: { updatedAt: 'desc' },
      }),
      buildUserDirectory(this.identityClient),
    ]);
    return items.map((p) => ({
      ...p,
      inscription: p.inscription
        ? { ...p.inscription, user: directory.get(p.inscription.userId) ?? null }
        : null,
    }));
  }
}

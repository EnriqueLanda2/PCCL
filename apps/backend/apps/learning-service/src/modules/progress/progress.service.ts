import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

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
}

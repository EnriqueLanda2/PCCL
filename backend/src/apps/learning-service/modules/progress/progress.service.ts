import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(inscriptionId: string, actor: string) {
    const insc = await this.prisma.inscription.findUnique({
      where: { id: inscriptionId },
    });
    if (!insc) throw new NotFoundException('Inscripcion no encontrada');

    const prog = await this.prisma.progress.create({
      data: {
        inscriptionId,
        createdBy: actor,
        updatedBy: actor,
      },
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

  findAll() {
    return this.prisma.progress.findMany({
      include: { inscription: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProgress(
    inscriptionId: string,
    updates: Prisma.ProgressUpdateInput,
    actor: string,
  ) {
    const prog = await this.findByInscription(inscriptionId);
    await this.prisma.progress.update({
      where: { id: prog.id },
      data: {
        ...updates,
        updatedBy: actor,
        lastAccessAt: new Date(),
      },
    });
    return this.findByInscription(inscriptionId);
  }
}



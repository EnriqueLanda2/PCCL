import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateInscriptionDto, UpdateInscriptionDto } from './dtos/inscription.dto';

@Injectable()
export class InscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInscriptionDto, actor: string) {
    const [user, course] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.userId } }),
      this.prisma.course.findUnique({ where: { id: dto.courseId } }),
    ]);

    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!course) throw new NotFoundException('Curso no encontrado');

    const existing = await this.prisma.inscription.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
      },
    });
    if (existing) throw new ConflictException('Ya inscrito');

    const insc = await this.prisma.inscription.create({
      data: {
        userId: user.id,
        courseId: course.id,
        createdBy: actor,
        updatedBy: actor,
      },
    });
    return this.findOne(insc.id);
  }

  findAll() {
    return this.prisma.inscription.findMany({
      include: { user: true, course: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const insc = await this.prisma.inscription.findUnique({
      where: { id },
      include: { user: true, course: true },
    });
    if (!insc) throw new NotFoundException('Inscripcion no encontrada');
    return insc;
  }

  async update(id: string, dto: UpdateInscriptionDto, actor: string) {
    const insc = await this.findOne(id);
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



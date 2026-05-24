import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEvaluationDto } from './dtos/create-evaluation.dto';
import { SubmitAttemptDto } from './dtos/submit-attempt.dto';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEvaluationDto, actor: string) {
    return this.prisma.evaluation.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        courseId: dto.courseId,
        createdBy: actor,
        updatedBy: actor,
      },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.evaluation.findMany({ where: { courseId }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const ev = await this.prisma.evaluation.findUnique({ where: { id } });
    if (!ev) throw new NotFoundException('Evaluation not found');
    return ev;
  }

  async submitAttempt(dto: SubmitAttemptDto) {
    await this.findOne(dto.evaluationId);
    return this.prisma.evaluationAttempt.create({
      data: {
        evaluationId: dto.evaluationId,
        studentId: dto.studentId,
        answers: dto.answers as any,
        createdBy: dto.studentId,
      },
    });
  }

  async getAttempts(evaluationId: string) {
    await this.findOne(evaluationId);
    return this.prisma.evaluationAttempt.findMany({ where: { evaluationId }, orderBy: { transactionDate: 'desc' } });
  }
}

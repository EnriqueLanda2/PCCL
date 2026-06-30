import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateAuditLogInput {
  method: string;
  endpoint: string;
  transactionType: string;
  actorScope: string;
  actorIdentifier: string | null;
  browser: string | null;
  description: string;
  statusCode: number | null;
  createdBy: string | null;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  register(input: CreateAuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        ...input,
        updatedBy: input.createdBy,
        transactionDate: new Date(),
        startDate: new Date(),
        endDate: new Date(),
      },
    });
  }

  list(limit: number) {
    return this.prisma.auditLog.findMany({ take: limit, orderBy: { createdAt: 'desc' } });
  }
}

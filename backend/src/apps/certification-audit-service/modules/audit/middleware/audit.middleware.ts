import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as useragent from 'useragent';
import { AuditService } from '../audit.service';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private readonly auditService: AuditService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startedAt = Date.now();

    res.on('finish', async () => {
      const finishedAt = new Date();
      const jwtPayload = this.decodeToken(req.cookies?.pccl_session);
      const apiIdentity = req.header('x-api-user') || null;
      const dbIdentity = req.header('x-db-user') || null;
      const browser = useragent.parse(req.headers['user-agent'] || '').toAgent();

      const actorScope = jwtPayload
        ? 'authenticated_user'
        : apiIdentity
          ? 'api_user'
          : dbIdentity
            ? 'database_user'
            : 'anonymous';

      const actorIdentifier = jwtPayload?.email || apiIdentity || dbIdentity || null;
      const elapsed = finishedAt.getTime() - startedAt;

      await this.auditService.register({
        method: req.method,
        endpoint: req.originalUrl,
        transactionType: this.resolveTransactionType(req.method),
        actorScope,
        actorIdentifier,
        browser,
        statusCode: res.statusCode,
        description: `${this.resolveActionVerb(req.method)} recurso en ${req.originalUrl} (${elapsed}ms)`,
        createdBy: actorIdentifier,
        startDate: new Date(startedAt),
        endDate: finishedAt,
      });
    });

    next();
  }

  private decodeToken(token?: string): { email?: string } | null {
    if (!token) {
      return null;
    }

    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    try {
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = Buffer.from(payload, 'base64').toString('utf-8');
      return JSON.parse(decoded) as { email?: string };
    } catch {
      return null;
    }
  }

  private resolveTransactionType(method: string) {
    if (method === 'POST') return 'create';
    if (method === 'PATCH' || method === 'PUT') return 'update';
    if (method === 'DELETE') return 'delete';
    return 'read';
  }

  private resolveActionVerb(method: string) {
    if (method === 'POST') return 'Creacion de';
    if (method === 'PATCH' || method === 'PUT') return 'Actualizacion de';
    if (method === 'DELETE') return 'Eliminacion de';
    return 'Consulta de';
  }
}

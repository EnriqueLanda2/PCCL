import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

/**
 * Traduce los errores que llegan por NATS a respuestas HTTP correctas.
 *
 * Cuando un microservicio lanza NotFoundException / ForbiddenException, la
 * excepción viaja serializada y en el gateway llega como un objeto plano. Sin
 * este filtro Nest no la reconoce y responde 500 "Internal server error" —
 * pasaba en TODA la API, no solo aquí: un curso inexistente devolvía 500 en
 * vez de 404, y "debes estar inscrito para comentar" se perdía por completo.
 */
interface SerializedRpcError {
  status?: number;
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

function extractStatus(err: SerializedRpcError): number | null {
  const raw = err.status ?? err.statusCode;
  /* Solo se acepta un código HTTP plausible: un `status: 'error'` de otra
     librería no debe convertirse en un status numérico inventado. */
  if (typeof raw === 'number' && raw >= 400 && raw <= 599) return raw;
  return null;
}

@Catch()
export class RpcHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('RpcHttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    /* Las excepciones HTTP locales del gateway se responden tal cual. */
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return res.status(status).json(exception.getResponse());
    }

    if (exception && typeof exception === 'object') {
      const err = exception as SerializedRpcError;
      const status = extractStatus(err);
      if (status !== null) {
        return res.status(status).json({
          statusCode: status,
          message: err.message ?? 'Error',
          ...(err.error ? { error: err.error } : {}),
        });
      }
    }

    this.logger.error('Error no controlado', exception as Error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}

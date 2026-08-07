import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

/**
 * Conserva el detalle de las excepciones al cruzar NATS.
 *
 * Los servicios lanzan NotFoundException / ForbiddenException (excepciones
 * HTTP). Nest, en contexto microservicio, no sabe serializarlas y las aplana a
 * `{ status: 'error', message: 'Internal server error' }`, así que el gateway
 * respondía 500 a todo: un curso inexistente daba 500 en vez de 404 y
 * "debes estar inscrito para comentar" se perdía por completo.
 *
 * Aquí se convierten a un objeto plano con su código y mensaje reales, que el
 * RpcHttpExceptionFilter del gateway vuelve a traducir a HTTP.
 */
@Catch()
export class ServiceExceptionFilter extends BaseRpcExceptionFilter {
  private readonly logger = new Logger('ServiceExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): Observable<unknown> {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : ((response as { message?: string | string[] }).message ??
            exception.message);

      return throwError(() => ({
        status,
        statusCode: status,
        message,
        error: exception.name,
      }));
    }

    this.logger.error('Excepción no controlada en el servicio', exception as Error);
    return super.catch(exception, host);
  }
}

import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class RpcExceptionFilterImpl implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, _host: ArgumentsHost): Observable<never> {
    return throwError(() => exception.getError());
  }
}

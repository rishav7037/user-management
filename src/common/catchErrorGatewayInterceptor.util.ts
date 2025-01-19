import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StatusException } from './exceptionFilters.util';
import { SweetLogger } from './logger/logger.service';

@Injectable()
export class CatchGatewayExceptionInterceptor implements NestInterceptor {
  constructor(private readonly logger: SweetLogger) {
    this.logger.setContext(CatchGatewayExceptionInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: any) => {
        const handlerName = context.getHandler().name;
        this.logger.error(
          `Error in ${handlerName}: ${err.response?.message ?? err.message}`,
          err.stack,
        );
        checkError(err);
      }),
    );
  }
}

export function checkError(err: any): never {
  if (err instanceof StatusException) {
    throw err;
  } else if (err instanceof HttpException) {
    throw new StatusException(err.message, HttpStatus.BAD_REQUEST);
  } else if (err?.response?.data?.status) {
    throw new HttpException(
      err.response.data.status.message,
      HttpStatus.BAD_REQUEST,
    );
  } else {
    throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  }
}

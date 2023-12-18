import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Scope,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ scope: Scope.REQUEST })
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, url } = request;

    const userId = request?.user ? `- userId: ${request.user['sub']}` : '';

    this.logger.log(
      `Request: ${method} ${url}, ip: ${ip} - ${context.getClass().name} ${
        context.getHandler().name
      } ${userId}\n`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;

        this.logger.log(
          `Response: ${method} ${url} - statusCode: ${statusCode}, time: ${
            Date.now() - now
          }ms\n`,
        );
      }),
      catchError((error) => {
        this.logger.error(
          `Response: ${method} ${url} - statusCode: ${error.status} - Message: ${error.message}\n`,
        );

        return throwError(() => error);
      }),
    );
  }
}

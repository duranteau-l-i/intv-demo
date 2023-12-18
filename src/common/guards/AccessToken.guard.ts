import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
class AccessTokenGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AccessTokenGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, url } = request;

    const userId = request?.user ? `- userId: ${request.user['sub']}` : '';

    this.logger.log(
      `Request: ${method} ${url}, ip: ${ip} - ${context.getClass().name} ${
        context.getHandler().name
      } ${userId}\n`,
    );

    const result = super.canActivate(context);

    if (result instanceof Promise) {
      result.catch((error) => {
        this.logger.log(
          `Request: ${method} ${url}, ip: ${ip} - ${context.getClass().name} ${
            context.getHandler().name
          } ${userId}\n`,
        );

        this.logger.error(
          `Response: ${method} ${url} - statusCode: 401 - Message: ${error.message}\n`,
        );
      });
    }

    return result;
  }
}

export default AccessTokenGuard;

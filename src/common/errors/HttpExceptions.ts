import {
  HttpException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import CustomError, { ErrorType } from './CustomError';

class HttpExceptions {
  constructor(private error: CustomError | Error) {}

  exception(): HttpException {
    if (!(this.error instanceof CustomError)) {
      return new InternalServerErrorException(this.error.message);
    }

    switch (this.error.type) {
      case ErrorType.badRequest:
        return new BadRequestException(this.error.message);

      case ErrorType.unauthorized:
        return new UnauthorizedException(this.error.message);

      case ErrorType.forbidden:
        return new ForbiddenException(this.error.message);

      case ErrorType.notFound:
        return new NotFoundException(this.error.message);

      case ErrorType.unprocessableEntity:
        return new UnprocessableEntityException(this.error.message);

      case ErrorType.internalServerError:
        return new InternalServerErrorException(this.error.message);

      default:
        return new InternalServerErrorException(this.error.message);
    }
  }
}

export default HttpExceptions;

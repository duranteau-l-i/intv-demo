import {
  HttpException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import CustomError from './CustomError';

class HttpExceptions {
  constructor(private error: CustomError | Error) {}

  exception(): HttpException {
    if (!(this.error instanceof CustomError)) {
      return new InternalServerErrorException(this.error.message);
    }

    switch (this.error.type) {
      case 400:
        return new BadRequestException(this.error.message);

      case 401:
        return new UnauthorizedException(this.error.message);

      case 403:
        return new ForbiddenException(this.error.message);

      case 404:
        return new NotFoundException(this.error.message);

      case 422:
        return new UnprocessableEntityException(this.error.message);

      case 500:
        return new InternalServerErrorException(this.error.message);

      default:
        return new BadRequestException(this.error.message);
    }
  }
}

export default HttpExceptions;

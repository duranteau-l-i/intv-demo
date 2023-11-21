import { Inject, Injectable } from '@nestjs/common';

import { PaginationOptions, PaginationResponse } from '@common/types';
import CustomError, { ErrorType } from '@common/errors/CustomError';

import { ReqUser, Role, User } from '../domain/model';
import IUserRepository from '../domain/user.repository';
import UserError from '../domain/error';

@Injectable()
class UserQueries {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async getUsers(
    user: ReqUser,
    options?: PaginationOptions,
  ): Promise<PaginationResponse<User>> {
    this.checkIfNotExpires(user['exp']);
    this.checkIfAllows(user['role']);

    return await this.userRepository.getUsers(options);
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.getUserById(id);
  }

  private checkIfNotExpires(date: number): void {
    const now = Math.floor(new Date().getTime() / 1000);

    if (date < now) {
      throw new CustomError({
        type: ErrorType.forbidden,
        message: UserError[ErrorType.forbidden].accessDenied,
      });
    }
  }

  private checkIfAllows(role: Role): void {
    if (role !== Role.admin && role !== Role.editor) {
      throw new CustomError({
        type: ErrorType.forbidden,
        message: UserError[ErrorType.forbidden].accessDenied,
      });
    }
  }
}

export default UserQueries;

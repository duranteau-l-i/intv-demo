import { Inject, Injectable } from '@nestjs/common';

import { PaginationOptions, PaginationResponse } from '@common/types';

import { ReqUser, User } from '../domain/model';
import IUserRepository from '../domain/user.repository';
import { checkIfAllows, checkIfNotExpires } from './authorization';

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
    await checkIfNotExpires(user['exp']);
    await checkIfAllows(user['role']);

    return await this.userRepository.getUsers(options);
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.getUserById(id);
  }
}

export default UserQueries;

import { Inject, Injectable } from '@nestjs/common';

import { PaginationOptions, PaginationResponse } from '../../../common/types';

import User from '../domain/model/User';
import IUserRepository from '../domain/user.repository';

@Injectable()
class UserQueries {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async getUsers(
    options?: PaginationOptions,
  ): Promise<PaginationResponse<User>> {
    return await this.userRepository.getUsers(options);
  }
}

export default UserQueries;

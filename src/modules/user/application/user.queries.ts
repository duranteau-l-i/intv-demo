import { Inject, Injectable } from '@nestjs/common';

import { PaginationOptions, PaginationResponse } from '@common/types';

import { User } from '../domain/model';
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

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.getUserById(id);
  }
}

export default UserQueries;

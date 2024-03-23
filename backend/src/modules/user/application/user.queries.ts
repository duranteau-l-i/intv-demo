import { Inject, Injectable } from '@nestjs/common';

import { PaginationOptions, PaginationResponse } from '@common/types';

import { checkIfAllows, checkIfNotExpires } from './authorization';
import { ReqUser, User } from '../domain/model';
import IUserRepository from '../domain/user.repository';
import IUserCache from '../domain/user.cache';

@Injectable()
class UserQueries {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
    @Inject('UserCache')
    private userCache: IUserCache,
  ) {}

  async getUsers(
    user: ReqUser,
    options?: PaginationOptions,
  ): Promise<PaginationResponse<User>> {
    await checkIfNotExpires(user['exp']);
    await checkIfAllows(user['role']);

    const usersCache = await this.userCache.getList(options);
    if (usersCache) return usersCache;

    const users = await this.userRepository.getUsers(options);

    await this.userCache.addList(users);

    return users;
  }

  async getUserById(id: string): Promise<User> {
    const userCache = await this.userCache.getUserById(id);
    if (userCache) return userCache;

    const user = await this.userRepository.getUserById(id);

    await this.userCache.addUser(user);

    return user;
  }
}

export default UserQueries;

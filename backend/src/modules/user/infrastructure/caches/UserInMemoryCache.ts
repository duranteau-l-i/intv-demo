import { PaginationOptions, PaginationResponse } from '@common/types';

import { User } from '../../domain/model';
import IUserCache, { USER_ORDER_DEFAULT_VALUE } from '../../domain/user.cache';
import { OrderBy } from '@common/types/pagination';

class UserInMemoryCache implements IUserCache {
  users: Map<string, User | PaginationResponse<User>> = new Map();

  seedUsers(data: Map<string, User | PaginationResponse<User>>): void {
    this.users = data;
  }

  async getList(
    options?: PaginationOptions,
  ): Promise<PaginationResponse<User>> {
    const key = this.setListKey(options);

    const users = this.users.get(key);

    return users as PaginationResponse<User>;
  }

  async addList(
    users: PaginationResponse<User>,
  ): Promise<PaginationResponse<User>> {
    const key = this.setListKey(users);

    this.users.set(key, users);

    return users;
  }

  async removeList(): Promise<void> {
    const options = {
      orderBy: OrderBy.ASC,
      orderValue: USER_ORDER_DEFAULT_VALUE,
      perPage: 10,
      page: 1,
    };

    this.users.delete(
      `list:${options.orderBy}_${options.orderValue}_${options.orderValue}_${options.perPage}_${options.page}`,
    );
  }

  async getUserById(id: string): Promise<User> {
    const user = this.users.get(`user:${id}`);

    return user as User;
  }

  async addUser(user: User): Promise<User> {
    this.users.set(`user:${user.id}`, user);

    return user;
  }

  async removeUser(id: string): Promise<void> {
    this.users.delete(`user:${id}`);
  }

  private setListKey(options?: PaginationOptions) {
    const opts = {
      orderBy: options?.orderBy ?? OrderBy.ASC,
      orderValue: options?.orderValue ?? USER_ORDER_DEFAULT_VALUE,
      perPage: options?.perPage ?? 10,
      page: options?.page ?? 1,
    };

    return `list:${opts.orderBy}_${opts.orderValue}_${opts.perPage}_${opts.page}`;
  }
}

export default UserInMemoryCache;

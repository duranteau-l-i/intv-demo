import { PaginationOptions, PaginationResponse } from '@common/types';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { User } from '../../domain/model';
import IUserCache, { USER_ORDER_DEFAULT_VALUE } from '../../domain/user.cache';
import { OrderBy } from '@common/types/pagination';

class UserCache implements IUserCache {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getList(
    options?: PaginationOptions,
  ): Promise<PaginationResponse<User>> {
    const key = this.setListKey(options);

    const value: string = await this.cacheManager.get(key);
    if (!value) return;

    const parsed = JSON.parse(value);

    return {
      ...parsed,
      data: parsed.data.map((user) => new User(JSON.parse(user))),
    };
  }

  async addList(
    users: PaginationResponse<User>,
  ): Promise<PaginationResponse<User>> {
    const key = this.setListKey(users);

    await this.cacheManager.set(
      key,
      JSON.stringify({
        ...users,
        data: users.data.map((user) => this.setUser(user)),
      }),
    );

    return users;
  }

  async removeList(): Promise<void> {
    const keys = await this.cacheManager.store.keys(`list:*`);

    for await (const key of keys) {
      await this.cacheManager.del(key);
    }
  }

  async getUserById(id: string): Promise<User> {
    const value: string = await this.cacheManager.get(`user:${id}`);
    if (!value) return;

    const user = new User(JSON.parse(value));

    return user;
  }

  async addUser(user: User): Promise<User> {
    await this.cacheManager.set(`user:${user.id}`, this.setUser(user));

    await this.removeList();

    return user;
  }

  async removeUser(id: string): Promise<void> {
    await this.cacheManager.del(`user:${id}`);

    await this.removeList();
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

  private setUser(user: User): string {
    return JSON.stringify({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: user.password,
      role: user.role,
      refreshToken: user.refreshToken,
    });
  }
}

export default UserCache;

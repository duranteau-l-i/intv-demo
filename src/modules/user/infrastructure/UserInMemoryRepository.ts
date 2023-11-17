import CustomError, { ErrorType } from '../../../common/errors/CustomError';
import {
  PaginationOptions,
  PaginationResponse,
  pagination,
} from '../../../common/types';
import UserError from '../domain/error';

import User from '../domain/model/User';
import IUserRepository, {
  USER_ORDER_DEFAULT_VALUE,
  USER_ORDER_VALUES,
} from '../domain/user.repository';

class UserRepository implements IUserRepository {
  users: User[] = [];

  seedUsers(data: User[]): void {
    this.users = data;
  }

  async getUsers(
    options?: PaginationOptions,
  ): Promise<PaginationResponse<User>> {
    if (!options) {
      options = { orderValue: USER_ORDER_DEFAULT_VALUE };
    } else {
      if (!USER_ORDER_VALUES.includes(options?.orderValue)) {
        options.orderValue = USER_ORDER_DEFAULT_VALUE;
      }
    }

    this.users.sort((a: User, b: User) =>
      a[options.orderValue] > b[options.orderValue] ? 1 : -1,
    );
    const count = this.users.length;

    const { orderBy, orderValue, perPage, page, pages } = pagination(
      options,
      count,
    );

    const list = this.users.slice(page, perPage + page);
    const data = list.map((user) => new User(user));

    return {
      data,
      count,
      pages,
      orderBy,
      orderValue,
      perPage,
      page: options?.page ? Number(options.page) : 1,
    };
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = this.users.find((u) => u.id === id);

      if (!user)
        throw new CustomError({
          type: ErrorType.notFound,
          message: UserError[ErrorType.notFound].byId,
        });

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async updateUser(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async removeUser(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default UserRepository;

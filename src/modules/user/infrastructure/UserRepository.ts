import {
  PaginationOptions,
  PaginationResponse,
  pagination,
} from '../../../common/types';

import User from '../domain/model/User';
import IUserRepository, {
  USER_ORDER_DEFAULT_VALUE,
  USER_ORDER_VALUES,
} from '../domain/user.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import UserEntity from './entities/User.entity';
import { userToDomain } from './mappers/user.mapper';
import CustomError, { ErrorType } from '../../../common/errors/CustomError';
import UserError from '../domain/error';

class UserRepository implements IUserRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getUsers(
    options?: PaginationOptions,
  ): Promise<PaginationResponse<User>> {
    const count = await this.dataSource
      .createQueryBuilder(UserEntity, 'user')
      .getCount();
    if (!options) {
      options = { orderValue: USER_ORDER_DEFAULT_VALUE };
    } else {
      if (!USER_ORDER_VALUES.includes(options?.orderValue)) {
        options.orderValue = USER_ORDER_DEFAULT_VALUE;
      }
    }
    const { orderBy, orderValue, perPage, page, pages } = pagination(
      options,
      count,
    );
    const usersDataQuery = this.dataSource
      .createQueryBuilder(UserEntity, 'user')
      .orderBy(`user.${orderValue}`, orderBy)
      .take(perPage)
      .skip(page);
    const usersData = await usersDataQuery.getMany();
    return {
      data: usersData.map((user) => userToDomain(user)),
      count,
      pages,
      orderBy,
      orderValue,
      perPage,
      page: options?.page ? Number(options.page) : 1,
    };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.dataSource
      .createQueryBuilder(UserEntity, 'user')
      .where('user.id = :id', { id })
      .getOne();

    if (!user)
      throw new CustomError({
        type: ErrorType.notFound,
        message: UserError[ErrorType.notFound].byId,
      });

    return userToDomain(user);
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.dataSource
      .createQueryBuilder(UserEntity, 'user')
      .where('user.username = :username', { username })
      .getOne();

    return user ? userToDomain(user) : null;
  }

  async createUser(user: User): Promise<User> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        password: user.password,
        role: user.role,
        refreshToken: user.refreshToken,
      })
      .orIgnore(`("id") DO NOTHING`)
      .execute();

    return user;
  }

  async updateUser(user: User): Promise<User> {
    await this.dataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .execute();

    return user;
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.dataSource
      .createQueryBuilder(UserEntity, 'user')
      .where('user.id = :id', { id })
      .getOne();

    if (!user)
      throw new CustomError({
        type: ErrorType.notFound,
        message: UserError[ErrorType.notFound].byId,
      });

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where({ id })
      .execute();
  }
}

export default UserRepository;

import { PaginationOptions, PaginationResponse } from 'src/common/types';

import User from '../domain/model/User';
import IUserRepository from '../domain/user.repository';

class UserRepository implements IUserRepository {
  async getUsers(
    queryParams?: PaginationOptions,
  ): Promise<PaginationResponse<User>> {
    throw new Error('Method not implemented.');
  }

  async getUserById(id: string): Promise<User> {
    throw new Error('Method not implemented.');
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

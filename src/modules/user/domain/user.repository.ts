import { PaginationOptions, PaginationResponse } from '../../../common/types';

import User from './model/User';

export const USER_ORDER_VALUES = ['username', 'firstName', 'lastName'];
export const USER_ORDER_DEFAULT_VALUE = 'username';

interface IUserRepository {
  getUsers(options?: PaginationOptions): Promise<PaginationResponse<User>>;
  getUserById(id: string): Promise<User>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  removeUser(id: string): Promise<void>;
}

export default IUserRepository;

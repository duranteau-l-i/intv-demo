import { PaginationOptions, PaginationResponse } from '@common/types';

import { User } from './model';

export const USER_ORDER_VALUES = ['username', 'firstName', 'lastName'];
export const USER_ORDER_DEFAULT_VALUE = 'username';

interface IUserCache {
  getList(options?: PaginationOptions): Promise<PaginationResponse<User>>;
  addList(users: PaginationResponse<User>): Promise<PaginationResponse<User>>;
  removeList(): Promise<void>;
  getUserById(id: string): Promise<User>;
  addUser(user: User): Promise<User>;
  removeUser(id: string): Promise<void>;
}

export default IUserCache;

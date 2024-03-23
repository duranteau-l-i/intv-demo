import { Inject, Injectable } from '@nestjs/common';

import { ReqUser, User, UserProps } from '../domain/model';
import IUserRepository from '../domain/user.repository';

import CreateUserCommandHandler from './useCases/createUser/CreateUser.command-handler';
import CreateUserCommand from './useCases/createUser/CreateUser.command';
import UpdateUserCommandHandler from './useCases/updateUser/UpdateUser.command-handler';
import UpdateUserCommand from './useCases/updateUser/UpdateUser.command';
import RemoveUserCommandHandler from './useCases/removeUser/RemoveUser.command-handler';
import RemoveUserCommand from './useCases/removeUser/RemoveUser.command';
import { checkIfAllows, checkIfNotExpires } from './authorization';
import IUserCache from '../domain/user.cache';

@Injectable()
class UserCommands {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
    @Inject('UserCache')
    private userCache: IUserCache,
  ) {}

  async createUser(user: ReqUser, newUser: UserProps): Promise<User> {
    await checkIfNotExpires(user['exp']);
    await checkIfAllows(user['role']);

    return await new CreateUserCommandHandler(
      this.userRepository,
      this.userCache,
    ).handle(new CreateUserCommand(newUser));
  }

  async updateUser(user: ReqUser, id: string, data: Partial<UserProps>) {
    await checkIfNotExpires(user['exp']);
    await checkIfAllows(user['role']);

    return await new UpdateUserCommandHandler(
      this.userRepository,
      this.userCache,
    ).handle(new UpdateUserCommand(id, data));
  }

  async removeUser(user: ReqUser, id: string) {
    await checkIfNotExpires(user['exp']);
    await checkIfAllows(user['role']);

    return await new RemoveUserCommandHandler(
      this.userRepository,
      this.userCache,
    ).handle(new RemoveUserCommand(id));
  }
}

export default UserCommands;

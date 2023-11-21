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

@Injectable()
class UserCommands {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async createUser(user: ReqUser, newUser: UserProps): Promise<User> {
    checkIfNotExpires(user['exp']);
    checkIfAllows(user['role']);

    return await new CreateUserCommandHandler(this.userRepository).handle(
      new CreateUserCommand(newUser),
    );
  }

  async updateUser(user: ReqUser, id: string, data: Partial<UserProps>) {
    checkIfNotExpires(user['exp']);
    checkIfAllows(user['role']);

    return await new UpdateUserCommandHandler(this.userRepository).handle(
      new UpdateUserCommand(id, data),
    );
  }

  async removeUser(user: ReqUser, id: string) {
    checkIfNotExpires(user['exp']);
    checkIfAllows(user['role']);

    return await new RemoveUserCommandHandler(this.userRepository).handle(
      new RemoveUserCommand(id),
    );
  }
}

export default UserCommands;

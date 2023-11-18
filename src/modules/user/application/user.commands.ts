import { Inject, Injectable } from '@nestjs/common';

import User, { UserProps } from '../domain/model/User';
import IUserRepository from '../domain/user.repository';
import CreateUserCommandHandler from './useCases/createUser/CreateUser.command-handler';
import CreateUserCommand from './useCases/createUser/CreateUser.command';
import UpdateUserCommandHandler from './useCases/updateUser/UpdateUser.command-handler';
import UpdateUserCommand from './useCases/updateUser/UpdateUser.command';
import RemoveUserCommandHandler from './useCases/removeUser/RemoveUser.command-handler';
import RemoveUserCommand from './useCases/removeUser/RemoveUser.command';

@Injectable()
class UserCommands {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async createUser(user: UserProps): Promise<User> {
    return await new CreateUserCommandHandler(this.userRepository).handle(
      new CreateUserCommand(user),
    );
  }

  async updateUser(id: string, data: Partial<UserProps>) {
    return await new UpdateUserCommandHandler(this.userRepository).handle(
      new UpdateUserCommand(id, data),
    );
  }

  async removeUser(id: string) {
    return await new RemoveUserCommandHandler(this.userRepository).handle(
      new RemoveUserCommand(id),
    );
  }
}

export default UserCommands;

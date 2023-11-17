import { Inject, Injectable } from '@nestjs/common';

import User, { UserProps } from '../domain/model/User';
import IUserRepository from '../domain/user.repository';
import CreateUserCommandHandler from './useCases/CreateUser.command-handler';
import CreateUserCommand from './useCases/CreateUser.command';
import UpdateUserCommandHandler from './useCases/UpdateUser.command-handler';
import UpdateUserCommand from './useCases/UpdateUser.command';

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
}

export default UserCommands;

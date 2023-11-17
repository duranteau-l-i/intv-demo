import { Inject, Injectable } from '@nestjs/common';

import User, { UserProps } from '../domain/model/User';
import IUserRepository from '../domain/user.repository';
import CreateUserCommandHandler from './useCases/CreateUser.command-handler';
import CreateUserCommand from './useCases/CreateUser.command';

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
}

export default UserCommands;

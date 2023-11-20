import { Inject, Injectable } from '@nestjs/common';

import { UserProps } from '../domain/model/User';
import IUserRepository from '../domain/user.repository';
import SignUpCommandHandler from './useCases/signUp/SignUp.command-handler';
import SignUpCommand from './useCases/signUp/SignUp.command';

@Injectable()
class AuthCommands {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async signUp(user: UserProps): Promise<string> {
    return await new SignUpCommandHandler(this.userRepository).handle(
      new SignUpCommand(user),
    );
  }
}

export default AuthCommands;

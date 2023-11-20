import { Inject, Injectable } from '@nestjs/common';

import { UserProps } from '../domain/model';
import IUserRepository from '../domain/user.repository';
import SignUpCommandHandler from './useCases/signUp/SignUp.command-handler';
import SignUpCommand from './useCases/signUp/SignUp.command';
import SignInCommandHandler from './useCases/signIn/SignIn.command-handler';
import SignInCommand from './useCases/signIn/SignIn.command';

@Injectable()
class AuthCommands {
  constructor(
    @Inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async signUp(
    user: UserProps,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await new SignUpCommandHandler(this.userRepository).handle(
      new SignUpCommand(user),
    );
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await new SignInCommandHandler(this.userRepository).handle(
      new SignInCommand(username, password),
    );
  }
}

export default AuthCommands;

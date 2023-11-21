import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User, UserProps } from '../domain/model';
import IUserRepository from '../domain/user.repository';
import SignUpCommandHandler from './useCases/signUp/SignUp.command-handler';
import SignUpCommand from './useCases/signUp/SignUp.command';
import SignInCommandHandler from './useCases/signIn/SignIn.command-handler';
import SignInCommand from './useCases/signIn/SignIn.command';
import LogOutCommandHandler from './useCases/logOut/LogOut.command-handler';
import LogOutCommand from './useCases/logOut/LogOut.command';
import RefreshTokensCommandHandler from './useCases/refreshTokens/RefreshTokens.command-handler';
import RefreshTokensCommand from './useCases/refreshTokens/RefreshTokens.command';

export type Tokens = { accessToken: string; refreshToken: string };

@Injectable()
class AuthCommands {
  constructor(
    private jwtService: JwtService,
    @Inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async signUp(user: UserProps): Promise<{
    tokens: Tokens;
    user: User;
  }> {
    return await new SignUpCommandHandler(this.userRepository).handle(
      new SignUpCommand(user),
      this.generateTokens(this.jwtService),
    );
  }

  async signIn(username: string, password: string): Promise<Tokens> {
    return await new SignInCommandHandler(this.userRepository).handle(
      new SignInCommand(username, password),
      this.generateTokens(this.jwtService),
    );
  }

  async logOut(id: string): Promise<void> {
    return await new LogOutCommandHandler(this.userRepository).handle(
      new LogOutCommand(id),
    );
  }

  async refreshTokens(id: string, refreshToken: string): Promise<Tokens> {
    return await new RefreshTokensCommandHandler(this.userRepository).handle(
      new RefreshTokensCommand(id, refreshToken),
      this.generateTokens(this.jwtService),
    );
  }

  generateTokens(jwtService: JwtService) {
    const r = async (data: { sub: string; username: string; role: string }) => {
      const accessToken = await jwtService.signAsync(data, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      });
      const refreshToken = await jwtService.signAsync(data, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      return { accessToken, refreshToken };
    };

    return r;
  }
}

export default AuthCommands;

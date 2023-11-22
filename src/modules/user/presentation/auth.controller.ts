import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';

import HttpExceptions from '@common/errors/HttpExceptions';
import { AccessTokenGuard, RefreshTokenGuard } from '@common/guards';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';

import AuthCommands, { Tokens } from '../application/auth.commands';
import CreateUserDTO from './dto/CreateUser';
import { ReqUser, UserProps } from '../domain/model';
import SignInDTO from './dto/SignIn';
import { UserViewModel, userToViewModel } from './mapper/user.mapper';

@UseInterceptors(LoggingInterceptor)
@Controller('/auth')
class AuthController {
  constructor(private readonly authCommands: AuthCommands) {}

  @Post('/signup')
  async signUp(@Body() createUserDTO: CreateUserDTO): Promise<{
    tokens: Tokens;
    user: UserViewModel;
  }> {
    try {
      const result = await this.authCommands.signUp(createUserDTO as UserProps);

      return { ...result, user: userToViewModel(result.user) };
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }

  @Post('/signin')
  async signIn(@Body() signInDTO: SignInDTO): Promise<Tokens> {
    try {
      const tokens = await this.authCommands.signIn(
        signInDTO.username,
        signInDTO.password,
      );

      return tokens;
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  async logOut(@Req() req: Request): Promise<void> {
    try {
      return await this.authCommands.logOut(req.user as ReqUser);
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh-tokens')
  async refreshTokens(@Req() req: Request): Promise<Tokens> {
    try {
      const refreshToken = req.user['refreshToken'];

      return await this.authCommands.refreshTokens(
        req.user as ReqUser,
        refreshToken,
      );
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }
}

export default AuthController;

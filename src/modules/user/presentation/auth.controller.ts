import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import HttpExceptions from '@common/errors/HttpExceptions';
import { AccessTokenGuard, RefreshTokenGuard } from '@common/guards';

import AuthCommands, { Tokens } from '../application/auth.commands';
import CreateUserDTO from './dto/CreateUser';
import { UserProps } from '../domain/model';
import SignInDTO from './dto/SignIn';
import { UserViewModel, userToViewModel } from './mapper/user.mapper';

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
      const userId = req.user['sub'];

      return await this.authCommands.logOut(userId);
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh-tokens')
  async refreshTokens(@Req() req: Request): Promise<Tokens> {
    try {
      const userId = req.user['sub'];
      const refreshToken = req.user['refreshToken'];

      return await this.authCommands.refreshTokens(userId, refreshToken);
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }
}

export default AuthController;

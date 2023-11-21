import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import HttpExceptions from '../../../common/errors/HttpExceptions';

import AuthCommands from '../application/auth.commands';
import CreateUserDTO from './dto/CreateUser';
import { UserProps } from '../domain/model';
import SignInDTO from './dto/SignIn';
import { AccessTokenGuard } from '../../../common/guards';
import { UserViewModel, userToViewModel } from './mapper/user.mapper';

@Controller('/auth')
class AuthController {
  constructor(private readonly authCommands: AuthCommands) {}

  @Post('/signup')
  async signUp(@Body() createUserDTO: CreateUserDTO): Promise<{
    tokens: { accessToken: string; refreshToken: string };
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
  async signIn(
    @Body() signInDTO: SignInDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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
      return await this.authCommands.logOut(req.user['sub']);
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }
}

export default AuthController;

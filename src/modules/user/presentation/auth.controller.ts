import { Body, Controller, Post } from '@nestjs/common';

import HttpExceptions from '../../../common/errors/HttpExceptions';

import AuthCommands from '../application/auth.commands';
import CreateUserDTO from './dto/CreateUser';
import { UserProps } from '../domain/model/User';

@Controller('/auth')
class AuthController {
  constructor(private readonly authCommands: AuthCommands) {}

  @Post('/signup')
  async signUp(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const tokens = await this.authCommands.signUp(createUserDTO as UserProps);

      return tokens;
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }
}

export default AuthController;

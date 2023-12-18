import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import HttpExceptions from '@common/errors/HttpExceptions';
import CustomError, { ErrorType } from '@common/errors/CustomError';

import { userToViewModel } from '../mapper/user.mapper';
import AuthCommands from '../../application/auth.commands';

import { ReqUser, UserProps } from '../../domain/model';
import UserError from '../../domain/error';

@Injectable()
class AuthHandlers {
  constructor(
    private jwtService: JwtService,
    private readonly authCommands: AuthCommands,
  ) {}

  async signUp(event: any): Promise<{ body: string; statusCode: number }> {
    try {
      const result = await this.authCommands.signUp(
        JSON.parse(event?.body) as UserProps,
      );

      return this.response(
        { ...result, user: userToViewModel(result.user) },
        201,
      );
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async signIn(event: any): Promise<{ body: string; statusCode: number }> {
    try {
      const body = event?.body ? JSON.parse(event.body) : {};

      const tokens = await this.authCommands.signIn(
        body?.username,
        body?.password,
      );

      return this.response(tokens, 200);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async logOut(event: any): Promise<{ statusCode: number }> {
    try {
      const payload = await this.authGuard(event);

      await this.authCommands.logOut(payload as ReqUser);

      return { statusCode: 200 };
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async refreshTokens(
    event: any,
  ): Promise<{ body: string; statusCode: number }> {
    try {
      const payload = await this.authGuard(event, true);

      const refreshToken = payload['refreshToken'];

      const tokens = await this.authCommands.refreshTokens(
        payload as ReqUser,
        refreshToken,
      );

      return this.response(tokens, 200);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  private async authGuard(event: any, refreshToken = false) {
    if (!event.headers?.Authorization)
      throw new CustomError({
        type: ErrorType.unauthorized,
        message: UserError[ErrorType.unauthorized].unauthorized,
      });

    const [, token] = event.headers.Authorization.split('Bearer ');

    return await this.jwtService
      .verifyAsync(token, {
        secret: refreshToken
          ? process.env.JWT_REFRESH_SECRET
          : process.env.JWT_ACCESS_SECRET,
      })
      .then(() => this.jwtService.decode(token))
      .catch(() => {
        throw new CustomError({
          type: ErrorType.unauthorized,
          message: UserError[ErrorType.unauthorized].unauthorized,
        });
      });
  }

  private async response(
    data: any,
    statusCode: number,
  ): Promise<{ body: string; statusCode: number }> {
    return { body: JSON.stringify(data), statusCode };
  }

  private async errorResponse(error: any) {
    const data = new HttpExceptions(error).exception();

    return {
      body: JSON.stringify({
        message: error.message,
        statusCode: data.getStatus(),
      }),
      statusCode: data.getStatus(),
    };
  }
}

export default AuthHandlers;

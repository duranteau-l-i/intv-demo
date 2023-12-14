import { Injectable } from '@nestjs/common';

import HttpExceptions from '@common/errors/HttpExceptions';

import UserQueries from '../../application/user.queries';
import { userToViewModel } from '../mapper/user.mapper';
import UserCommands from '../../application/user.commands';

import { ReqUser, UserProps } from '../../domain/model';

import { JwtService } from '@nestjs/jwt';
import CustomError, { ErrorType } from '@common/errors/CustomError';
import UserError from '../../domain/error';

@Injectable()
class UserHandlers {
  constructor(
    private jwtService: JwtService,
    private readonly userQueries: UserQueries,
    private readonly userCommands: UserCommands,
  ) {}

  async getUsers(event: any): Promise<{ body: string; statusCode: number }> {
    try {
      const payload = await this.authGuard(event);

      const response = await this.userQueries.getUsers(
        payload as ReqUser,
        event?.queryStringParameters,
      );

      return this.response(
        {
          ...response,
          data: response.data.map((user) => userToViewModel(user)),
        },
        200,
      );
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async getMe(event: any): Promise<{ body: string; statusCode: number }> {
    try {
      const payload = await this.authGuard(event);

      const user = await this.userQueries.getUserById(payload['sub']);

      return this.response(userToViewModel(user), 200);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async getUserById(event: any): Promise<{ body: string; statusCode: number }> {
    try {
      await this.authGuard(event);

      const user = await this.userQueries.getUserById(
        event?.pathParameters?.id,
      );

      return this.response(userToViewModel(user), 200);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async createUser(event: any): Promise<{ body: string; statusCode: number }> {
    try {
      const payload = await this.authGuard(event);

      const user = await this.userCommands.createUser(
        payload as ReqUser,
        JSON.parse(event.body) as UserProps,
      );

      return this.response(userToViewModel(user), 201);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async updateUser(event: any): Promise<{ body: string; statusCode: number }> {
    try {
      const payload = await this.authGuard(event);

      const user = await this.userCommands.updateUser(
        payload as ReqUser,
        event?.pathParameters?.id,
        JSON.parse(event.body) as Partial<UserProps>,
      );

      return this.response(userToViewModel(user), 200);
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  async removeUser(event: any): Promise<{ statusCode: number }> {
    try {
      const payload = await this.authGuard(event);

      await this.userCommands.removeUser(
        payload as ReqUser,
        event?.pathParameters?.id,
      );

      return { statusCode: 200 };
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  private async authGuard(event: any) {
    if (!event.headers?.Authorization)
      throw new CustomError({
        type: ErrorType.unauthorized,
        message: UserError[ErrorType.unauthorized].unauthorized,
      });

    const [, token] = event.headers.Authorization.split('Bearer ');

    return await this.jwtService
      .verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
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

export default UserHandlers;

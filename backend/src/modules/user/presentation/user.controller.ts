import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';

import { AccessTokenGuard } from '@common/guards';
import HttpExceptions from '@common/errors/HttpExceptions';
import { PaginationOptions, PaginationResponse } from '@common/types';
import RolesGuard, { Roles } from '@common/guards/Role.guard';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';

import UserQueries from '../application/user.queries';
import { UserViewModel, userToViewModel } from './mapper/user.mapper';
import UserCommands from '../application/user.commands';
import CreateUserDTO from './dto/CreateUser';
import { ReqUser, Role, UserProps } from '../domain/model';
import UpdateUserDTO from './dto/UpdateUser';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(Role.admin, Role.editor)
@UseInterceptors(LoggingInterceptor)
@Controller('/users')
class UserController {
  constructor(
    private readonly userQueries: UserQueries,
    private readonly userCommands: UserCommands,
  ) {}

  @Get()
  async getUsers(
    @Req() req: Request,
    @Query()
    queryParams?: PaginationOptions,
  ): Promise<PaginationResponse<UserViewModel>> {
    try {
      const response = await this.userQueries.getUsers(
        req.user as ReqUser,
        queryParams,
      );

      return {
        ...response,
        data: response.data.map((user) => userToViewModel(user)),
      };
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }

  @Roles(Role.admin, Role.editor, Role.user)
  @Get('/me')
  async getMe(@Req() req: Request): Promise<UserViewModel> {
    try {
      const user = await this.userQueries.getUserById(req.user['sub']);

      return userToViewModel(user);
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }

  @Get('/:id')
  async getUserById(@Param() params: { id: string }): Promise<UserViewModel> {
    try {
      const user = await this.userQueries.getUserById(params.id);

      return userToViewModel(user);
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }

  @Post()
  async createUser(
    @Req() req: Request,
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<UserViewModel> {
    try {
      const user = await this.userCommands.createUser(
        req.user as ReqUser,
        createUserDTO as UserProps,
      );

      return userToViewModel(user);
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }

  @Patch('/:id')
  async updateUser(
    @Req() req: Request,
    @Param() params: { id: string },
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<UserViewModel> {
    try {
      const user = await this.userCommands.updateUser(
        req.user as ReqUser,
        params.id,
        updateUserDTO as Partial<UserProps>,
      );

      return userToViewModel(user);
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }

  @Delete('/:id')
  async removeUser(
    @Req() req: Request,
    @Param() params: { id: string },
  ): Promise<void> {
    try {
      return await this.userCommands.removeUser(req.user as ReqUser, params.id);
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }
}

export default UserController;

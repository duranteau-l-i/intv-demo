import { Controller, Get, Query } from '@nestjs/common';

import HttpExceptions from '../../../common/errors/HttpExceptions';
import { PaginationOptions, PaginationResponse } from '../../../common/types';

import UserQueries from '../application/user.queries';
import User from '../domain/model/User';

@Controller('/user')
class UserController {
  constructor(private readonly userQueries: UserQueries) {}

  @Get()
  async getUsers(
    @Query()
    queryParams?: PaginationOptions,
  ): Promise<PaginationResponse<User>> {
    try {
      const response = await this.userQueries.getUsers(queryParams);

      return response;

      // return {
      //   ...response,
      //   data: response.data.map((user) => user.toJSON()),
      // };
    } catch (error) {
      throw new HttpExceptions(error).exception();
    }
  }
}

export default UserController;

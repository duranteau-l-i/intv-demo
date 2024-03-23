import CustomError, { ErrorType } from '@common/errors/CustomError';
import { ICommandHandler } from '@common/domain/CommandHandler';

import { User } from '../../../domain/model';
import UserError from '../../../domain/error';
import IUserRepository from '../../../domain/user.repository';
import CreateUserCommand from './CreateUser.command';
import IUserCache from 'src/modules/user/domain/user.cache';

class CreateUserCommandHandler implements ICommandHandler {
  constructor(
    private userRepository: IUserRepository,
    private userCache: IUserCache,
  ) {}

  async handle(command: CreateUserCommand): Promise<User> {
    await command.createUserEntity();

    const userExists = await this.userRepository.getUserByUsername(
      command.user.username,
    );
    if (userExists) {
      throw new CustomError({
        type: ErrorType.badRequest,
        message: UserError[ErrorType.badRequest].userAlreadyExists,
      });
    }

    const user = await this.userRepository.createUser(command.user);

    await this.userCache.addUser(user);

    return user;
  }
}

export default CreateUserCommandHandler;

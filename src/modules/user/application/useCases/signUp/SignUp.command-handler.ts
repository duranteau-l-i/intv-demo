import { ICommandHandler } from '../../../../../common/domain/CommandHandler';
import CustomError, {
  ErrorType,
} from '../../../../../common/errors/CustomError';

import IUserRepository from '../../../domain/user.repository';
import UserError from '../../../domain/error';
import CreateUserCommand from './SignUp.command';

class CreateUserCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(command: CreateUserCommand): Promise<string> {
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

    return user.refreshToken;
  }
}

export default CreateUserCommandHandler;

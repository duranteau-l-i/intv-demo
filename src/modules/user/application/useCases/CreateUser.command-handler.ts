import { ICommandHandler } from '../../../../common/domain/CommandHandler';
import User from '../../domain/model/User';
import IUserRepository from '../../domain/user.repository';
import CreateUserCommand from './CreateUser.command';

class CreateUserCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(command: CreateUserCommand): Promise<User> {
    await command.createUserEntity();
    return this.userRepository.createUser(command.user);
  }
}

export default CreateUserCommandHandler;

import { ICommandHandler } from '../../../../common/domain/CommandHandler';
import User from '../../domain/model/User';
import IUserRepository from '../../domain/user.repository';
import UpdateUserCommand from './UpdateUser.command';

class UpdateUserCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.getUserById(command.id);

    if (command.firstName) user.firstName = command.firstName;
    if (command.lastName) user.lastName = command.lastName;

    return this.userRepository.updateUser(user);
  }
}

export default UpdateUserCommandHandler;

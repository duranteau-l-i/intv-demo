import { ICommandHandler } from '@common/domain/CommandHandler';
import { User } from '../../../domain/model';
import UpdateUserCommand from './UpdateUser.command';
import IUserRepository from '../../../domain/user.repository';
import IUserCache from '../../../domain/user.cache';

class UpdateUserCommandHandler implements ICommandHandler {
  constructor(
    private userRepository: IUserRepository,
    private userCache: IUserCache,
  ) {}

  async handle(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.getUserById(command.id);

    if (command.firstName) user.firstName = command.firstName;
    if (command.lastName) user.lastName = command.lastName;

    const userUpdated = await this.userRepository.updateUser(user);

    await this.userCache.addUser(userUpdated);

    return userUpdated;
  }
}

export default UpdateUserCommandHandler;

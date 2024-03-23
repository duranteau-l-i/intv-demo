import { ICommandHandler } from '@common/domain/CommandHandler';
import IUserRepository from '../../../domain/user.repository';
import IUserCache from '../../../domain/user.cache';
import RemoveUserCommand from './RemoveUser.command';

class RemoveUserCommandHandler implements ICommandHandler {
  constructor(
    private userRepository: IUserRepository,
    private userCache: IUserCache,
  ) {}

  async handle(command: RemoveUserCommand): Promise<void> {
    await this.userRepository.removeUser(command.id);

    await this.userCache.removeUser(command.id);
  }
}

export default RemoveUserCommandHandler;

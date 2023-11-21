import { ICommandHandler } from '@common/domain/CommandHandler';
import IUserRepository from '../../../domain/user.repository';
import RemoveUserCommand from './RemoveUser.command';

class RemoveUserCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(command: RemoveUserCommand): Promise<void> {
    return await this.userRepository.removeUser(command.id);
  }
}

export default RemoveUserCommandHandler;

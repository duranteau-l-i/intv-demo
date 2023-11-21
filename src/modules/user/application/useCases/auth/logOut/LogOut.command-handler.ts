import { ICommandHandler } from '../../../../../../common/domain/CommandHandler';
import IUserRepository from '../../../../domain/user.repository';
import LogOutCommand from './LogOut.command';

class LogOutCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(command: LogOutCommand): Promise<void> {
    const user = await this.userRepository.getUserById(command.id);

    user.refreshToken = null;
    await this.userRepository.updateUser(user);
  }
}

export default LogOutCommandHandler;

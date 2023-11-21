import { ICommandHandler } from '../../../../../../common/domain/CommandHandler';
import CustomError, {
  ErrorType,
} from '../../../../../../common/errors/CustomError';

import IUserRepository from '../../../../domain/user.repository';
import UserError from '../../../../domain/error';
import SignUpCommand from './SignUp.command';
import Hash from '../../../../../../utils/Hash';
import { User } from '../../../../domain/model';
import { Tokens } from '../../../auth.commands';

class SignUpCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(
    command: SignUpCommand,
    generateTokens: (data: {
      sub: string;
      username: string;
      role: string;
    }) => Promise<Tokens>,
  ): Promise<{
    tokens: Tokens;
    user: User;
  }> {
    await command.createUserEntity();

    const user = await this.userRepository.getUserByUsername(
      command.user.username,
    );
    if (user) {
      throw new CustomError({
        type: ErrorType.badRequest,
        message: UserError[ErrorType.badRequest].userAlreadyExists,
      });
    }

    const { accessToken, refreshToken } = await generateTokens({
      sub: command.user.id,
      username: command.user.username,
      role: command.user.role,
    });

    const userCreated = await this.createUser(refreshToken, command);

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
      user: userCreated,
    };
  }

  private async createUser(refreshToken: string, command: SignUpCommand) {
    const hash = new Hash();
    await hash.hash(refreshToken);

    command.user.refreshToken = hash.hashedRefreshToken;
    const userCreated = await this.userRepository.createUser(command.user);
    return userCreated;
  }
}

export default SignUpCommandHandler;

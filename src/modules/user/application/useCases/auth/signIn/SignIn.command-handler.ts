import CustomError, {
  ErrorType,
} from '../../../../../../common/errors/CustomError';
import { ICommandHandler } from '../../../../../../common/domain/CommandHandler';
import IUserRepository from '../../../../domain/user.repository';
import SignInCommand from './SignIn.command';
import UserError from '../../../../domain/error';
import Hash from '../../../../../../utils/Hash';
import Password from '../../../../domain/model/Password';
import { Tokens } from '../../../auth.commands';
import { User } from 'src/modules/user/domain/model';

class SignInCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(
    command: SignInCommand,
    generateTokens: (data: {
      sub: string;
      username: string;
      role: string;
    }) => Promise<Tokens>,
  ): Promise<Tokens> {
    try {
      const user = await this.userRepository.getUserByUsername(
        command.username,
      );

      await this.verifyPasswordMatches(user, command);

      const { accessToken, refreshToken } = await generateTokens({
        sub: user.id,
        username: user.username,
        role: user.role,
      });

      await this.updateUser(refreshToken, user);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new CustomError({
        type: ErrorType.badRequest,
        message: UserError[ErrorType.badRequest].signIn,
      });
    }
  }

  private async verifyPasswordMatches(user: User, command: SignInCommand) {
    const password = new Password(user.password);
    const passwordMatches = await password.verifyHash(command.password);

    if (!passwordMatches) {
      throw new Error();
    }
  }

  private async updateUser(refreshToken: string, user: User) {
    const hash = new Hash();
    await hash.hash(refreshToken);

    user.refreshToken = hash.hashedRefreshToken;
    await this.userRepository.updateUser(user);
  }
}

export default SignInCommandHandler;

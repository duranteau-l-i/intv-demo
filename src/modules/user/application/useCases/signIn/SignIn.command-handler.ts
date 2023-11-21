import CustomError, {
  ErrorType,
} from '../../../../../common/errors/CustomError';
import { ICommandHandler } from '../../../../../common/domain/CommandHandler';
import IUserRepository from '../../../domain/user.repository';
import SignInCommand from './SignIn.command';
import UserError from '../../../domain/error';
import Hash from '../../../../../utils/Hash';
import Password from '../../../domain/model/Password';

class SignInCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(
    command: SignInCommand,
    generateTokens: (data: {
      sub: string;
      username: string;
      role: string;
    }) => Promise<{ accessToken: string; refreshToken: string }>,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const user = await this.userRepository.getUserByUsername(
        command.username,
      );

      const password = new Password(user.password);
      const passwordMatches = await password.verifyHash(command.password);

      if (!passwordMatches) {
        throw new Error();
      }

      const { accessToken, refreshToken } = await generateTokens({
        sub: user.id,
        username: user.username,
        role: user.role,
      });

      const hash = new Hash();
      await hash.hash(refreshToken);

      user.refreshToken = hash.hashedRefreshToken;
      await this.userRepository.updateUser(user);

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
}

export default SignInCommandHandler;

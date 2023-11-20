import CustomError, {
  ErrorType,
} from '../../../../../common/errors/CustomError';
import { ICommandHandler } from '../../../../../common/domain/CommandHandler';
import IUserRepository from '../../../domain/user.repository';
import SignInCommand from './SignIn.command';
import UserError from '../../../domain/error';
import Token from '../../../domain/model/Token';
import Password from '../../../domain/model/Password';

class SignInCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(
    command: SignInCommand,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this.userRepository.getUserByUsername(
        command.username,
      );

      const password = new Password(user.password);
      const passwordMatches = await password.verifyHash(command.password);

      if (!passwordMatches) {
        throw new Error();
      }

      const token = new Token({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      await token.setHashedRefreshToken();

      return {
        accessToken: token.accessToken,
        refreshToken: token.hashedRefreshToken,
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

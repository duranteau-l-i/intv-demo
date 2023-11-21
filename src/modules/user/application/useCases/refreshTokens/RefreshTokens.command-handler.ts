import Hash from '../../../../../utils/Hash';
import { ICommandHandler } from '../../../../../common/domain/CommandHandler';
import IUserRepository from '../../../domain/user.repository';
import RefreshTokensCommand from './RefreshTokens.command';
import CustomError, {
  ErrorType,
} from '../../../../../common/errors/CustomError';
import UserError from '../../../../../modules/user/domain/error';
import { User } from 'src/modules/user/domain/model';
import { Tokens } from '../../auth.commands';

class RefreshTokensCommandHandler implements ICommandHandler {
  constructor(private userRepository: IUserRepository) {}

  async handle(
    command: RefreshTokensCommand,
    generateTokens: (data: {
      sub: string;
      username: string;
      role: string;
    }) => Promise<Tokens>,
  ): Promise<Tokens> {
    try {
      const user = await this.userRepository.getUserById(command.id);

      const hash = await this.verifyRefreshTokenMatches(command, user);

      const { accessToken, refreshToken } = await generateTokens({
        sub: user.id,
        username: user.username,
        role: user.role,
      });

      await hash.hash(refreshToken);

      user.refreshToken = hash.hashedRefreshToken;
      await this.userRepository.updateUser(user);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new CustomError({
        type: ErrorType.forbidden,
        message: UserError[ErrorType.forbidden].accessDenied,
      });
    }
  }

  private async verifyRefreshTokenMatches(
    command: RefreshTokensCommand,
    user: User,
  ) {
    const hash = new Hash();

    if (command.refreshToken.startsWith('$argon2')) {
      if (user.refreshToken !== command.refreshToken) throw new Error();

      return hash;
    }

    const refreshTokenMatches = await hash.verifyHash(
      user.refreshToken,
      command.refreshToken,
    );

    if (!refreshTokenMatches) throw new Error();

    return hash;
  }
}

export default RefreshTokensCommandHandler;

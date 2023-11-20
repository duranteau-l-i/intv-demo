import Token from '../../../domain/model/Token';
import Password from '../../../domain/model/Password';
import User, { Role, UserProps } from '../../../domain/model/User';

class SignUpCommand {
  user: User;
  userProps: UserProps;

  constructor(userProps: UserProps) {
    this.userProps = userProps;
  }

  async createUserEntity() {
    let role = this.userProps.role;
    if (
      !this.userProps.role ||
      !Object.values(Role).includes(this.userProps.role)
    )
      role = Role.user;

    const passwordHashed = await this.setHashedPassword();

    const user = new User({
      ...this.userProps,
      role,
      password: passwordHashed,
    });

    const refreshToken = await this.setRefreshToken(user);
    user.refreshToken = refreshToken;

    this.user = user;
  }

  private async setHashedPassword() {
    const password = new Password(this.userProps.password);
    password.isValid();
    const passwordHashed = await password.hash();
    return passwordHashed;
  }

  private async setRefreshToken(user: User) {
    const token = new Token({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return await token.getHashedRefreshToken();
  }
}

export default SignUpCommand;

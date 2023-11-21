import Password from '../../../domain/model/Password';
import { User, Role, UserProps } from '../../../domain/model';

class SignUpCommand {
  userProps: UserProps;
  user: User;

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

    this.user = user;
  }

  private async setHashedPassword() {
    const password = new Password(this.userProps.password);
    password.isValid();
    const passwordHashed = await password.hash();
    return passwordHashed;
  }
}

export default SignUpCommand;

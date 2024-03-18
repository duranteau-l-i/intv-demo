import Password from '../../../domain/model/Password';
import { User, Role, UserProps } from '../../../domain/model/';

class CreateUserCommand {
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

    const password = new Password(this.userProps.password);
    password.isValid();
    const passwordHashed = await password.hash();

    this.user = new User({
      ...this.userProps,
      role,
      password: passwordHashed,
    });
  }
}

export default CreateUserCommand;

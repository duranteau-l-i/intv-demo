import { UserProps } from '../../domain/model/User';

class UpdateUserCommand {
  id: string;
  firstName?: string;
  lastName?: string;

  constructor(id: string, data: Partial<UserProps>) {
    this.id = id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
  }
}

export default UpdateUserCommand;

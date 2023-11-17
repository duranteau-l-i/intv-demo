import { v4 as uuidv4 } from 'uuid';

import { Entity } from '../../../../common/domain/Entity';

export enum Role {
  admin,
  editor,
  user,
}

export type UserProps = {
  id: uuidv4;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: Role;
};

class User extends Entity<User> {
  constructor(private _props: UserProps) {
    super(_props.id);
  }

  get id(): uuidv4 {
    return this._id;
  }

  get firstName(): string {
    return this._props.firstName;
  }

  get lastName(): string {
    return this._props.lastName;
  }

  get email(): string {
    return this._props.email;
  }

  get username(): string {
    return this._props.username;
  }

  get password(): string {
    return this._props.password;
  }

  get role(): Role {
    return this._props.role;
  }
}

export default User;

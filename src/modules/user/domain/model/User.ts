import { v4 as uuidv4 } from 'uuid';

import { Entity } from '@common/domain/Entity';
import CustomError, { ErrorType } from '@common/errors/CustomError';
import UserError from '../error';
import EmailAddress from './EmailAddress';

export enum Role {
  admin = 'admin',
  editor = 'editor',
  user = 'user',
}

export type UserProps = {
  id: uuidv4;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  refreshToken?: string;
};

class User extends Entity<User> {
  _firstName: string;
  _lastName: string;
  _email: string;
  _username: string;
  _password: string;
  _role: Role;
  _refreshToken: string = null;

  constructor(props: UserProps) {
    super(props.id);

    this._firstName = this.checkIfHasMinimumLength(
      'firstName',
      props.firstName,
    );
    this._lastName = this.checkIfHasMinimumLength('lastName', props.lastName);
    this._username = this.checkIfHasMinimumLength('username', props.username);

    this._password = props.password;
    this._email = new EmailAddress(props.email).value;
    this._role = this.defaultRole(props.role);
    if (props.refreshToken) this._refreshToken = props.refreshToken;
  }

  get id(): uuidv4 {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = this.checkIfHasMinimumLength('firstName', value);
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = this.checkIfHasMinimumLength('lastName', value);
  }

  get email(): string {
    return this._email;
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  get role(): Role {
    return this._role;
  }

  defaultRole(role: Role | null) {
    if (!Object.values(Role).includes(role)) return Role.user;
    return role;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  set refreshToken(value: string) {
    this._refreshToken = value;
  }

  checkIfHasMinimumLength(field: string, value: string) {
    if (value.length < 3) {
      throw new CustomError({
        type: ErrorType.badRequest,
        message: UserError[ErrorType.badRequest].minLength(field),
      });
    }

    return value;
  }
}

export default User;

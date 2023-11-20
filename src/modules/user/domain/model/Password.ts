import * as argon2 from 'argon2';

import CustomError, { ErrorType } from '../../../../common/errors/CustomError';
import { ValueObject } from '../../../../common/domain/ValueObject';
import UserError from '../error';

class Password extends ValueObject<Password> {
  _value: string;

  constructor(email: string) {
    super();
    this._value = email;
  }

  get value(): string {
    return this._value;
  }

  isValid(): boolean {
    const regex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[\d])(?=.{6,})/,
    );

    const valid = regex.test(this._value);

    if (!valid) {
      throw new CustomError({
        type: ErrorType.badRequest,
        message: UserError[ErrorType.badRequest].notValidPassword,
      });
    }

    return true;
  }

  async hash() {
    return await argon2.hash(this._value);
  }

  async verifyHash(data: string) {
    return await argon2.verify(this._value, data);
  }
}

export default Password;

import CustomError, { ErrorType } from '@common/errors/CustomError';
import { ValueObject } from '@common/domain/ValueObject';
import UserError from '../error';

class EmailAddress extends ValueObject<EmailAddress> {
  _value: string;

  constructor(email: string) {
    super();
    this._value = this.isValid(email);
  }

  get value(): string {
    return this._value;
  }

  private isValid(value: string): string {
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

    const valid = regexp.test(value);

    if (!valid) {
      throw new CustomError({
        type: ErrorType.badRequest,
        message: UserError[ErrorType.badRequest].notValidEmailAddress,
      });
    }

    return value;
  }
}

export default EmailAddress;

import * as argon2 from 'argon2';

import { ValueObject } from '../common/domain/ValueObject';

class Hash extends ValueObject<Hash> {
  value: string;

  constructor() {
    super();
  }

  get hashedRefreshToken(): string {
    return this.value;
  }

  async hash(value: string) {
    this.value = await argon2.hash(value);
    return this.value;
  }

  verifyHash(value: string, initialValue: string) {
    argon2.verify(value, initialValue);
  }
}

export default Hash;

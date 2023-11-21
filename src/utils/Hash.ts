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

  async verifyHash(
    hashedValue: string,
    valueToCompare: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedValue, valueToCompare);
  }
}

export default Hash;

import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

import { ValueObject } from '../../../../common/domain/ValueObject';
import { Role } from './User';

class Token extends ValueObject<Token> {
  _accessToken: string;
  _refreshToken: string;
  _hashedRefreshToken: string;

  constructor(private data: { userId: string; username: string; role: Role }) {
    super();
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  async getHashedRefreshToken(): Promise<string> {
    await this.getTokens();
    await this.updateRefreshToken();

    return this._hashedRefreshToken;
  }

  private async getTokens() {
    const accessToken = this.generateToken('JWT_ACCESS_SECRET', '15m');
    const refreshToken = this.generateToken('JWT_REFRESH_SECRET', '7d');

    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
  }

  private generateToken(secret: string, expiresIn: string): string {
    return jwt.sign(this.data, secret, { expiresIn });
  }

  async updateRefreshToken() {
    this._hashedRefreshToken = await argon2.hash(this.refreshToken);
  }

  verifyHash(refreshToken: string, userRefreshToken: string) {
    argon2.verify(refreshToken, userRefreshToken);
  }
}

export default Token;

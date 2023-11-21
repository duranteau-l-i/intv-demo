import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

import UserInMemoryRepository from '../../../infrastructure/UserInMemoryRepository';
import { User, Role, UserProps } from '../../../domain/model';
import AuthCommands from '../../../application/auth.commands';
import Password from '../../../domain/model/Password';
import UserError from '../../../domain/error';
import { ErrorType } from '../../../../../common/errors/CustomError';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '../../../../../common/guards';
import { userToViewModel } from '../../mapper/user.mapper';
import Hash from '../../../../../utils/Hash';

describe('Auth', () => {
  let userRepository: UserInMemoryRepository;
  let authCommands: AuthCommands;

  beforeAll(async () => {
    userRepository = new UserInMemoryRepository();

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.dev.local'],
        }),
        JwtModule.register({}),
      ],
      providers: [
        AuthCommands,
        {
          provide: 'UserRepository',
          useValue: userRepository,
        },
        AccessTokenStrategy,
        RefreshTokenStrategy,
      ],
    }).compile();

    authCommands = app.get<AuthCommands>(AuthCommands);
  });

  beforeEach(() => {
    userRepository.seedUsers([]);
  });

  describe('signUp', () => {
    it('should return the tokens', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
      };

      const result = await authCommands.signUp(user1 as UserProps);

      expect(result.tokens.accessToken).not.toBeNull();
      expect(result.tokens.refreshToken).not.toBeNull();

      expect(userToViewModel(result.user)).toEqual(
        expect.objectContaining({
          firstName: 'john',
          lastName: 'doe',
          email: 'user1@test.com',
          username: 'user1',
          role: Role.user,
        }),
      );
    });
  });

  describe('signIn', () => {
    it('should return the tokens', async () => {
      const pass = 'Abcd1!';
      const password = new Password(pass);
      const passwordHashed = await password.hash();

      const user1 = new User({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: passwordHashed,
        role: Role.admin,
      });

      userRepository.seedUsers([user1]);

      const tokens = await authCommands.signIn(user1.username, pass);

      expect(tokens.accessToken).not.toBeNull();
      expect(tokens.refreshToken).not.toBeNull();
    });

    it('should return an error if the password is incorrect', async () => {
      const pass = 'Abcd1!';
      const password = new Password(pass);
      const passwordHashed = await password.hash();

      const user1 = new User({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: passwordHashed,
        role: Role.admin,
      });

      userRepository.seedUsers([user1]);

      await expect(
        authCommands.signIn(user1.username, pass + 'wrong'),
      ).rejects.toThrowError(UserError[ErrorType.badRequest].signIn);
    });
  });

  describe('logOut', () => {
    it('should return the tokens', async () => {
      const pass = 'Abcd1!';
      const password = new Password(pass);
      const passwordHashed = await password.hash();

      const user1 = new User({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: passwordHashed,
        role: Role.admin,
      });

      userRepository.seedUsers([user1]);

      await authCommands.logOut(user1.id);

      const user = userRepository.users[0];
      expect(user.refreshToken).toBeNull();
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens', async () => {
      const refreshToken = await new JwtService().signAsync(
        {
          id: 'user1',
          username: 'user1',
          role: Role.admin,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      );
      const hash = new Hash();
      const hashedRefreshToken = await hash.hash(refreshToken);

      const pass = 'Abcd1!';
      const password = new Password(pass);
      const passwordHashed = await password.hash();

      const user1 = new User({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: passwordHashed,
        role: Role.admin,
        refreshToken: hashedRefreshToken,
      });

      userRepository.seedUsers([user1]);

      const tokens = await authCommands.refreshTokens(
        user1.id,
        hashedRefreshToken,
      );

      expect(tokens.accessToken).not.toBeNull();
      expect(tokens.refreshToken).not.toBeNull();
    });

    it('should return an error access denied if no valid refreshToken', async () => {
      const refreshToken = await new JwtService().signAsync(
        {
          id: 'user1',
          username: 'user1',
          role: Role.admin,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      );
      const hash = new Hash();
      const hashedRefreshToken = await hash.hash(refreshToken);

      const pass = 'Abcd1!';
      const password = new Password(pass);
      const passwordHashed = await password.hash();

      const user1 = new User({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: passwordHashed,
        role: Role.admin,
        refreshToken: hashedRefreshToken,
      });

      userRepository.seedUsers([user1]);

      await expect(
        authCommands.refreshTokens(user1.id, 'wrong-refreshToken'),
      ).rejects.toThrowError(UserError[ErrorType.forbidden].accessDenied);
    });
  });
});

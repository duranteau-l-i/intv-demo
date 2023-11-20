import { Test, TestingModule } from '@nestjs/testing';

import UserInMemoryRepository from '../../../infrastructure/UserInMemoryRepository';
import { User, Role, UserProps } from '../../../domain/model';
import AuthCommands from '../../../application/auth.commands';
import Password from '../../../domain/model/Password';
import UserError from '../../../domain/error';
import { ErrorType } from '../../../../../common/errors/CustomError';

describe('Auth', () => {
  let userRepository: UserInMemoryRepository;
  let authCommands: AuthCommands;

  beforeAll(async () => {
    userRepository = new UserInMemoryRepository();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthCommands,
        {
          provide: 'UserRepository',
          useValue: userRepository,
        },
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

      const tokens = await authCommands.signUp(user1 as UserProps);

      expect(tokens.accessToken).not.toBeNull();
      expect(tokens.refreshToken).not.toBeNull();

      const user = userRepository.users[0];
      expect({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
      }).toEqual({
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        role: Role.user,
      });
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
});

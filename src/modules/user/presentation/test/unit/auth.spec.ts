import { Test, TestingModule } from '@nestjs/testing';

import UserInMemoryRepository from '../../../infrastructure/UserInMemoryRepository';
import { Role, UserProps } from '../../../domain/model/User';
import AuthCommands from '../../../application/auth.commands';

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
    it('should return a token', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
      };

      const token = await authCommands.signUp(user1 as UserProps);

      expect(token).not.toBeNull;

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
});

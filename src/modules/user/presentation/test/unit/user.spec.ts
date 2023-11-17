import { Test, TestingModule } from '@nestjs/testing';

import UserQueries from '../../../application/user.queries';
import UserCommands from '../../../application/user.commands';
import UserInMemoryRepository from '../../../infrastructure/UserInMemoryRepository';

import User, { Role, UserProps } from '../../../domain/model/User';
import { OrderBy } from '../../../../../common/types/pagination';
import UserError from '../../../domain/error';
import { ErrorType } from '../../../../../common/errors/CustomError';
import Password from '../../../domain/model/Password';
import { userToViewModel } from '../../mapper/user.mapper';

describe('User', () => {
  let userQueries: UserQueries;
  let userCommands: UserCommands;
  let userRepository: UserInMemoryRepository;

  beforeAll(async () => {
    userRepository = new UserInMemoryRepository();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserQueries,
        UserCommands,
        {
          provide: 'UserRepository',
          useValue: userRepository,
        },
      ],
    }).compile();

    userQueries = app.get<UserQueries>(UserQueries);
    userCommands = app.get<UserCommands>(UserCommands);
  });

  beforeEach(() => {
    userRepository.seedUsers([]);
  });

  describe('getUsers', () => {
    it('should return a empty list', async () => {
      userRepository.seedUsers([]);

      const users = await userQueries.getUsers();

      expect(users).toEqual({
        count: 0,
        data: [],
        orderBy: 'ASC',
        orderValue: 'username',
        page: 1,
        pages: 0,
        perPage: 10,
      });
    });

    it('should return a list of users', async () => {
      const user1 = new User({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });
      const user2 = new User({
        id: 'user2',
        firstName: 'steve',
        lastName: 'artist',
        email: 'user1@test.com',
        username: 'user2',
        password: 'Abcd1!',
        role: Role.editor,
      });

      userRepository.seedUsers([user1, user2]);

      const users = await userQueries.getUsers();

      expect(users).toMatchObject({
        count: 2,
        orderBy: 'ASC',
        orderValue: 'username',
        page: 1,
        pages: 1,
        perPage: 10,
        data: [
          new User({
            id: 'user1',
            firstName: 'john',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            password: 'Abcd1!',
            role: Role.admin,
          }),
          new User({
            id: 'user2',
            firstName: 'steve',
            lastName: 'artist',
            email: 'user1@test.com',
            username: 'user2',
            password: 'Abcd1!',
            role: Role.editor,
          }),
        ],
      });

      const usersLastName = await userQueries.getUsers({
        orderValue: 'lastName',
      });

      expect(usersLastName).toMatchObject({
        count: 2,
        orderBy: 'ASC',
        orderValue: 'lastName',
        page: 1,
        pages: 1,
        perPage: 10,
        data: [
          new User({
            id: 'user2',
            firstName: 'steve',
            lastName: 'artist',
            email: 'user1@test.com',
            username: 'user2',
            password: 'Abcd1!',
            role: Role.editor,
          }),
          new User({
            id: 'user1',
            firstName: 'john',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            password: 'Abcd1!',
            role: Role.admin,
          }),
        ],
      });

      const usersDesc = await userQueries.getUsers({
        orderBy: OrderBy.DESC,
      });

      expect(usersDesc).toMatchObject({
        count: 2,
        orderBy: 'DESC',
        orderValue: 'username',
        page: 1,
        pages: 1,
        perPage: 10,
        data: [
          new User({
            id: 'user1',
            firstName: 'john',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            password: 'Abcd1!',
            role: Role.admin,
          }),
          new User({
            id: 'user2',
            firstName: 'steve',
            lastName: 'artist',
            email: 'user1@test.com',
            username: 'user2',
            password: 'Abcd1!',
            role: Role.editor,
          }),
        ],
      });
    });
  });

  describe('getUserById', () => {
    it('should return an user', async () => {
      const user1 = new User({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });
      const user2 = new User({
        id: 'user2',
        firstName: 'steve',
        lastName: 'artist',
        email: 'user1@test.com',
        username: 'user2',
        password: 'Abcd1!',
        role: Role.editor,
      });

      userRepository.seedUsers([user1, user2]);
      const users = await userQueries.getUserById(user1.id);

      expect(users).toEqual(
        new User({
          id: 'user1',
          firstName: 'john',
          lastName: 'doe',
          email: 'user1@test.com',
          username: 'user1',
          password: 'Abcd1!',
          role: Role.admin,
        }),
      );
    });

    it('should return an user', async () => {
      const user1 = new User({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });
      const user2 = new User({
        id: 'user2',
        firstName: 'steve',
        lastName: 'artist',
        email: 'user1@test.com',
        username: 'user2',
        password: 'Abcd1!',
        role: Role.editor,
      });

      userRepository.seedUsers([user1, user2]);

      await expect(userQueries.getUserById('wrong-id')).rejects.toThrowError(
        UserError[ErrorType.notFound].byId,
      );
    });
  });

  describe('createUser', () => {
    it('should return an user', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
      };

      const user = await userCommands.createUser(user1 as UserProps);

      expect(userToViewModel(user)).toEqual({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        role: Role.user,
      });
    });

    it('should return an error if the firstName length is less than 3 characters', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        id: 'user1',
        firstName: 'jo',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      };

      await expect(userCommands.createUser(user1)).rejects.toThrowError(
        UserError[ErrorType.badRequest].minLength('firstName'),
      );
    });

    it('should return an error if the firstName length is less than 3 characters', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'us',
        password: 'Abcd1!',
        role: Role.admin,
      };

      await expect(userCommands.createUser(user1)).rejects.toThrowError(
        UserError[ErrorType.badRequest].minLength('username'),
      );
    });

    it('should return an error if not a valid email address', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      };

      await expect(userCommands.createUser(user1)).rejects.toThrowError(
        UserError[ErrorType.badRequest].notValidEmailAddress,
      );
    });

    it('should return an error if not a valid password', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      };

      await expect(userCommands.createUser(user1)).rejects.toThrowError(
        UserError[ErrorType.badRequest].notValidEmailAddress,
      );
    });
  });
});

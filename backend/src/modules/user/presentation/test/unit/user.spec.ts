import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import UserQueries from '../../../application/user.queries';
import UserCommands from '../../../application/user.commands';
import UserInMemoryRepository from '../../../infrastructure/repositories/UserInMemoryRepository';
import UserInMemoryCache from '../../../infrastructure/caches/UserInMemoryCache';

import { OrderBy } from '@common/types/pagination';
import { ErrorType } from '@common/errors/CustomError';

import { User, Role, UserProps } from '../../../domain/model';
import UserError from '../../../domain/error';
import { userToViewModel } from '../../mapper/user.mapper';
import { makeExpiredDate, makeUserJWTToken } from '../utils/userToken';

const admin = new User({
  id: 'admin',
  firstName: 'john',
  lastName: 'doe',
  email: 'admin@test.com',
  username: 'admin',
  password: 'Abcd1!',
  role: Role.admin,
});

const exp = makeExpiredDate(15);
const reqUser = makeUserJWTToken(admin, exp);

describe('User', () => {
  let userQueries: UserQueries;
  let userCommands: UserCommands;
  let userRepository: UserInMemoryRepository;
  let userCache: UserInMemoryCache;

  beforeAll(async () => {
    userRepository = new UserInMemoryRepository();
    userCache = new UserInMemoryCache();

    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.dev.local'],
        }),
      ],
      providers: [
        UserQueries,
        UserCommands,
        {
          provide: 'UserRepository',
          useValue: userRepository,
        },
        {
          provide: 'UserCache',
          useValue: userCache,
        },
      ],
    }).compile();

    userQueries = app.get<UserQueries>(UserQueries);
    userCommands = app.get<UserCommands>(UserCommands);
  });

  beforeEach(() => {
    userRepository.seedUsers([]);
    userCache.seedUsers(new Map());
  });

  describe('getUsers', () => {
    it('should return a empty list', async () => {
      userRepository.seedUsers([]);
      userCache.seedUsers(new Map());

      const users = await userQueries.getUsers(reqUser);

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

    it('should return an error access denied', async () => {
      userRepository.seedUsers([]);
      userCache.seedUsers(new Map());

      await expect(
        userQueries.getUsers({ ...reqUser, role: Role.user }),
      ).rejects.toThrowError(UserError[ErrorType.forbidden].accessDenied);
    });

    it('should return a list of users', async () => {
      const user1 = new User({
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });
      const user2 = new User({
        id: 'user2_id',
        firstName: 'steve',
        lastName: 'artist',
        email: 'user1@test.com',
        username: 'user2',
        password: 'Abcd1!',
        role: Role.editor,
      });

      userRepository.seedUsers([user1, user2]);
      userCache.seedUsers(new Map());

      const users = await userQueries.getUsers(reqUser);

      expect(users).toMatchObject({
        count: 2,
        orderBy: 'ASC',
        orderValue: 'username',
        page: 1,
        pages: 1,
        perPage: 10,
        data: [
          new User({
            id: 'user1_id',
            firstName: 'john',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            password: 'Abcd1!',
            role: Role.admin,
          }),
          new User({
            id: 'user2_id',
            firstName: 'steve',
            lastName: 'artist',
            email: 'user1@test.com',
            username: 'user2',
            password: 'Abcd1!',
            role: Role.editor,
          }),
        ],
      });

      const usersLastName = await userQueries.getUsers(reqUser, {
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
            id: 'user2_id',
            firstName: 'steve',
            lastName: 'artist',
            email: 'user1@test.com',
            username: 'user2',
            password: 'Abcd1!',
            role: Role.editor,
          }),
          new User({
            id: 'user1_id',
            firstName: 'john',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            password: 'Abcd1!',
            role: Role.admin,
          }),
        ],
      });

      const usersDesc = await userQueries.getUsers(reqUser, {
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
            id: 'user1_id',
            firstName: 'john',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            password: 'Abcd1!',
            role: Role.admin,
          }),
          new User({
            id: 'user2_id',
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
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });
      const user2 = new User({
        id: 'user2_id',
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
          id: 'user1_id',
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
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });
      const user2 = new User({
        id: 'user2_id',
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
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
      };

      const user = await userCommands.createUser(reqUser, user1 as UserProps);

      expect(userToViewModel(user)).toEqual({
        id: 'user1_id',
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
        id: 'user1_id',
        firstName: 'jo',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      };

      await expect(
        userCommands.createUser(reqUser, user1),
      ).rejects.toThrowError(
        UserError[ErrorType.badRequest].minLength('firstName'),
      );
    });

    it('should return an error if the username length is less than 3 characters', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'us',
        password: 'Abcd1!',
        role: Role.admin,
      };

      await expect(
        userCommands.createUser(reqUser, user1),
      ).rejects.toThrowError(
        UserError[ErrorType.badRequest].minLength('username'),
      );
    });

    it('should return an error if not a valid email address', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      };

      await expect(
        userCommands.createUser(reqUser, user1),
      ).rejects.toThrowError(
        UserError[ErrorType.badRequest].notValidEmailAddress,
      );
    });

    it('should return an error if not a valid password', async () => {
      userRepository.seedUsers([]);

      const user1 = {
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      };

      await expect(
        userCommands.createUser(reqUser, user1),
      ).rejects.toThrowError(
        UserError[ErrorType.badRequest].notValidEmailAddress,
      );
    });
  });

  describe('updateUser', () => {
    it('should return an user', async () => {
      const user1 = new User({
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });

      userRepository.seedUsers([user1]);

      const user = await userCommands.updateUser(reqUser, user1.id, {
        firstName: 'john updated',
        lastName: 'doe updated',
      });

      expect(userToViewModel(user)).toEqual({
        id: 'user1_id',
        firstName: 'john updated',
        lastName: 'doe updated',
        email: 'user1@test.com',
        username: 'user1',
        role: Role.admin,
      });
    });

    it('should return an error if the firstName length is less than 3 characters', async () => {
      const user1 = new User({
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });

      userRepository.seedUsers([user1]);

      await expect(
        userCommands.updateUser(reqUser, user1.id, {
          firstName: 'jo',
        }),
      ).rejects.toThrowError(
        UserError[ErrorType.badRequest].minLength('firstName'),
      );
    });

    it('should return an error if the lastName length is less than 3 characters', async () => {
      const user1 = new User({
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });

      userRepository.seedUsers([user1]);

      await expect(
        userCommands.updateUser(reqUser, user1.id, {
          lastName: 'do',
        }),
      ).rejects.toThrowError(
        UserError[ErrorType.badRequest].minLength('lastName'),
      );
    });
  });

  describe('removeUser', () => {
    it('should return the list without user2', async () => {
      const user1 = new User({
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });
      const user2 = new User({
        id: 'user2_id',
        firstName: 'steve',
        lastName: 'artist',
        email: 'user1@test.com',
        username: 'user2',
        password: 'Abcd1!',
        role: Role.editor,
      });

      userRepository.seedUsers([user1, user2]);
      await userCommands.removeUser(reqUser, user2.id);

      expect(userRepository.users).toEqual([
        new User({
          id: 'user1_id',
          firstName: 'john',
          lastName: 'doe',
          email: 'user1@test.com',
          username: 'user1',
          password: 'Abcd1!',
          role: Role.admin,
        }),
      ]);
    });

    it('should return an error user not found', async () => {
      const user1 = new User({
        id: 'user1_id',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      });
      const user2 = new User({
        id: 'user2_id',
        firstName: 'steve',
        lastName: 'artist',
        email: 'user1@test.com',
        username: 'user2',
        password: 'Abcd1!',
        role: Role.editor,
      });

      userRepository.seedUsers([user1, user2]);

      await expect(
        userCommands.removeUser(reqUser, 'wrong-id'),
      ).rejects.toThrowError(UserError[ErrorType.notFound].byId);

      expect(userRepository.users).toEqual([
        new User({
          id: 'user1_id',
          firstName: 'john',
          lastName: 'doe',
          email: 'user1@test.com',
          username: 'user1',
          password: 'Abcd1!',
          role: Role.admin,
        }),
        new User({
          id: 'user2_id',
          firstName: 'steve',
          lastName: 'artist',
          email: 'user1@test.com',
          username: 'user2',
          password: 'Abcd1!',
          role: Role.editor,
        }),
      ]);
    });
  });
});

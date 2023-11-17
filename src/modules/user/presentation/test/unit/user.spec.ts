import { Test, TestingModule } from '@nestjs/testing';

import UserQueries from '../../../application/user.queries';
import UserInMemoryRepository from '../../../infrastructure/UserInMemoryRepository';

import User, { Role } from '../../../domain/model/User';
import { OrderBy } from '../../../../../common/types/pagination';

describe('User', () => {
  let userQueries: UserQueries;
  let userRepository: UserInMemoryRepository;

  beforeAll(async () => {
    userRepository = new UserInMemoryRepository();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserQueries,
        {
          provide: 'UserRepository',
          useValue: userRepository,
        },
      ],
    }).compile();

    userQueries = app.get<UserQueries>(UserQueries);
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
        password: '123456',
        role: Role.admin,
      });
      const user2 = new User({
        id: 'user2',
        firstName: 'steve',
        lastName: 'artist',
        email: 'user1@test.com',
        username: 'user2',
        password: '123456',
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
            password: '123456',
            role: Role.admin,
          }),
          new User({
            id: 'user2',
            firstName: 'steve',
            lastName: 'artist',
            email: 'user1@test.com',
            username: 'user2',
            password: '123456',
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
            password: '123456',
            role: Role.editor,
          }),
          new User({
            id: 'user1',
            firstName: 'john',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            password: '123456',
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
            password: '123456',
            role: Role.admin,
          }),
          new User({
            id: 'user2',
            firstName: 'steve',
            lastName: 'artist',
            email: 'user1@test.com',
            username: 'user2',
            password: '123456',
            role: Role.editor,
          }),
        ],
      });
    });
  });
});

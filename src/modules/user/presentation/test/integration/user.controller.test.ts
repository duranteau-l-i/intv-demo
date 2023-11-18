import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserCommands from '../../../application/user.commands';
import UserQueries from '../../../application/user.queries';
import UserRepository from '../../../infrastructure/UserRepository';
import UserController from '../../user.controller';
import UserEntity from '../../../infrastructure/entities/User.entity';
import { DataSource } from 'typeorm';
import { Role } from '../../../domain/model/User';
import UserError from '../../../domain/error';
import { ErrorType } from '../../../../../common/errors/CustomError';

describe('User', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let server: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.dev.local'],
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST_TEST,
          port: +process.env.DB_PORT_TEST,
          username: process.env.DB_USER_TEST,
          password: process.env.DB_PASSWORD_TEST,
          database: process.env.DB_DATABASE_TEST,
          entities: [UserEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      controllers: [UserController],
      providers: [
        UserQueries,
        UserCommands,
        {
          provide: 'UserRepository',
          useClass: UserRepository,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    dataSource = moduleRef.get<DataSource>(DataSource);
    server = app.getHttpServer();

    await app.init();
  });

  afterAll(async () => {
    await dataSource.getRepository(UserEntity).clear();
    await app.close();
    server.close();
  });

  it(`/GET users`, () => {
    return request(server).get('/users').expect(200).expect({
      data: [],
      count: 0,
      pages: 0,
      orderBy: 'ASC',
      orderValue: 'username',
      perPage: 10,
      page: 1,
    });
  });

  it(`/POST users`, () => {
    return request(server)
      .post('/users')
      .send({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        password: 'Abcd1!',
        role: Role.admin,
      })
      .expect(201)
      .expect({
        id: 'user1',
        firstName: 'john',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        role: Role.admin,
      });
  });

  it(`/GET users`, () => {
    return request(server)
      .get('/users')
      .expect(200)
      .expect({
        data: [
          {
            id: 'user1',
            firstName: 'john',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            role: Role.admin,
          },
        ],
        count: 1,
        pages: 1,
        orderBy: 'ASC',
        orderValue: 'username',
        perPage: 10,
        page: 1,
      });
  });

  it(`/GET users/:id`, () => {
    return request(server).get('/users/user1').expect(200).expect({
      id: 'user1',
      firstName: 'john',
      lastName: 'doe',
      email: 'user1@test.com',
      username: 'user1',
      role: Role.admin,
    });
  });

  it(`/GET users/:wrong-id`, () => {
    return request(server).get('/users/wrong-id').expect(404).expect({
      statusCode: 404,
      message: UserError[ErrorType.notFound].byId,
      error: 'Not Found',
    });
  });

  it(`/PATCH users/:id - error`, () => {
    return request(server)
      .patch('/users/user1')
      .send({
        firstName: 'jo',
        lastName: 'doe',
      })
      .expect(400)
      .expect({
        statusCode: 400,
        message: 'The firstName must be at least three characters long.',
        error: 'Bad Request',
      });
  });

  it(`/PATCH users/:id`, () => {
    return request(server)
      .patch('/users/user1')
      .send({
        firstName: 'steve',
        lastName: 'doe',
      })
      .expect(200)
      .expect({
        id: 'user1',
        firstName: 'steve',
        lastName: 'doe',
        email: 'user1@test.com',
        username: 'user1',
        role: 'admin',
      });
  });

  it(`/POST users`, () => {
    return request(server)
      .post('/users')
      .send({
        id: 'user2',
        firstName: 'steve',
        lastName: 'artist',
        email: 'user1@test.com',
        username: 'user2',
        password: 'Abcd1!',
        role: Role.editor,
      })
      .expect(201)
      .expect({
        id: 'user2',
        firstName: 'steve',
        lastName: 'artist',
        email: 'user1@test.com',
        username: 'user2',
        role: Role.editor,
      });
  });

  it(`/GET users`, () => {
    return request(server)
      .get('/users')
      .expect(200)
      .expect({
        data: [
          {
            id: 'user1',
            firstName: 'steve',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            role: Role.admin,
          },
          {
            id: 'user2',
            firstName: 'steve',
            lastName: 'artist',
            email: 'user1@test.com',
            username: 'user2',
            role: Role.editor,
          },
        ],
        count: 2,
        pages: 1,
        orderBy: 'ASC',
        orderValue: 'username',
        perPage: 10,
        page: 1,
      });
  });

  it(`/DELETE users/:id`, () => {
    return request(server).delete('/users/user2').expect(200);
  });

  it(`/DELETE users/:id`, () => {
    return request(server).delete('/users/user3').expect(404).expect({
      statusCode: 404,
      message: UserError[ErrorType.notFound].byId,
      error: 'Not Found',
    });
  });

  it(`/GET users`, () => {
    return request(server)
      .get('/users')
      .expect(200)
      .expect({
        data: [
          {
            id: 'user1',
            firstName: 'steve',
            lastName: 'doe',
            email: 'user1@test.com',
            username: 'user1',
            role: Role.admin,
          },
        ],
        count: 1,
        pages: 1,
        orderBy: 'ASC',
        orderValue: 'username',
        perPage: 10,
        page: 1,
      });
  });
});
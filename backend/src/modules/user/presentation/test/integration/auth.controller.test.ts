import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AccessTokenStrategy, RefreshTokenStrategy } from '@common/guards';
import { ErrorType } from '@common/errors/CustomError';

import UserRepository from '../../../infrastructure/UserRepository';
import UserEntity from '../../../infrastructure/entities/User.entity';
import { DataSource } from 'typeorm';
import { Role } from '../../../domain/model';
import AuthController from '../../auth.controller';
import AuthCommands from '../../../application/auth.commands';
import UserError from '../../../domain/error';

describe('Auth', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let server: INestApplication;

  let accessToken: string = null;
  let refreshToken: string = null;

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
        JwtModule.register({}),
      ],
      controllers: [AuthController],
      providers: [
        AuthCommands,
        {
          provide: 'UserRepository',
          useClass: UserRepository,
        },
        AccessTokenStrategy,
        RefreshTokenStrategy,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    dataSource = moduleRef.get<DataSource>(DataSource);
    server = app.getHttpServer();

    await app.init();
  });

  afterAll(async () => {
    await dataSource
      .getRepository(UserEntity)
      .delete({ username: 'userAuth1' });

    accessToken = null;
    refreshToken = null;

    await app.close();
    server.close();
  });

  it(`/POST signUp`, async () => {
    const res = await request(server)
      .post('/auth/signup')
      .send({
        firstName: 'john',
        lastName: 'doe',
        email: 'userAuth1@test.com',
        username: 'userAuth1',
        password: 'Abcd1!',
        role: Role.admin,
      })
      .expect(201);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    expect(res.body.tokens.accessToken).not.toBeNull();
    expect(res.body.tokens.refreshToken).not.toBeNull();
  });

  it(`/POST signIn - wrong password`, async () => {
    const res = await request(server)
      .post('/auth/signin')
      .send({
        username: 'userAuth1',
        password: 'wrong-password',
      })
      .expect(400);

    expect(res.body).toEqual({
      error: 'Bad Request',
      message: UserError[ErrorType.badRequest].signIn,
      statusCode: 400,
    });
  });

  it(`/POST signIn`, async () => {
    const res = await request(server)
      .post('/auth/signin')
      .send({
        username: 'userAuth1',
        password: 'Abcd1!',
      })
      .expect(201);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    expect(res.body.accessToken).not.toBeNull();
    expect(res.body.refreshToken).not.toBeNull();
  });

  it(`/GET refresh tokens`, async () => {
    const res = await request(server)
      .get('/auth/refresh-tokens')
      .set('Authorization', `Bearer ${refreshToken}`)
      .expect(200);

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;

    expect(res.body.accessToken).not.toBeNull();
    expect(res.body.refreshToken).not.toBeNull();
  });

  it(`/GET logout`, async () => {
    await request(server)
      .get('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});

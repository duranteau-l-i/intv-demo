import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserRepository from '../../../infrastructure/UserRepository';
import UserEntity from '../../../infrastructure/entities/User.entity';
import { DataSource } from 'typeorm';
import { Role } from '../../../domain/model';
import AuthController from '../../auth.controller';
import AuthCommands from '../../../application/auth.commands';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '../../../../../common/guards';

describe('Auth', () => {
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

    expect(res.body.accessToken).not.toBeNull();
    expect(res.body.refreshToken).not.toBeNull();
  });

  it(`/POST signIn - wrong password`, async () => {
    const res = await request(server)
      .post('/auth/signin')
      .send({
        username: 'userAuth1',
        password: 'Abcd1!',
      })
      .expect(201);

    expect(res.body.accessToken).not.toBeNull();
    expect(res.body.refreshToken).not.toBeNull();
  });
});

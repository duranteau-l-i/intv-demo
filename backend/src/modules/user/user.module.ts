import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/cache-manager';

import { AccessTokenStrategy, RefreshTokenStrategy } from '@common/guards';

import UserQueries from './application/user.queries';
import UserCommands from './application/user.commands';
import AuthCommands from './application/auth.commands';
import UserEntity from './infrastructure/repositories/entities/User.entity';
import UserRepository from './infrastructure/repositories/UserRepository';
import UserCache from './infrastructure/caches/UserCache';
import UserController from './presentation/user.controller';
import AuthController from './presentation/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({}),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_URL,
      port: process.env.REDIS_PORT,
    }),
  ],
  providers: [
    UserQueries,
    UserCommands,
    AuthCommands,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'UserCache',
      useClass: UserCache,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [UserController, AuthController],
})
export class UserModule {}

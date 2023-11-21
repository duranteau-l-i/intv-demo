import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';

import { AccessTokenStrategy, RefreshTokenStrategy } from '@common/guards';
import RolesGuard from '@common/guards/Role.guard';

import UserQueries from './application/user.queries';
import UserCommands from './application/user.commands';
import AuthCommands from './application/auth.commands';
import UserEntity from './infrastructure/entities/User.entity';
import UserRepository from './infrastructure/UserRepository';
import UserController from './presentation/user.controller';
import AuthController from './presentation/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({})],
  providers: [
    UserQueries,
    UserCommands,
    AuthCommands,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [UserController, AuthController],
})
export class UserModule {}

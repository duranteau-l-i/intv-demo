import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AccessTokenStrategy, RefreshTokenStrategy } from '@common/guards';

import UserQueries from './application/user.queries';
import UserCommands from './application/user.commands';
import AuthCommands from './application/auth.commands';
import UserEntity from './infrastructure/entities/User.entity';
import UserRepository from './infrastructure/UserRepository';
import UserController from './presentation/user.controller';
import AuthController from './presentation/auth.controller';
import UserHandlers from './presentation/aws/userHandlers';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule.register({})],
  providers: [
    UserQueries,
    UserCommands,
    AuthCommands,
    UserHandlers,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [UserController, AuthController],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import UserQueries from './application/user.queries';
import UserCommands from './application/user.commands';
import AuthCommands from './application/auth.commands';
import UserEntity from './infrastructure/entities/User.entity';
import UserRepository from './infrastructure/UserRepository';
import UserController from './presentation/user.controller';
import AuthController from './presentation/auth.controller';
import { AccessTokenStrategy, RefreshTokenStrategy } from '@common/guards';

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
  ],
  controllers: [UserController, AuthController],
})
export class UserModule {}

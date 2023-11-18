import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserQueries from './application/user.queries';
import UserRepository from './infrastructure/UserRepository';
import UserEntity from './infrastructure/entities/User.entity';
import UserCommands from './application/user.commands';
import UserController from './presentation/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserQueries,
    UserCommands,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
})
export class UsersModule {}

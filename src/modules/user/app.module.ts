import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserQueries from './application/user.queries';
import UserRepository from './infrastructure/UserRepository';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [
    UserQueries,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
  controllers: [],
})
export class UsersModule {}

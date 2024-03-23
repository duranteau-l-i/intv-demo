import { User, Role } from '../../../domain/model';
import UserEntity from '../entities/User.entity';

export const userToDomain = (user: UserEntity): User => {
  return new User({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    password: user.password,
    role: Role[user.role],
    refreshToken: user.refreshToken,
  });
};

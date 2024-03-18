import { User, Role } from '../../domain/model';

export type UserViewModel = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: Role;
};

export const userToViewModel = (user: User): UserViewModel => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    role: user.role,
  };
};

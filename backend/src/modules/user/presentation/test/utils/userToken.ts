import { Role, User } from 'src/modules/user/domain/model';

export const makeExpiredDate = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);

  return Math.floor(date.getTime() / 1000);
};

export const makeUserJWTToken = (
  user: User,
  exp: number,
): {
  sub: string;
  username: string;
  role: Role;
  iat: number;
  exp: number;
} => {
  return {
    sub: user.id,
    username: user.username,
    role: user.role,
    iat: Math.floor(new Date().getTime() / 1000),
    exp,
  };
};

import { Role } from './User';

type ReqUser = {
  sub: string;
  username: string;
  role: Role;
  iat: number;
  exp: number;
};

export default ReqUser;

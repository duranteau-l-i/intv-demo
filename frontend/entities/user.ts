export enum Role {
  admin = "admin",
  editor = "editor",
  user = "user"
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: Role;
};

import { jwtDecode } from "jwt-decode";

export const isExpired = (token: string): boolean => {
  if (!token) return true;
  const jwt: any = jwtDecode(token as string);
  const current_time = new Date().getTime() / 1000;

  return current_time > jwt.exp;
};

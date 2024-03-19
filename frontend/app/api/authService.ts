"use server";

import axiosInstance from "./axios";
import { cookies } from "next/headers";
import { getAccessToken } from "./token";
import { User } from "@/entities/user";

export const login = async (data: { username: string; password: string }) => {
  try {
    const result = await axiosInstance.post("/auth/signin", data);

    setCookies(result.data);

    return result.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const signup = async (data: Omit<User, "id" | "role">) => {
  try {
    const result = await axiosInstance.post("/auth/signup", data);

    setCookies(result.data);

    return result.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const accessToken = getAccessToken();

    const result = await axiosInstance.get("/auth/logout", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    cookies().delete({
      name: "access-token"
    });
    cookies().delete({
      name: "refresh-token"
    });

    return result.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

const setCookies = (data: { accessToken: string; refreshToken: string }) => {
  cookies().set({
    name: "access-token",
    value: data.accessToken,
    httpOnly: true,
    path: "/"
  });
  cookies().set({
    name: "refresh-token",
    value: data.refreshToken,
    httpOnly: true,
    path: "/"
  });
};

"use server";

import axiosInstance from "./axios";
import { cookies } from "next/headers";
import { getAccessToken } from "./token";

export const login = async (data: { username: string; password: string }) => {
  try {
    const result = await axiosInstance.post("/auth/signin", data);

    cookies().set({
      name: "access-token",
      value: result.data.accessToken,
      httpOnly: true,
      path: "/"
    });
    cookies().set({
      name: "refresh-token",
      value: result.data.refreshToken,
      httpOnly: true,
      path: "/"
    });

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

"use server";

import { cookies } from "next/headers";
import axiosInstance from "./axios";

export const getAccessToken = () => cookies().get("access-token")?.value;

export const refreshToken = async () => {
  try {
    const refreshToken = cookies().get("refresh-token")?.value;

    const result = await axiosInstance.get("/auth/refresh-tokens", {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    });

    return result.data;
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

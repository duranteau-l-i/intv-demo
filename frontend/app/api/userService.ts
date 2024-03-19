"use server";

import axiosInstance from "./axios";
import { redirect } from "next/navigation";
import { getAccessToken } from "./token";
import { User } from "@/entities/user";

export const getUsers = async (): Promise<User[]> => {
  try {
    const accessToken = getAccessToken();

    const result = await axiosInstance.get("/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return result.data.data;
  } catch (err: any) {
    if (err.response.data.statusCode === 401) {
      redirect("/login");
    }

    throw new Error(err.response.data.message);
  }
};

export const addUser = async (
  user: Omit<User, "id"> & { password: string }
): Promise<User> => {
  try {
    const accessToken = getAccessToken();

    const result = await axiosInstance.post("/users", user, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return result.data.data;
  } catch (err: any) {
    if (err.response.data.statusCode === 401) {
      redirect("/login");
    }

    throw new Error(err.response.data.message);
  }
};

export const updateUser = async (data: {
  id: string;
  firstName: string;
  lastName: string;
}): Promise<User> => {
  try {
    const accessToken = getAccessToken();

    const result = await axiosInstance.patch(`/users/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return result.data.data;
  } catch (err: any) {
    if (err.response.data.statusCode === 401) {
      redirect("/login");
    }

    throw new Error(err.response.data.message);
  }
};

export const deleteUser = async (id: string): Promise<User> => {
  try {
    const accessToken = getAccessToken();

    const result = await axiosInstance.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return result.data.data;
  } catch (err: any) {
    if (err.response.data.statusCode === 401) {
      redirect("/login");
    }

    throw new Error(err.response.data.message);
  }
};

export const getMe = async (): Promise<User> => {
  try {
    const accessToken = getAccessToken();

    const result = await axiosInstance.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return result.data;
  } catch (err: any) {
    if (err.response.data.statusCode === 401) {
      redirect("/login");
    }

    throw new Error(err.response.data.message);
  }
};

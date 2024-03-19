"use client";

import { useQuery } from "react-query";
import { getMe } from "../api/userService";
import { User } from "@/entities/user";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

import { logout } from "../api/authService";

export default function Profile(props: any) {
  const router = useRouter();

  const { data, error, isLoading, isError, isSuccess } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: () => getMe()
  });

  const handleSubmit = () => {
    logout().then(res => {
      localStorage.removeItem("access-token");
      router.push("/");
    });
  };

  const renderResult = () => {
    if (isLoading) {
      return <div className="search-message">Loading...</div>;
    }
    if (isError) {
      return <div className="search-message">Error: {error.message}</div>;
    }
    if (isSuccess) {
      return (
        <div>
          <div>
            <p>
              <span>FirstName</span>: {data.firstName}
            </p>
            <p>
              <span>LastName</span>: {data.lastName}
            </p>
            <p>
              <span>Email</span>: {data.email}
            </p>
            <p>
              <span>Username</span>: {data.username}
            </p>
            <p>
              <span>Role</span>: {data.role}
            </p>
          </div>

          <Button
            className="text-sm font-normal text-default-600"
            onClick={handleSubmit}
            color="danger"
          >
            logout
          </Button>
        </div>
      );
    }
    return <></>;
  };

  return <div>{renderResult()}</div>;
}

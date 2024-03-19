"use client";

import { useQuery } from "react-query";
import { getMe, updateUser } from "../api/userService";
import { User } from "@/entities/user";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

import { logout } from "../api/authService";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";

export default function Profile(props: any) {
  const router = useRouter();

  const { data, error, isLoading, isError, isSuccess } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: () => getMe()
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName);
      setLastName(data.lastName);
    }
  }, [data]);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const handleUpdate = () => {
    setUpdateLoading(true);

    updateUser({ id: data?.id ?? "", firstName, lastName })
      .then(res => {})
      .catch(err => {
        setUpdateError(err.message);
      })
      .finally(() => setUpdateLoading(false));
  };

  const handleLogout = () => {
    logout().then(res => {
      localStorage.removeItem("access-token");
      router.push("/");
    });
  };

  const renderResult = () => {
    if (isLoading || updateLoading) {
      return <Loading />;
    }
    if (isError || updateError) {
      return <div className="">{error?.message || updateError}</div>;
    }
    if (isSuccess) {
      return (
        <>
          {error && <div className="mt-5 text-red-500">{error}</div>}

          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              isRequired
              label="FirstName"
              value={firstName}
              onChange={e => {
                setUpdateError("");
                setFirstName(e.target.value);
              }}
            />
            <Input
              isRequired
              label="LastName"
              value={lastName}
              onChange={e => {
                setUpdateError("");
                setLastName(e.target.value);
              }}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input isDisabled label="Email" value={data.email} type="email" />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input isDisabled label="Username" value={data.username} />
            <Input isDisabled label="Role" value={data.role} />
          </div>

          <Button
            className="text-sm font-normal text-default-600"
            color="primary"
            onClick={handleUpdate}
            isDisabled={!firstName || !lastName || updateLoading}
          >
            Update
          </Button>

          <Button
            className="text-sm font-normal text-default-600"
            onClick={handleLogout}
            color="danger"
          >
            logout
          </Button>
        </>
      );
    }
    return <></>;
  };

  return <div className="w-full flex flex-col gap-4">{renderResult()}</div>;
}

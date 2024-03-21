"use client";

import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

import { getMe } from "../api/userService";
import { User } from "@/entities/user";
import Loading from "@/components/loading";
import useUpdate from "./hooks/useUpdate";
import useLogout from "./hooks/useLogout";

export default function Profile(props: any) {
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

  const { update, updateLoading, updateError, setUpdateError } = useUpdate();

  const { handleLogout } = useLogout();

  const renderResult = () => {
    if (isLoading || updateLoading) {
      return <Loading />;
    }
    if (isError) {
      return (
        <div role="error-message" className="mt-5 text-red-500">
          {error?.message}
        </div>
      );
    }
    if (isSuccess) {
      return (
        <>
          {updateError && (
            <div role="error-message" className="mt-5 text-red-500">
              {updateError}
            </div>
          )}

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
            <Input isDisabled label="Email" value={data?.email} type="email" />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input isDisabled label="Username" value={data?.username} />
            <Input isDisabled label="Role" value={data?.role} />
          </div>

          <Button
            className="text-sm font-normal"
            color="primary"
            radius="full"
            variant="shadow"
            onClick={() => update({ id: data?.id ?? "", firstName, lastName })}
            isDisabled={!firstName || !lastName || updateLoading}
          >
            Update
          </Button>

          <Button
            className="text-sm font-normal"
            onClick={handleLogout}
            color="danger"
            radius="full"
            variant="shadow"
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

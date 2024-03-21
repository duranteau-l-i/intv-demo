import { Role } from "@/entities/user";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

import Loading from "@/components/loading";
import useAddUser, { UserWithoutId } from "./hooks/useAddUser";

export const defaultUser = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  role: Role.user
};

const UserForm = (props: any) => {
  const [user, setUser] = useState<UserWithoutId>(defaultUser);

  const handleChange = (data: { name: string; value: string }) => {
    setUser({ ...user, [data.name]: data.value });
  };

  const { handleSubmit, loading, error, setError } = useAddUser({
    refetch: props.refetch,
    setUser
  });

  return (
    <div className="w-full flex flex-col gap-4 mt-10 mb-10">
      <h2 className="">Add new user</h2>

      {error && (
        <div role="error-message" className="text-red-500">
          {error}
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              isRequired
              label="FirstName"
              name="firstName"
              value={user.firstName}
              onChange={e => {
                setError("");
                handleChange({ name: e.target.name, value: e.target.value });
              }}
            />
            <Input
              isRequired
              label="LastName"
              name="lastName"
              value={user.lastName}
              onChange={e => {
                setError("");
                handleChange({ name: e.target.name, value: e.target.value });
              }}
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              isRequired
              label="Username"
              name="username"
              value={user.username}
              onChange={e => {
                setError("");
                handleChange({ name: e.target.name, value: e.target.value });
              }}
            />
            <Input
              isRequired
              label="Password"
              name="password"
              value={user.password}
              onChange={e => {
                setError("");
                handleChange({ name: e.target.name, value: e.target.value });
              }}
              type="password"
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              isRequired
              label="Email"
              name="email"
              value={user.email}
              onChange={e => {
                setError("");
                handleChange({ name: e.target.name, value: e.target.value });
              }}
              type="email"
            />
            <Select
              isRequired
              label="Role"
              name="role"
              placeholder="Select an role"
              defaultSelectedKeys={[Role.user]}
              className=""
              onChange={e => {
                setError("");
                handleChange({
                  name: e.target.name,
                  value: e.target.value as Role
                });
              }}
            >
              <SelectItem key={Role.user} value={Role.user}>
                {Role.user}
              </SelectItem>
              <SelectItem key={Role.editor} value={Role.editor}>
                {Role.editor}
              </SelectItem>
              <SelectItem key={Role.admin} value={Role.admin}>
                {Role.admin}
              </SelectItem>
            </Select>
          </div>

          <Button
            className="text-sm font-normal"
            color="primary"
            radius="full"
            variant="shadow"
            onClick={() => handleSubmit(user)}
            isDisabled={
              !user.firstName ||
              !user.lastName ||
              !user.username ||
              !user.password ||
              !user.email ||
              !user.role ||
              loading
            }
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
};

export default UserForm;

import { Role } from "@/entities/user";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

import { addUser } from "../api/userService";

const UserForm = (props: any) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(Role.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setLoading(true);

    addUser({ firstName, lastName, username, email, password, role })
      .then(res => {
        props.refetch();
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-10 mb-10">
      {error && <div className="text-red-500">{error}</div>}

      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          isRequired
          label="FirstName"
          value={firstName}
          onChange={e => {
            setError("");
            setFirstName(e.target.value);
          }}
        />
        <Input
          isRequired
          label="LastName"
          value={lastName}
          onChange={e => {
            setError("");
            setLastName(e.target.value);
          }}
        />
      </div>
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          isRequired
          label="Username"
          value={username}
          onChange={e => {
            setError("");
            setUsername(e.target.value);
          }}
        />
        <Input
          isRequired
          label="Password"
          value={password}
          onChange={e => {
            setError("");
            setPassword(e.target.value);
          }}
          type="password"
        />
      </div>
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Input
          isRequired
          label="Email"
          value={email}
          onChange={e => {
            setError("");
            setEmail(e.target.value);
          }}
          type="email"
        />
        <Select
          isRequired
          label="Role"
          placeholder="Select an role"
          defaultSelectedKeys={[Role.user]}
          className=""
          onChange={e => {
            setError("");
            setRole(e.target.value as Role);
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
        className="text-sm font-normal text-default-600 bg-default-100"
        onClick={handleSubmit}
        isDisabled={
          !firstName ||
          !lastName ||
          !username ||
          !password ||
          !email ||
          !role ||
          loading
        }
      >
        Submit
      </Button>
    </div>
  );
};

export default UserForm;

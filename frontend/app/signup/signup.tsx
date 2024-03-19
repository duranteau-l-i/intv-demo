"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { login, signup } from "@/app/api/authService";
import Loading from "@/components/loading";

const defaultUser = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: ""
};

export default function Signup() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(defaultUser);

  const handleChange = (data: { name: string; value: string }) => {
    setUser({ ...user, [data.name]: data.value });
  };

  const handleSubmit = () => {
    setLoading(true);

    signup(user)
      .then(res => {
        localStorage.setItem("access-token", res.accessToken);
        router.push("/");
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full flex flex-col gap-4 ">
      {error && <div className="mt-5 text-red-500">{error}</div>}

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
          </div>

          <Button
            className="text-sm font-normal"
            color="primary"
            radius="full"
            variant="shadow"
            onClick={handleSubmit}
            isDisabled={
              !user.firstName ||
              !user.lastName ||
              !user.username ||
              !user.password ||
              !user.email ||
              loading
            }
          >
            Submit
          </Button>
        </>
      )}
    </div>
  );
}

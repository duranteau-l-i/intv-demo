"use client";

import { Input, Button } from "@nextui-org/react";

import { useState } from "react";

import Loading from "@/components/loading";
import { Link } from "@nextui-org/link";
import useLogin from "./hooks/useLogin";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { submit, loading, error, setError } = useLogin();

  return (
    <div className="w-full flex flex-col gap-4 ">
      {error && (
        <div role="error-message" className="mt-5 text-red-500">
          {error}
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="mt-10 flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
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
          <Button
            className="text-sm font-normal"
            onClick={() => submit(username, password)}
            isDisabled={!username || !password}
            color="primary"
            radius="full"
            variant="shadow"
          >
            Submit
          </Button>

          <div>
            <Link color={"foreground"} href="/signup">
              Signup
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

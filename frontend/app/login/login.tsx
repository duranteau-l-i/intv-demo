"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { login } from "@/app/api/authService";
import Loading from "@/components/loading";
import { Link } from "@nextui-org/link";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setLoading(true);

    login({ username, password })
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
            onClick={handleSubmit}
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
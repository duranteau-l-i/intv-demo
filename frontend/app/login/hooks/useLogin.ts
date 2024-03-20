import { login } from "@/app/api/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useLogin = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (username: string, password: string) => {
    setLoading(true);

    await login({ username, password })
      .then(res => {
        localStorage.setItem("access-token", res.accessToken);
        router.push("/");
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return {
    submit,
    loading,
    error,
    setError
  };
};

export default useLogin;

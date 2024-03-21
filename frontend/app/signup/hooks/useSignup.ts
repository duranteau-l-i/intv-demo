import { useState } from "react";
import { useRouter } from "next/navigation";

import { User } from "@/entities/user";
import { signup } from "@/app/api/authService";

const useSignup = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (user: Omit<User, "id" | "role">) => {
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

  return {
    handleSubmit,
    loading,
    error,
    setError
  };
};

export default useSignup;

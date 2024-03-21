import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { isExpired } from "@/utils/token";
import { Role } from "@/entities/user";
import { useRouter } from "next/navigation";

const useCurrentUser = () => {
  const router = useRouter();

  const [role, setRole] = useState<Role>(Role.user);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");

    if (!accessToken || isExpired(accessToken)) {
      localStorage.removeItem("access-token");
      router.push("/login");
    } else {
      const data: any = jwtDecode(accessToken as string);
      setRole(data.role);
      setCurrentUserId(data.sub);
    }
  }, []);

  return {
    role,
    currentUserId
  };
};

export default useCurrentUser;

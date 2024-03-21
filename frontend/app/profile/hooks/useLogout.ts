import { logout } from "@/app/api/authService";
import { useRouter } from "next/navigation";

const useLogout = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout().then(res => {
      localStorage.removeItem("access-token");
      router.push("/");
    });
  };

  return {
    handleLogout
  };
};

export default useLogout;

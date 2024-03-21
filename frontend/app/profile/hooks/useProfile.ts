import { useQuery } from "react-query";

import { getMe } from "@/app/api/userService";
import { User } from "@/entities/user";

const useProfile = () => {
  const { data, error, isLoading, isError, isSuccess } = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: () => getMe()
  });

  return { data, error, isLoading, isError, isSuccess };
};

export default useProfile;

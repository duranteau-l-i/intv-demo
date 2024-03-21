import { Dispatch, SetStateAction, useState } from "react";

import { addUser } from "@/app/api/userService";
import { User } from "@/entities/user";
import { defaultUser } from "../form";

export type UserWithoutId = Omit<User, "id"> & { password: string };

const useAddUser = (props: {
  refetch: () => void;
  setUser: Dispatch<SetStateAction<UserWithoutId>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (user: UserWithoutId) => {
    setLoading(true);

    addUser(user)
      .then(res => {
        props.setUser(defaultUser);
        props.refetch();
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

export default useAddUser;

import { updateUser } from "@/app/api/userService";
import { useState } from "react";

const useUpdate = () => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const update = (data: {
    id: string;
    firstName: string;
    lastName: string;
  }) => {
    setUpdateLoading(true);

    updateUser({
      id: data?.id ?? "",
      firstName: data.firstName,
      lastName: data.lastName
    })
      .then(res => {})
      .catch(err => {
        setUpdateError(err.message);
      })
      .finally(() => setUpdateLoading(false));
  };

  return {
    update,
    updateLoading,
    updateError,
    setUpdateError
  };
};

export default useUpdate;

import { useState } from "react";

import { deleteUser } from "@/app/api/userService";

const useDeleteUser = (props: { refetch: () => void; onClose: () => void }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = (id: string) => {
    setDeleteLoading(true);

    deleteUser(id)
      .then(res => {
        props.refetch();
      })
      .catch(err => {
        setDeleteError(err.message);
      })
      .finally(() => {
        props.onClose();
        setDeleteLoading(false);
      });
  };

  return {
    handleDelete,
    deleteLoading,
    deleteError,
    setDeleteError
  };
};

export default useDeleteUser;

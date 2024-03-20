"use client";

import { jwtDecode } from "jwt-decode";
import { useQuery } from "react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";
import { Role, User } from "@/entities/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { isExpired } from "@/utils/token";
import { deleteUser, getUsers } from "@/app/api/userService";

import UserForm from "./form";
import Loading from "@/components/loading";

export default function Dashboard(props: any) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery<
    User[],
    Error
  >({
    queryKey: ["users"],
    queryFn: () => getUsers()
  });

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

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [id, setId] = useState("");

  const handleDelete = () => {
    setDeleteLoading(true);

    deleteUser(id)
      .then(res => {
        refetch();
      })
      .catch(err => {
        setDeleteError(err.message);
      })
      .finally(() => {
        onClose();
        setDeleteLoading(false);
      });
  };

  const renderResult = () => {
    if (isLoading || deleteLoading) {
      return <Loading />;
    }
    if (isError || deleteError) {
      return (
        <div className="text-red-500">{error?.message || deleteError}</div>
      );
    }
    if (isSuccess) {
      return (
        <>
          <Table aria-label="users table" className="">
            <TableHeader>
              <TableColumn className="text-center">FIRST NAME</TableColumn>
              <TableColumn className="text-center">LAST NAME</TableColumn>
              <TableColumn className="text-center">USERNAME</TableColumn>
              <TableColumn className="text-center">ROLE</TableColumn>
              <TableColumn className="text-center">DELETE</TableColumn>
            </TableHeader>
            <TableBody items={data.filter(el => el.id !== currentUserId)}>
              {(item: User) => (
                <TableRow key={item.id}>
                  <TableCell>{item.firstName}</TableCell>
                  <TableCell>{item.lastName}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setId(item.id);
                        onOpen();
                      }}
                      color="danger"
                    >
                      delete
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Modal size="lg" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              {onClose => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Delete user
                  </ModalHeader>
                  <ModalBody>
                    <p>Are you sure you want to delete this user?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="danger" onPress={handleDelete}>
                      Delete
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      );
    }
    return <></>;
  };

  return (
    <>
      {role !== Role.user ? (
        <>
          <div className="">{renderResult()}</div>
          {role === Role.admin && <UserForm refetch={refetch} />}{" "}
        </>
      ) : (
        <div>The dashboard is only accessible to admins and editors</div>
      )}
    </>
  );
}

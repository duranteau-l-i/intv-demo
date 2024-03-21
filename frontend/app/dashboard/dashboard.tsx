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
import { useState } from "react";

import { getUsers } from "@/app/api/userService";

import UserForm from "./form";
import Loading from "@/components/loading";
import useDeleteUser from "./hooks/useDeleteUser";
import useCurrentUser from "./hooks/useCurrentUser";

export default function Dashboard(props: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery<
    User[],
    Error
  >({
    queryKey: ["users"],
    queryFn: () => getUsers()
  });

  const { role, currentUserId } = useCurrentUser();

  const [id, setId] = useState("");

  const { handleDelete, deleteLoading, deleteError } = useDeleteUser({
    refetch,
    onClose
  });

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
          <Table aria-label="users-table" className="">
            <TableHeader>
              <TableColumn className="text-center">FIRST NAME</TableColumn>
              <TableColumn className="text-center">LAST NAME</TableColumn>
              <TableColumn className="text-center">USERNAME</TableColumn>
              <TableColumn className="text-center">EMAIL</TableColumn>
              <TableColumn className="text-center">ROLE</TableColumn>
              <TableColumn className="text-center">DELETE</TableColumn>
            </TableHeader>
            <TableBody items={data.filter(el => el.id !== currentUserId)}>
              {(item: User) => (
                <TableRow key={item.id}>
                  <TableCell>{item.firstName}</TableCell>
                  <TableCell>{item.lastName}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.email}</TableCell>
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
                    <Button color="danger" onPress={() => handleDelete(id)}>
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

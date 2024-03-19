"use client";

import { jwtDecode } from "jwt-decode";

import { getUsers } from "@/app/api/userService";
import { title } from "@/components/primitives";
import { useQuery } from "react-query";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@nextui-org/react";
import { Role, User } from "@/entities/user";
import { useEffect, useState } from "react";
import UserForm from "./form";

export default function Dashboard(props: any) {
  const { data, error, isLoading, isError, isSuccess, refetch } = useQuery<
    User[],
    Error
  >({
    queryKey: ["users"],
    queryFn: () => getUsers()
  });

  const [role, setRole] = useState<Role>(Role.user);

  useEffect(() => {
    const accessToken = localStorage.getItem("access-token");
    const data: any = jwtDecode(accessToken as string);
    setRole(data.role);
  }, []);

  const renderResult = () => {
    if (isLoading) {
      return <div className="search-message">Loading...</div>;
    }
    if (isError) {
      return <div className="search-message">Error: {error.message}</div>;
    }
    if (isSuccess) {
      return (
        <Table aria-label="users table" className="">
          <TableHeader>
            <TableColumn className="text-center">FIRST NAME</TableColumn>
            <TableColumn className="text-center">LAST NAME</TableColumn>
            <TableColumn className="text-center">USERNAME</TableColumn>
            <TableColumn className="text-center">ROLE</TableColumn>
            <TableColumn className="text-center">DELETE</TableColumn>
          </TableHeader>
          <TableBody items={data}>
            {(item: User) => (
              <TableRow key={item.id}>
                <TableCell>{item.firstName}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.role}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      );
    }
    return <></>;
  };

  return (
    <div className="w-full">
      <h1 className={title()}>Dashboard</h1>

      <div className="mt-10">{renderResult()}</div>

      {role === Role.admin && <UserForm refetch={refetch} />}
    </div>
  );
}

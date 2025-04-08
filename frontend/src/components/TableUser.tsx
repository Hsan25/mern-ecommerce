"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import apiService from "@/lib/axios";
import type { Pagination, User } from "@/types";
import { Button } from "./ui/button";
import TableSkeleton from "./TableSkeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PaginationUser from "./Pagination";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import Image from "next/image";
import AlertDialog from "./AlertDialog";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

interface Data {
  users: User[];
  pagination: Pagination;
}

const DialogUserDelete = ({
  user,
  isOpen,
  setOpen,
}: {
  setOpen: any;
  isOpen: boolean;
  user: User;
}) => {
  const { toast } = useToast();
  // const [open, setOpen] = useState<boolean>(isOpen);
  const handleDeleteUser = async (id: string) => {
    try {
      const res = await apiService.delete(`/users/${id}`);
      toast({
        title: "Delete user success",
        description: `user with id ${id} deleted.`,
      });
    } catch (error) {
      toast({
        title: "Delete user failed",
      });
      console.error(error);
    }
  };

  return (
    <AlertDialog
      title={"Delete User"}
      description={`apakah anda yakin ingin menghapus user ${user.username}`}
      open={isOpen}
      onContinue={() => {
        handleDeleteUser(user._id);
        setOpen(false);
      }}
      onCancel={() => setOpen(false)}
    />
  );
};
const TableUser = () => {
  const [users, setUsers] = useState<User[]>();
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const params = searchParams.toString();
  const { data, isLoading } = useSWR<Data>(
    `/users?limit=10&${params}`,
    fetcher
  );
  const [selectedUser, setSelectedUser] = useState<User>();
  useEffect(() => {
    if (!page) replace(`${pathname}?page=${1}`);
    if (data) {
      setUsers(data.users as User[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page]);
  return (
    <>
      {selectedUser && (
        <DialogUserDelete user={selectedUser} setOpen={setOpen} isOpen={open} />
      )}
      <Table>
        <TableCaption>
          {searchParams.get("search")
            ? `no result for ${searchParams.get("search")}`
            : !users
            ? "No user"
            : "List user"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">No</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="">Role</TableHead>
            <TableHead className="">avatar</TableHead>
            <TableHead className="">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && users ? (
            users.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell className="">{idx + 1}</TableCell>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    className="text-xs"
                    variant={`${
                      user.role == "ADMIN" ? "success" : "secondary"
                    }`}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.avatar.url ? (
                    <div className="relative w-10 h-10">
                      <Image src={user.avatar.url} fill={true} alt={"avatar"} />
                    </div>
                  ) : (
                    <p>-</p>
                  )}
                </TableCell>
                <TableCell className="flex gap-2 items-center">
                  <Link href={`${pathname}/edit/${user._id}`}>
                    <Button size={"xs"} variant={"default"}>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setOpen(!open);
                      setSelectedUser(user);
                    }}
                    size={"xs"}
                    variant={"destructive"}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableSkeleton row={6} key={idx} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
      {data ? (
        <PaginationUser totalPages={data?.pagination.totalPages || 1} />
      ) : null}
    </>
  );
};

export default TableUser;

"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, Suspense } from "react";
import { useDebouncedCallback } from "use-debounce";
import TableUser from "@/components/TableUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
const DashboardUserPage = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounced = useDebouncedCallback((value: string) => {
    const newQuery = createQueryString("search", value);
    push(pathname + "?" + newQuery);
  }, 500);
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <>
      <div className="w-full pb-10 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Users</h2>
        <Input
          type={"text"}
          onChange={(e) => {
            let val = e.target.value;
            debounced(val);
          }}
          name="search"
          placeholder="search user"
          className="w-60"
        />
        <Link href={"/dashboard/users/add"}>
          <Button className="flex items-center gap-1">
            <FaPlus size={20} />
            <span className="text-base">user</span>
          </Button>
        </Link>
      </div>
      <TableUser />
    </>
  );
};

export default DashboardUserPage;

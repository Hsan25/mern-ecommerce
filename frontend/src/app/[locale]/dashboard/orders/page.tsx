"use client";
import TableOrders from "@/components/TableOrder";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
const DashboardOrderPage = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>("");
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
        <h2 className="text-lg font-semibold">Product</h2>
        <div className="">
          <Input
            type={"text"}
            onChange={(e) => {
              let val = e.target.value;
              setError('')
              debounced(val);
            }}
            name="search"
            placeholder="search order by id"
            className="w-60"
          />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
      <TableOrders setError={setError} />
    </>
  );
};

export default DashboardOrderPage;

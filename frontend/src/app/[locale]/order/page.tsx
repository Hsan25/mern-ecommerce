"use client";
import BadgeStatus from "@/components/BagdeStatus";
import { useAuth } from "@/context/authContext";
import { fetcher } from "@/lib/fetcher";
import { Order } from "@/types/order";
import { formatDate, formatIDR } from "@/utils";
import Image from "next/image";
import React, { useState } from "react";
import useSWR from "swr";
import status from "@/data/status.json";
import SelectCustom from "@/components/SelectCustom";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
const OrderPage = () => {
  const { user } = useAuth();
  const path = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const s = searchParams.get("status");
  const page = searchParams.get("page") || "1";
  const { data, isLoading, error } = useSWR<{ orders: Order[] }>(
    `/orders/user/${user?._id}?page=${page}${s ? `&status=${s}` : ""}`,
    fetcher
  );
  const onValueChange = (val: string) => {
    replace(`${path}?status=${val}`);
  };
  if (isLoading) return <Loading />;
  if (error) return <p>Error</p>;
  return (
    <>
      <Button
        onClick={() => setOpenFilter(!openFilter)}
        className="my-4 sm:hidden"
      >
        Filter
      </Button>
      <div className="sm:flex gap-2 w-full md:px-5">
        <div
          className={`${
            openFilter ? "!flex" : ""
          } w-full bg-black sm:w-[20rem] my-2 sm:my-0 max-h-[90vh] hidden sm:flex border-rounded p-4 flex-col gap-y-5`}
        >
          <div className="flex justify-between items-center w-full">
            <div className="">Filter Order</div>
            <Button disabled={!s} size={"xs"} onClick={() => replace(path)}>
              Reset
            </Button>
          </div>
          <div className="">
            <div className="">status</div>
            <SelectCustom
              placeholder="select a status"
              label="status"
              defaultValue={s || undefined}
              onValueChange={onValueChange}
              items={status.map((s, _) => ({ name: s, value: s }))}
            />
          </div>
        </div>

        <div className="w-full bg-black min-h-40  border-rounded p-1 md:p-4 flex flex-col gap-5">
          {data?.orders && data.orders.length >= 1 ? (
            data.orders.map((ord, idx) => (
              <Link
                href={`${path}/${ord._id}`}
                key={ord._id}
                className="border-rounded p-2 cursor-pointer hover:bg-foreground/10"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs">
                    {formatDate(new Date(ord.createdAt))}
                  </span>
                  <BadgeStatus status={ord.status} />
                </div>
                <div className="flex flex-row gap-3 h-full">
                  <div className="relative min-w-16 mx-auto md:mx-0 md:min-w-24 h-16 md:min-h-24 border-rounded ">
                    <Image
                      src={ord.orderItems[0].product.images[0].url}
                      fill
                      alt={"Image product"}
                    />
                  </div>
                  <div className="flex flex-col min-w-[70%] w-full overflow-hidden">
                    <div className="">
                      <div className="text-sm max-w-[100%] text-wrap">
                        {ord.orderItems[0].product.name}
                      </div>
                      {ord.orderItems.length > 1 ? (
                        <div className="text-xs italic">
                          {" "}
                          +{ord.orderItems.length} product lainnya
                        </div>
                      ) : null}
                    </div>

                    <div className="text-xs  flex gap-1 justify-items-end">
                      <span>Total</span>
                      <span>{formatIDR(ord.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>{s ? "no order for status " + `"${s}"` : "order not found"}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderPage;

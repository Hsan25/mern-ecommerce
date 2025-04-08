"use client";
import { fetcher } from "@/lib/fetcher";
import React from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatIDR } from "@/utils";
import Loading from "@/components/Loading";
const DashboardShippingMethodPage = () => {
  const { push } = useRouter();
  const { data, isLoading } = useSWR<{
    shippingMethod: {
      type: string;
      price: number;
      _id: string;
    }[];
  }>("/shipping-method", fetcher);

  if (isLoading) return <Loading />;
  return (
    <>
      <Button onClick={() => push("shipping-method/add")}>
        add shipping method
      </Button>
      <div className="font-medium text-lg my-3">
        Shipping Method is Available
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 my-5">
        {data?.shippingMethod.map((sm, idx) => (
          <div key={idx} className="p-2 border-rounded flex flex-col gap-3">
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  push(`/dashboard/shipping-method/delete/${sm._id}`)
                }
                variant={"destructive"}
                size={"xs"}
              >
                Delete
              </Button>
              <Button
                onClick={() =>
                  push(`/dashboard/shipping-method/update/${sm._id}`)
                }
                variant={"default"}
                size={"xs"}
              >
                Update
              </Button>
            </div>
            <span>Type: {sm.type}</span>
            <span>Price: {formatIDR(sm.price)}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardShippingMethodPage;

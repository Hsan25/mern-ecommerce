"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";

interface ReportEcommerce {
  user: {
    admin: number;
    user: number;
  };
  totalProduct: number;
  order: {
    pending: number;
    processing: number;
    total: number;
  };
}
const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useSWR<ReportEcommerce>(
    "/report-ecommerce",
    fetcher
  );
  const { push } = useRouter();

  if ((isLoading && !data) || !user) return <p>Loading...</p>;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center w-full ">
        <div className="bg-gray-600/30 min-h-32 min-w-full sm:w-1/2 p-4 mt-6 rounded-md ">
          <div className="text-lg font medium">Profile</div>
          <div className="sm:flex justify-between">
            <div className="mb-3">
              <div className="font-medium">userame: {user?.username}</div>
              <div className="font-medium">email: {user?.email}</div>
              <div className="font-medium">role: {user?.role}</div>
            </div>
            <Button
              size={"sm"}
              onClick={() => push(`/dashboard/users/edit/${user?._id}`)}
            >
              update
            </Button>
          </div>
        </div>
        <div className="bg-gray-600/30 min-h-32 min-w-full sm:w-1/2 p-4 mt-6 rounded-md ">
          <div className="text-lg font medium">Users</div>
          <div className="">
            <div className="font-medium">total user: {data?.user.user}</div>
            <div className="font-medium">total admin: {data?.user.admin}</div>
          </div>
        </div>
        <div className="bg-gray-600/30 min-h-32 min-w-full sm:w-1/2 p-4 mt-6 rounded-md ">
          <div className="text-lg font medium">Products</div>
          <div className="">
            <div className="font-medium">
              total product: {data?.totalProduct}
            </div>
          </div>
        </div>
        <div className="bg-gray-600/30 min-h-32 min-w-full sm:w-1/2 p-4 mt-6 rounded-md ">
          <div className="text-lg font medium">Orders</div>
          <div className="">
            <div className="font-medium">
              order pending : {data?.order.pending}
            </div>
            <div className="font-medium">
              order processing: {data?.order.processing}
            </div>
            <div className="font-medium">total order: {data?.order.total}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

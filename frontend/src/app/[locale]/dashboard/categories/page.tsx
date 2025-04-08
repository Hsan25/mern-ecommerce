"use client";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import React from "react";
import useSWR from "swr";
import { FaPlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import Loading from "@/components/Loading";
const DashboardCategoriesPage = () => {
  const { data, isLoading } = useSWR<{ categories: Category[] }>(
    "/categories",
    fetcher
  );
  const { push } = useRouter();
  if (isLoading) return <Loading />;
  return (
    <>
      <div className="text-lg font-semibold">Categories</div>
      <Button
        onClick={() => push("categories/add")}
        className="flex gap-1 items-center my-5"
      >
        <FaPlus size={20} />
        <span>Category</span>
      </Button>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 my-5">
        {data?.categories.map((sm, idx) => (
          <div key={idx} className="p-2 border-rounded flex flex-col gap-3">
            <div className="flex gap-2">
              <Button
                onClick={() => push(`/dashboard/categories/delete/${sm._id}`)}
                variant={"destructive"}
                size={"xs"}
              >
                Delete
              </Button>
              <Button
                onClick={() => push(`/dashboard/categories/update/${sm._id}`)}
                variant={"default"}
                size={"xs"}
              >
                Update
              </Button>
            </div>
            <span>Name: {sm.name}</span>
          </div>
        ))}
      </div>
      {!data && !isLoading ? <p>no category</p> : null}
    </>
  );
};

export default DashboardCategoriesPage;

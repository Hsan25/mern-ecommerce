"use client";
import { fetcher } from "@/lib/fetcher";
import React, { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Dialog as DialogWrapper,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useRouter } from "next/navigation";
import InputLabel from "@/components/InputLabel";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import apiService from "@/lib/axios";
import { Category } from "@/types";

interface ShippingMethod {
  type: string;
  price: number;
}
const DashboardUpdateCategoryPage = ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<{ name: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { data, isLoading: loadingData } = useSWR<{
    categories: Category[];
  }>(`/categories/${id}`, fetcher);
  const onSubmit = async (data: { name: string }) => {
    setIsLoading(true);
    try {
      const res = await apiService.put(`/categories/${id}`, data);
      if (res.status !== 200) throw new Error("Error update shipping method");
      toast({
        title: "notif",
        description: "success update shipping method",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "notif",
        description: "failed update shipping method",
      });
    } finally {
      setIsLoading(false);
      push("/dashboard/categories");
    }
  };
  if (loadingData) return <p>Loading...</p>;
  if (!data) return <p>Error...</p>;
  return (
    <>
      <DialogWrapper
        defaultOpen={true}
        onOpenChange={(e) => {
          push("/dashboard/categories");
        }}
      >
        <DialogContent className={`sm:max-w-[425px]`}>
          <DialogHeader>
            <DialogTitle>Update shipping method</DialogTitle>
            <DialogDescription>
              Click save when you{"'"}re done.
            </DialogDescription>
          </DialogHeader>
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <InputLabel
                label="name"
                defaultValue={data.categories[0].name}
                type="text"
                {...register("name", { required: true })}
              />
            </div>
            <DialogFooter className="gap-3">
              <Button
                disabled={isLoading}
                onClick={() => push("/dashboard/categories")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogWrapper>
    </>
  );
};

export default DashboardUpdateCategoryPage;

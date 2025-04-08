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
import Loading from "@/components/Loading";

interface ShippingMethod {
  type: string;
  price: number;
}
const DashboardUpdateShippingMethodPage = ({ params: { id } }: { params: { id: string } }) => {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<ShippingMethod>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { data, isLoading: loadingData } = useSWR<{ shippingMethod: ShippingMethod }>(
    `/shipping-method/${id}`,
    fetcher
  );
  const onSubmit = async (data: ShippingMethod) => {
    setIsLoading(true);
    try {
      const res = await apiService.put(`/shipping-method/${id}`, data);
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
      push("/dashboard/shipping-method");
    }
  };
  if (loadingData) return <Loading/>;
  if (!data) return <p>not found</p>;
  return (
    <>
      <DialogWrapper
        defaultOpen={true}
        onOpenChange={(e) => {
          push("/dashboard/shipping-method");
        }}>
        <DialogContent className={`sm:max-w-[425px]`}>
          <DialogHeader>
            <DialogTitle>add shipping method</DialogTitle>
            <DialogDescription>Click save when you{"'"}re done.</DialogDescription>
          </DialogHeader>
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <InputLabel label="Type" defaultValue={data.shippingMethod.type} type="text" {...register("type", { required: true })} />
              <InputLabel label="Price" defaultValue={data.shippingMethod.price} type="number" {...register("price", { required: true })} />
            </div>
            <DialogFooter className="gap-3">
              <Button disabled={isLoading} onClick={() => push("/dashboard/shipping-method")}>
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

export default DashboardUpdateShippingMethodPage;

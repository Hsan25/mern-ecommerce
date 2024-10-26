"use client";
import React, { useState } from "react";
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

interface ShippingMethod {
  type: string;
  price: number;
}
const DashboardShippingMethodPage = () => {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<ShippingMethod>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const onSubmit = async (data: ShippingMethod) => {
    setIsLoading(true);
    try {
      const res = await apiService.post(`/shipping-method`, data);
      if (res.status !== 201) throw new Error("Error add shipping method");
      toast({
        title: "notif",
        description: "success add shipping method",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "notif",
        description: "failed add shipping method",
      });
    } finally {
      setIsLoading(false);
      push("/dashboard/shipping-method");
    }
  };
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
              <InputLabel label="Type" type="text" {...register("type", { required: true })} />
              <InputLabel label="Price" type="number" {...register("price", { required: true })} />
            </div>
            <DialogFooter>
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

export default DashboardShippingMethodPage;

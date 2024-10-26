"use client";
import AlertDialog from "@/components/AlertDialog";
import { useToast } from "@/components/ui/use-toast";
import apiService from "@/lib/axios";
import { useRouter } from "next/navigation";
import React from "react";

const ShippingMethodDeletePage = ({ params: { id } }: { params: { id: string } }) => {
  const { push } = useRouter();
  const { toast } = useToast();
  const handleDeleteShippingMethod = async (id: string) => {
    try {
      const res = await apiService.delete(`/shipping-method/${id}`);
      if (res.status != 200) throw new Error("Failed delete shipping method");
      toast({
        description: "delete shipping method is success",
      });
    } catch (error) {
      console.error(error);
      toast({
        description: "delete shipping method is failed",
      });
      throw new Error("Failed delete shipping");
    }
  };
  return (
    <AlertDialog
      title={"Delete shipping method"}
      description={`shipping method with id:${id} delete?`}
      open={true}
      onContinue={() => {
        handleDeleteShippingMethod(id);
        push("/dashboard/shipping-method");
      }}
      onCancel={() => push("/dashboard/shipping-method")}
    />
  );
};

export default ShippingMethodDeletePage;

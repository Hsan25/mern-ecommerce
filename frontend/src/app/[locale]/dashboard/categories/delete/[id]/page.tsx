"use client";
import AlertDialog from "@/components/AlertDialog";
import { useToast } from "@/components/ui/use-toast";
import apiService from "@/lib/axios";
import { useRouter } from "next/navigation";
import React from "react";

const CategoryDeletePage = ({ params: { id } }: { params: { id: string } }) => {
  const { push } = useRouter();
  const { toast } = useToast();
  const handleDeleteShippingMethod = async (id: string) => {
    try {
      const res = await apiService.delete(`/categories/${id}`);
      if (res.status != 200) throw new Error("Failed delete category");
      toast({
        description: "delete category is success",
      });
    } catch (error) {
      console.error(error);
      toast({
        description: "delete category is failed",
      });
      throw new Error("Failed delete shipping");
    }
  };
  return (
    <AlertDialog
      title={"Delete category"}
      description={`category with id:${id} delete?`}
      open={true}
      onContinue={() => {
        handleDeleteShippingMethod(id);
        push("/dashboard/categories");
      }}
      onCancel={() => push("/dashboard/categories")}
    />
  );
};

export default CategoryDeletePage;

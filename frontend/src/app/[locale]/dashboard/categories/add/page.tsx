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

interface CategorySchema {
  name: string;
}
const DashboardAddCategoryPage = () => {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<CategorySchema>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const onSubmit = async (data: CategorySchema) => {
    setIsLoading(true);
    try {
      const res = await apiService.post(`/categories`, data);
      if (res.status !== 201) throw new Error("Error add category");
      toast({
        title: "notif",
        description: "success add category",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "notif",
        description: "failed add category",
      });
    } finally {
      setIsLoading(false);
      push("/dashboard/categories");
    }
  };
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
            <DialogTitle>add category</DialogTitle>
            <DialogDescription>
              Click save when you{"'"}re done.
            </DialogDescription>
          </DialogHeader>
          <form method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <InputLabel
                label="Name"
                {...register("name", { required: true })}
              />
            </div>
            <DialogFooter>
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

export default DashboardAddCategoryPage;

"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog as DialogWrapper,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiService from "@/lib/axios";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusOrder } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import SelectCustom from "@/components/SelectCustom";

interface Props {
  open: boolean;
  params: {
    id: string;
  };
}

const status = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Not processed"];

const UpdateOrderPage = ({ open, params }: Props) => {
  const { push } = useRouter();
  const [statusOrder, setStatusOrder] = useState<StatusOrder>();
  const { toast } = useToast();

  const { data: order, isLoading } = useSWR<Order>(
    `/orders/${params.id}`,
    async (url:string) => await fetcher(url, "order")
  )
  const sumbitChanges = async (e: any) => {
    try {
      const res = await apiService.put(`/orders/${params.id}`, {
        status: statusOrder,
      });
      toast({
        title: "notification",
        description: "success update status order",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "notification",
        description: "failed update status order",
      });
    } finally {
      push("/dashboard/orders");
    }
  };

  return (
    <>
      {!isLoading && order ? (
        <DialogWrapper
          defaultOpen={true}
          onOpenChange={(e) => {
            push("/dashboard/orders");
          }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Order</DialogTitle>
              <DialogDescription>
                Make changes status order here. Click save when you{"'"}re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  id
                </Label>
                <Input id="name" defaultValue={order._id} disabled={true} className="col-span-3" />
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-right">status</Label>
                <SelectCustom
                  defaultValue={order.status}
                  onValueChange={(val: string) => setStatusOrder(val as StatusOrder)}
                  placeholder="Select a Status Order"
                  label="Status Order"
                  items={status.map((s, i) => ({ name: s, value: s }))}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" onClick={sumbitChanges} disabled={!statusOrder}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogWrapper>
      ) : (
        <p>Loading....</p>
      )}
    </>
  );
};

export default UpdateOrderPage;

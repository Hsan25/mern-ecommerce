/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { fetcher } from "@/lib/fetcher";
import { OrderDetail } from "@/types/order";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import AlertDialog from "@/components/AlertDialog";
import { useRouter } from "next/navigation";
import apiService from "@/lib/axios";
import { useAuth } from "@/context/authContext";
import { useToast } from "@/components/ui/use-toast";
import { PaymentMethod } from "@/types";
import { PaymentMethodType } from "@/types/payment";
import Loading from "@/components/Loading";
interface Props {
  params: {
    id: string;
  };
}
const PayOrderPage = ({ params }: Props) => {
  const [order, setOrder] = useState<OrderDetail>();
  const { push } = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payment, setPayment] = useState<PaymentMethodType>();
  const { user, isAuthenticate } = useAuth();
  const { toast } = useToast();
  const createPayment = async () => {
    try {
      if (!user) return toast({ description: "error" });
      const res = await apiService.post(`/pay/${params.id}`, {
        orderId: params.id,
        user: user?._id,
      });
      toast({
        title: "notif",
        description: "success request confirmation",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "notif",
        description: "failed request confirmation",
      });
    } finally {
      setOpen(false);
      push("/order");
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const res = await apiService.get(`/orders/${params.id}`);
        const data = res.data.data.order;
        setOrder(data as OrderDetail);
      } catch (error) {
        console.log(error);
      }
      // setIsLoading(false);
    };
    if (!order && isAuthenticate) fetchOrder();
  }, [isAuthenticate]);
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await apiService.get("/payment-method");
        const payments = res.data.data.paymentMethod as PaymentMethodType[];
        let pay = payments.filter((p) => p.method == order?.payment.method);
        setPayment(pay[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (order) fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);
  if (isLoading) return <Loading />;
  if (
    order?.payment.isPaid ||
    order?.status == "Cancelled" ||
    order?.payment.status != null
  ) {
    return push("/");
  }
  return (
    <>
      <AlertDialog
        open={open}
        title="notif"
        label={{ continue: "Confirm" }}
        description="Click confirm if you have paid for the order. 
                      Please wait for payment confirmation from the admin, a maximum of 1x24 hours."
        onCancel={() => setOpen(false)}
        onContinue={() => createPayment()}
      ></AlertDialog>
      <div className="border-rounded p-2 w-full max-w-96 sm:w-80 mx-auto">
        <div className="">Pay Order Now</div>
        <div className="">
          <div className="">
            <span>method: </span>
            <span>{payment?.method}</span>
          </div>
          <div className="">
            <span>name: </span>
            <span>{payment?.account.name}</span>
          </div>
          <div className="">
            <span>no: </span>
            <span>{payment?.account.nomor}</span>
          </div>
        </div>

        <Button onClick={() => setOpen(!open)} className="block mx-auto my-4">
          Pay Now
        </Button>
        <div className="text-sm font-medium">
          note: Please pay for your order on the account above
        </div>
      </div>
    </>
  );
};

export default PayOrderPage;

import { Button } from "../ui/button";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatIDR } from "@/utils";
import { Input } from "../ui/input";
import { PaymentMethod } from "@/types";
import { createOrder } from "@/action/order.action";
import { toast } from "../ui/use-toast";
import { useOrder } from "@/context/orderContext";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { PaymentMethodType } from "@/types/payment";

const FormPayment = () => {
  const { order, setPayment } = useOrder();
  const path = usePathname();
  const { replace } = useRouter();
  const { data, isLoading } = useSWR<PaymentMethodType[]>(
    "/payment-method",
    async (url: string) => {
      return await fetcher(url, "paymentMethod");
    }
  );
  const handleChange = (p: PaymentMethod) => {
    setPayment(p);
  };
  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!order) return;
    try {
      const res = await createOrder(order);
      toast({ description: "create order success", duration: 1000 });
      replace(`/order/${res.id}`);
    } catch (error) {
      toast({ description: "create order failed", duration: 1000 });
    }
  };
  useEffect(() => {
    if (!order?.address || !order.shipping || !order) {
      replace(`${path}?current=address`);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isLoading && !data) return <p>Loading...</p>;
  return (
    <form
      onSubmit={onSubmit}
      method="post"
      className="p-6 px-6 max-w-lg lg:mx-0 lg:max-w-2xl mx-auto lg:px-14 w-full lg:w-1/2"
    >
      <div className="flex flex-col gap-2 my-4">
        <div className="w-full text-sm flex gap-2 items-center bg-gray-700/15 rounded-sm p-3">
          <div className="">
            <div className="font-semibold">Address</div>
            <div className="text-wrap">
              {[
                order?.address?.address,
                order?.address?.city,
                order?.address?.state,
                order?.address?.country,
              ].join(`, `)}
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              replace(`${path}?current=address`);
            }}
            variant={"link"}
            size={"sm"}
            className="text-blue-600 max-w-max"
          >
            Change
          </Button>
        </div>
        <div className="w-full text-sm flex justify-between gap-2 items-center bg-gray-700/15 rounded-sm p-3">
          <div>
            <div className="font-semibold">Shipping Method</div>
            <div className="flex gap-3">
              <span className="">{order?.shipping?.type}</span>
              <span>{formatIDR(order?.shipping?.price || 0)}</span>
            </div>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              replace(`${path}?current=shipping`);
            }}
            variant={"link"}
            size={"sm"}
            className="text-blue-600 max-w-max"
          >
            Change
          </Button>
        </div>
      </div>

      <div className="font-semibold"> Select Method Payment</div>
      <div className="flex flex-col my-6 gap-3">
        {data?.map((p, idx) => (
          <div
            key={idx}
            onClick={() => handleChange(p.method as PaymentMethod)}
            className={`${
              order?.payment == p.method ? "border-2 border-foreground" : ""
            } w-full font-semibold cursor-pointer  flex  gap-5 items-center bg-gray-700/15 rounded-sm p-3`}
          >
            <Input
              type="radio"
              checked={order?.payment == p.method}
              onChange={() => handleChange(p.method as PaymentMethod)}
              className="w-6 h-6 cursor-pointer"
            />
            <span>{p.method}</span>
          </div>
        ))}
      </div>

      <Button type="submit">create order</Button>
    </form>
  );
};

export default FormPayment;

import { Button } from "../ui/button";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { formatIDR } from "@/utils";
import { Input } from "../ui/input";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ShippingMethod } from "@/types";
import { useOrder } from "@/context/orderContext";
const FormShipping = () => {
  const { replace } = useRouter();
  const path = usePathname();
  const { order, setShipping } = useOrder();
  const { data: shipping } = useSWR<ShippingMethod[]>(
    "/shipping-method",
    async () => await fetcher("/shipping-method", "shippingMethod")
  );
  const handleChange = (ship: { price: number; type: string }) => {
    setShipping(ship);
  };
  useEffect(() => {
    if (!order?.address || !order) {
      replace(`${path}?current=address`);
      return;
    }
  }, []);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        replace(`${path}?current=payment`);
      }}
      className="p-6 px-6 min-h-full max-w-lg lg:mx-0 lg:max-w-2xl mx-auto lg:px-14 w-full lg:w-1/2">
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
          className="text-blue-600 max-w-max">
          Change
        </Button>
      </div>

      <div className="flex flex-col gap-3 my-7">
        {shipping?.map((s, idx) => (
          <div
            key={idx}
            onClick={() => handleChange(s)}
            className={`${
              order?.shipping?.type == s.type ? "border-2 border-foreground" : ""
            } w-full text-sm flex gap-2 cursor-pointer items-center bg-gray-700/15 rounded-sm p-3`}>
            <Input
              type="radio"
              checked={order?.shipping?.type == s.type}
              onChange={() => handleChange(s)}
              className="w-6 h-6 cursor-pointer"
            />
            <span>{s.type} |</span>
            <span>{formatIDR(s.price)}</span>
          </div>
        ))}
      </div>
      <Button type="submit">Continue to Payment</Button>
    </form>
  );
};

export default FormShipping;

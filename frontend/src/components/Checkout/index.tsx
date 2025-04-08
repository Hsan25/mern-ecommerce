"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Cart, CartItem } from "@/types/cart";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import { calculateTaxPrice, formatIDR } from "@/utils";
import FormCheckOut from "@/components/Form/FormCheckout";
import { useOrder } from "@/context/orderContext";
import Loading from "../Loading";
interface Props {
  id: string;
}

const CartItems = ({ cart }: { cart: CartItem }) => {
  return (
    <div className="flex gap-2" key={cart._id}>
      <div className="relative w-16 h-16 border border-foreground">
        <Image src={cart.product.images[0].url} alt={"Image product"} fill />
      </div>
      <div className="">
        <div className="text-sm">{cart.product.name}</div>
        <div className="text-[.7rem]">{`${cart.quantity} x ${formatIDR(
          cart.purchasePrice
        )}`}</div>
      </div>
    </div>
  );
};

const CheckOut = ({ id }: Props) => {
  const { user } = useAuth();
  const { order, setOrderItem } = useOrder();
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = useSWR<Cart>(
    `/carts/${id}/${user?._id}`,
    async () => await fetcher(`/carts/${id}/${user?._id}`, "cart")
  );
  useEffect(() => {
    if (data) {
      let items = [];
      for (const c of data.items) {
        items.push(c._id);
      }
      setOrderItem(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  if (isLoading) return <Loading />;
  if (!data) return <p>cart not found</p>;
  return (
    <>
      <div className="lg:flex justify-between absolute inset-0 min-w-full min-h-full">
        <div className="lg:hidden px-4 max-w-lg mx-auto">
          <Button
            onClick={() => setOpen(!open)}
            className="max-w-max mx-auto my-6  block"
          >
            show items
          </Button>
          <div
            className={`${
              open ? "h-[60vh]" : "h-0"
            } transition-all overflow-hidden w-full delay-200 border-b border-foreground`}
          >
            <div className="flex  p-1 border border-foreground max-h-[40vh] overflow-y-auto h-full flex-col gap-3 pt-7">
              {data.items.map((c, idx) => (
                <div className="flex gap-2" key={c._id}>
                  <div className="relative min-w-16 h-16 border border-foreground">
                    <Image
                      src={c.product.images[0].url}
                      alt={"Image product"}
                      fill
                    />
                  </div>
                  <div className="">
                    <div className="text-sm">{c.product.name}</div>
                    <div className="text-[.7rem]">{`${c.quantity} x ${formatIDR(
                      c.purchasePrice
                    )}`}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm pt-7 flex flex-col gap-3">
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculating...</span>
              </div>
              <div className="flex justify-between gap-3">
                <div>
                  Total Tax{" "}
                  <span className="text-xs text-balance">{" PPN (11%)"}</span>
                </div>
                <span>
                  <>
                    {formatIDR(
                      data.items.reduce(
                        (a, b) => a + calculateTaxPrice(b.totalPrice),
                        0
                      ) || 0
                    )}
                  </>
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Total</span>
                <span>
                  <>
                    {formatIDR(
                      data.items.reduce((a, b) => a + b.totalPrice, 0) || 0
                    )}
                  </>
                </span>
              </div>
            </div>
          </div>
        </div>
        <FormCheckOut />
        <div className="border hidden lg:block p-6 min-h-screen fixed right-0 border-foreground min-w-[30rem]">
          <div className="flex  p-1 border border-foreground max-h-[70vh] overflow-y-auto min-h-[70vh] flex-col gap-3 pt-7">
            {data.items.map((c, idx) => (
              <CartItems cart={c} key={idx} />
            ))}
          </div>
          <div className="text-sm pt-7 flex flex-col gap-3">
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {order?.shipping
                  ? formatIDR(order?.shipping?.price)
                  : "Calculate next step"}
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <div>
                Total Tax{" "}
                <span className="text-xs text-balance">{" PPN (11%)"}</span>
              </div>
              <span>
                <>
                  {formatIDR(
                    data.items.reduce(
                      (a, b) => a + calculateTaxPrice(b.totalPrice),
                      0
                    ) || 0
                  )}
                </>
              </span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Total</span>
              <span>
                <>
                  {formatIDR(
                    data.items.reduce((a, b) => a + b.totalPrice, 0) || 0
                  )}
                </>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOut;

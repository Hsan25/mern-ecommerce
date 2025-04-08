"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { Cart } from "@/types/cart";
import { formatIDR } from "@/utils";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import CartItems from "./CartItems";
import Loading from "../Loading";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartPage = ({ open, onClose }: Props) => {
  const [carts, setCarts] = useState<Cart>();
  const { user } = useAuth();
  const { push } = useRouter();
  const { data, isLoading } = useSWR<{ cart: Cart }>(
    `/carts/${user?._id}`,
    fetcher
  );
  useEffect(() => {
    if (!isLoading) setCarts(data?.cart);
  }, [isLoading, data]);

  return (
    <div
      className={`${
        open ? "-right-0" : "-right-[700px]"
      } w-full sm:w-96 p-4 py-3 bg-black duration-200 transition-all  sm:border-l sm:border-foreground/30 min-h-screen fixed inset-y-0 z-50 `}
    >
      <div className="flex w-full my-4 items-center justify-between">
        <div className="">Cart</div>
        <Button variant={"outline"} onClick={onClose}>
          Close
        </Button>
      </div>

      {!isLoading ? (
        <div className="border max-w-full relative min-h-[70vh] overflow-y-auto overflow-x-hidden max-h-[70vh] border-foreground">
          <div className="flex flex-col gap-3">
            {carts && carts.items.length > 0 ? (
              carts.items.map((cart, idx) => (
                <CartItems
                  cart={cart}
                  key={idx}
                  setCarts={setCarts}
                  close={onClose}
                />
              ))
            ) : (
              <p className="text-center absolute inset-0 top-1/2 ">
                cart is empty
              </p>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}

      <div className="w-full relative  flex flex-col bottom-0">
        <div className="">
          Total:
          <span className="text-sm">
            {!isLoading
              ? formatIDR(
                  carts?.items.reduce((a, b) => a + b.totalPrice, 0) || 0
                )
              : "Loading..."}
          </span>
        </div>
        <Button
          variant={"outline"}
          className="w-full"
          onClick={() => {
            onClose();
            push(`/checkout/${carts?._id}`, { scroll: true });
          }}
          disabled={carts?.items.length == 0 || !carts}
        >
          CheckOut
        </Button>
      </div>
    </div>
  );
};

export default CartPage;

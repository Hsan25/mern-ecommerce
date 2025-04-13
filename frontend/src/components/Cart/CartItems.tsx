import { useAuth } from "@/context/authContext";
import apiService from "@/lib/axios";
import { delay } from "@/lib/utils";
import { Cart, CartItem } from "@/types/cart";
import { formatIDR } from "@/utils";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";

const CartItems = ({
  cart,
  setCarts,
  close,
}: {
  cart: CartItem;
  setCarts: React.Dispatch<React.SetStateAction<Cart | undefined>>;
  close: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const handleUpdateQuantity = async (itemId: string, qty: number | string) => {
    setIsLoading(true);
    try {
      const res = await apiService.put(`/carts/${itemId}`, { quantity: qty });
    } catch (error) {
      console.log("Failed add quantity");
    }
    // supaya tidak spam update quantity
    await delay(200); //delay for waiting update quantity
    //
    const fetchCart = async () => {
      try {
        const res = await apiService.get(`/carts/${user?._id}`);
        const data = res.data.data;
        setCarts(data.cart as Cart);
      } catch (error) {
        setCarts(undefined);
      }
    };
    await fetchCart();
    setIsLoading(false);
  };
  const handleDeleteItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      const res = await apiService.delete(`/carts/${itemId}`);
    } catch (error) {
      console.log("Failed delete item");
    }
    await delay(100);
    const fetchCart = async () => {
      try {
        const res = await apiService.get(`/carts/${user?._id}`);
        const data = res.data.data;
        setCarts(data.cart as Cart);
      } catch (error) {
        console.log("Failed fetch cart");
        setCarts(undefined);
      }
    };
    fetchCart();
    setIsLoading(false);
  };
  return (
    <div className="min-h-36 max-h-40 p-2  border w-full gap-3 flex items-start ">
      <div className="relative max-h-full min-w-20 min-h-24 border-2 border-white sm:min-w-24 sm:min-h-24">
        <Image
          src={cart.product.images[0].url || ""}
          fill={true}
          alt={"cart product"}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href={`/products/${cart.product._id}`}
          onClick={close}
          className="text-wrap text-sm hover:underline"
        >
          {cart.product.name}
        </Link>
        <div className="text-sm text-wrap mt-auto max-w-full truncate">
          {formatIDR(cart.purchasePrice)}
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex gap-[.1rem] items-center">
            {/* <div className="text-sm">Qty</div> */}
            <Button
              onClick={() => {
                handleUpdateQuantity(cart._id, cart.quantity - 1);
                setIsLoading(true);
              }}
              size={"xs"}
              variant={"outline"}
              className="text-xs"
              disabled={isLoading || cart.quantity <= 1}
            >
              {isLoading ? ".." : "-"}
            </Button>
            <Input
              type={"text"}
              disabled={true}
              value={cart.quantity}
              className="w-10 h-6 p-2 text-center text-xs pointer-events-none"
            />
            <Button
              onClick={() => {
                handleUpdateQuantity(cart._id, cart.quantity + 1);
              }}
              size={"xs"}
              variant={"outline"}
              className="text-xs"
              disabled={isLoading || cart.quantity >= cart.product.stock}
            >
              {isLoading ? ".." : "+"}
            </Button>
          </div>
          <Button
            className="text-xs hover:underline"
            onClick={() => handleDeleteItem(cart._id)}
            variant={"link"}
            size={"xs"}
          >
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;

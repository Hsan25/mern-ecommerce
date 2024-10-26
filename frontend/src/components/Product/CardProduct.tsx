"use client";
import { Product } from "@/types";
import { formatIDR } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Rating from "./Rating";
const CartProduct = ({ product }: { product: Product }) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="min-h-40 max-w-48  md:min-w-44 p-1 rounded max-h-80 sm:min-h-60 border-2 border-foreground">
      <div className="img relative min-h-32 sm:min-h-36 border-2 border-foreground">
        <Image src={product.images[0] || ""} loading="lazy" alt={"image product"} fill={true} />
      </div>
      <div className="flex max-h-full flex-col pt-3 gap-2 justify-between">
        <p className="text-base sm:text-base tracking-normal">{product.name}</p>
        <div className="flex gap-1 items-center">
          <Rating rating={product.ratings} />
        </div>
        <div className="text-wrap text-base relative bottom-0 truncate">
          {formatIDR(product.price)}
        </div>
      </div>
    </Link>
  );
};

export default CartProduct;

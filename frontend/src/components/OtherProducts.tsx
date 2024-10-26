"use client";
import { Product } from "@/types";
import React from "react";
import Image from "next/image";
import { formatIDR } from "@/utils";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const OtherProducts = ({ product }: { product: Product | undefined }) => {
  const { data, isLoading } = useSWR<{ products: Product[] }>(`/products?page=1&limit=5`, fetcher);

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="w-full max-h-[45rem] p-1 py-5 min-h-80 relative rounded-md border-foreground border-2">
      <div className="my-2 font-semibold text-lg">Other Products</div>
      {data?.products ? (
        <div className="flex flex-col w-full gap-4">
          {data?.products.map((p, idx) => (
            <Link
              href={`/products/${p._id}`}
              key={idx}
              className="rounded p-1 group flex gap-2 w-full border-foreground border-2">
              <div className="min-w-24 h-24 relative rounded border-foreground border-2">
                <Image src={p.images[0]} alt={"image product"} fill />
              </div>
              <div className="flex-col p-1">
                <div className="group-hover:underline text-sm">{p.name}</div>
                <div className="flex gap-1 items-center">
                  <FaStar className="fill-primary" size={18} />
                  <div className="text-xs mt-0.5">{p.ratings}</div>
                </div>
                <div className="truncate text-sm">{formatIDR(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default OtherProducts;

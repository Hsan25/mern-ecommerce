import { Product } from "@/types";
import React from "react";
import CardProduct from "./CardProduct";

const ListProduct = ({
  products,
  direction,
}: {
  products: Product[];
  direction?: "col" | "row";
}) => {
  if (direction == "col") {
    return (
      <div className="flex-col gap-3">
        {products.map((p, idx) => (
          <CardProduct product={p} key={idx} />
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="grid max-h-full gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((p, idx) => (
          <CardProduct product={p} key={idx} />
        ))}
      </div>
    </>
  );
};

export default ListProduct;

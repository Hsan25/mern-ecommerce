"use client";
import { Pagination, Product } from "@/types";
import { useSearchParams } from "next/navigation";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import FilterProduct from "@/components/FilterProduct";
import CartProduct from "@/components/Product/CardProduct";
import PaginationProducts from "@/components/Pagination";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const s = searchParams.get("search");
  const page = searchParams.get("page") || 1;
  const sortBy = searchParams.get("sortBy");

  const { data, isLoading } = useSWR<{
    products: Product[];
    pagination: Pagination;
  }>(
    `/products?limit=10&page=${Number(page)}${s ? `&search=${s}` : ""}${
      sortBy ? `&sortBy=${sortBy}` : ""
    }`,
    fetcher
  );

  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      <div className="text-lg my-5">
        {!isLoading && s ? `search result ${s}` : ""}
      </div>
      <div className="flex flex-col md:flex-row gap-1.5">
        <FilterProduct />
        {data?.products ? (
          <div className="flex flex-col justify-between">
            <div className="grid w-full max-h-full gap-4 grid-cols-2  md:grid-cols-3 xl:grid-cols-4">
              {data.products.map((p, idx) => (
                <CartProduct key={idx} product={p} />
              ))}
            </div>
            <PaginationProducts totalPages={data.pagination.totalPages} />
          </div>
        ) : (
          <p>Product not found</p>
        )}
        {!data?.products && s ? <p>no result for {s}</p> : null}
      </div>
    </>
  );
};

export default ProductsPage;

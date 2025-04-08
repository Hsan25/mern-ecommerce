"use client";
import { Pagination, Product } from "@/types";
import { useSearchParams } from "next/navigation";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import FilterProduct from "@/components/FilterProduct";
import CartProduct from "@/components/Product/CardProduct";
import PaginationProducts from "@/components/Pagination";
import Loading from "@/components/Loading";

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

  if (isLoading) return <Loading />;
  return (
    <>
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
          <p className="">
            no result for <span className="font-medium">{s}</span>
          </p>
        )}
      </div>
    </>
  );
};

export default ProductsPage;

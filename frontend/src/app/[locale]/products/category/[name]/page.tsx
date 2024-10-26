"use client";
import { Pagination, Product } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import FilterProduct from "@/components/FilterProduct";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import CartProduct from "@/components/Product/CardProduct";
import PaginationProducts from "@/components/Pagination";

const ProductsCategoryPage = ({ params }: { params: { name: string } }) => {
  const searchParams = useSearchParams();
  const path = usePathname();
  const s = searchParams.get("search");
  const page = searchParams.get("search") || "1";
  const sortBy = searchParams.get("sortBy");
  const { data, isLoading } = useSWR<{ products: Product[]; pagination: Pagination }>(
    `/products/category/${params.name}?limit=10&page=${page}${s ? `&search=${s}` : ""}${
      sortBy ? `&sortBy=${sortBy}` : ""
    }`,
    fetcher
  );
  return (
    <>
      <div className="text-lg my-5">{s ? `search result ${s}` : ""}</div>
      <div className="flex flex-col md:flex-row gap-2">
        <FilterProduct />
        {!isLoading && data?.products ? (
          <div className="flex flex-col justify-between">
            <div className="grid max-h-full gap-4 grid-cols-2  sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4">
              {data.products.map((p, idx) => (
                <CartProduct key={idx} product={p} />
              ))}
            </div>
            <PaginationProducts totalPages={data.pagination.totalPages} />
          </div>
        ) : (
          <>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div>
                product not found for category{" "}
                <span className="text-lg">{`"${decodeURI(path.split("/")[3])}"`}</span>
              </div>
            )}
          </>
        )}
        {!isLoading && !data?.products && s ? <p>no result for {s}</p> : null}
      </div>
    </>
  );
};

export default ProductsCategoryPage;

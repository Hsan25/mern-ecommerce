"use client";
import { fetcher } from "@/lib/fetcher";
import { Pagination } from "@/types";
import { Review } from "@/types/reviews";
import { formatDate } from "@/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "../ui/button";
import { delay } from "@/lib/utils";
import Rating from "./Rating";

const ReviewsProducts = ({ id }: { id: string }) => {
  const [reviews, setReviews] = useState<Review[]>();
  const [page, setPage] = useState<number>(1);
  const { data, isLoading } = useSWR<{
    reviews: Review[];
    pagination: Pagination;
  }>(`/products/${id}/reviews?page=${page}`, fetcher);

  useEffect(() => {
    if (page > 1) (async () => await delay(500))();
    if (data)
      setReviews((prev) => {
        if (prev) return [...prev, ...data.reviews] as Review[];
        return data.reviews;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="w-full py-5 p-1 min-h-10 relative rounded-md border-foreground border-2">
      <div className="font-semibold text-lg my-2">Reviews Product</div>
      <div className="flex flex-col p-2 gap-3">
        {reviews && reviews.length >= 1 ? (
          reviews.map((r, idx) => (
            <div
              key={idx}
              className="w-full p-2 flex gap-3 rounded-md border-foreground border-2"
            >
              <div className="w-10 border border-foreground h-9 rounded-full relative">
                <Image
                  src={r.user.avatar || "/default-avatar.jpg"}
                  alt={"avatar"}
                  fill
                  className="rounded-full"
                />
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm">{r.user.username}</div>
                  <div className=" flex items-center gap-2">
                    <div className="text-xs">
                      {formatDate(new Date(r.createdAt))}
                    </div>
                    <div className="flex gap-0.5 items-center">
                      <Rating rating={r.rating} />
                    </div>
                  </div>
                </div>

                <div className="text-sm">{r.comment}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-200">No reviews</p>
        )}
      </div>
      {reviews && data && page >= data.pagination.totalPages ? null : (
        <Button
          onClick={() => setPage(page + 1)}
          size={"sm"}
          className="block mx-auto my-4"
        >
          Show More
        </Button>
      )}
    </div>
  );
};

export default ReviewsProducts;

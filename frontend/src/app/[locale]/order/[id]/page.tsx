"use client";
import BadgeStatus from "@/components/BagdeStatus";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { OrderDetail } from "@/types/order";
import { formatDate, formatIDR } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import Dialog from "@/components/Dialog";
import Loading from "@/components/Loading";
interface Props {
  params: {
    id: string;
  };
}
const DetailOrderPage = ({ params }: Props) => {
  const {
    data: order,
    isLoading,
  } = useSWR<OrderDetail>(
    `/orders/${params.id}`,
    async (url: string) => await fetcher(url, "order")
  );
  const [openDialogAddReview, setOpenDialodAddReview] =
    useState<boolean>(false);
  const { back, push } = useRouter();
  const path = usePathname();
  if (isLoading && !order) return <Loading />;
  if (!order) return <p>Order not found</p>;
  return (
    <>
      <Button onClick={() => back()} className="mb-4">
        Back
      </Button>
      <div className="flex-col sm:flex-row flex gap-3">
        <div className="w-full sm:w-1/2 border-rounded p-1 px-1.5">
          <div className="text-base">Detail Product</div>
          <div className="flex flex-col gap-3 p-1">
            {order.orderItems.map((ord, idx) => (
              <div
                key={ord._id}
                className="flex flex-col md:flex-row gap-3 border-rounded p-2"
              >
                <div className="flex gap-3">
                  <div className="relative min-w-16 sm:min-w-20 h-14 sm:h-20 rounded border-rounded">
                    <Image
                      src={ord.product.images[0].url}
                      fill
                      alt={ord.product.name}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Link
                      href={`/products/${ord.product._id}`}
                      className="text-sm hover:underline"
                    >
                      {ord.product.name}
                    </Link>
                    <div className="text-sm">
                      {ord.quantity} x {formatIDR(ord.purchasePrice)}
                    </div>
                  </div>
                </div>
                {!ord.isReviewed &&
                order.isDelivered &&
                order.status == "Delivered" ? (
                  <>
                    {openDialogAddReview ? (
                      <>
                        <Dialog
                          open={openDialogAddReview}
                          setOpen={setOpenDialodAddReview}
                          product={ord.product}
                          itemId={ord._id}
                        />
                      </>
                    ) : null}
                    <Button
                      size={"sm"}
                      onClick={() =>
                        setOpenDialodAddReview(!openDialogAddReview)
                      }
                      className="mx-auto block my-5"
                    >
                      Add Review
                    </Button>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-1/2 border-rounded p-1 px-1.5">
          <div className="py-3 border-b border-foreground/25">
            <div className="flex justify-between items-center">
              <BadgeStatus status={order.status} />
              {!order.payment.isPaid &&
              order.payment.status != "waiting confirmation" ? (
                <div className="text-xs my-2">
                  pay before {formatDate(new Date(order.expiresAt), true)}
                </div>
              ) : null}
              {order.payment.status == "waiting confirmation" ? (
                <div className="text-xs my-2">waiting confirmation</div>
              ) : null}
            </div>
          </div>
          <div className="py-3 border-b border-foreground/25">
            <div className="text-lg">Info Order</div>
            <div className="text-sm">
              <span>order id: </span>
              <span>{order._id}</span>
            </div>
            <div className="text-sm">
              <span>order at: </span>
              <span>{formatDate(new Date(order.createdAt), true)}</span>
            </div>
          </div>
          <div className="py-3 border-b border-foreground/25">
            <div className="text-lg">Info Shipping</div>
            <div className="text-sm">
              <span>shipping: </span>
              {order?.shipping.type} - {formatIDR(order?.shipping.price)}
            </div>
            <div className="text-sm">
              <span>name: </span>
              <span>{order.shippingAddress.name}</span>
            </div>
            <div className="text-sm">
              <span>contact: </span>
              <span>
                {order.shippingAddress.phoneNumber} -{" "}
                {order.shippingAddress.email}
              </span>
            </div>
            <div className="text-sm flex gap-1">
              <span>address: </span>
              <div className="text-wrap">
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {order.shippingAddress.name}
                  </span>
                  <span className="font-semibold">
                    {order.shippingAddress.phoneNumber} -{" "}
                    {order.shippingAddress.email}
                  </span>
                </div>
                {[
                  order?.shippingAddress?.address,
                  order?.shippingAddress?.city,
                  order?.shippingAddress?.state,
                  order?.shippingAddress?.country,
                  order?.shippingAddress?.zipCode,
                ].join(` `)}
              </div>
            </div>
            <div className="text-sm">
              <span>note: </span>
              {order.shippingAddress.notes || "-"}
            </div>
          </div>
          <div className="py-3 border-b border-foreground/25">
            <div className="text-sm">
              <span>payment: </span>
              <span>{order.payment.method}</span>
            </div>
            <div className="text-sm">
              <span>isPaid: </span>
              <span>
                {order.payment.isPaid ? "YES" : "NO"}{" "}
                {order.payment.status ? ` - ${order.payment.status}` : ""}
              </span>
            </div>
            <div className="text-sm">
              <span>paidAt: </span>
              <span>
                {order.payment.paidAt
                  ? formatDate(new Date(order.payment.paidAt), true)
                  : "-"}
              </span>
            </div>
          </div>
          <div className="pt-3">
            <div className="text-sm flex justify-between items-center">
              <span>total price: </span>
              <span>{formatIDR(order.totalPrice)}</span>
            </div>
            <div className="text-sm flex justify-between items-center">
              <span>shipping price: </span>
              <span>{formatIDR(order.shipping.price)}</span>
            </div>
            <div className="text-sm flex justify-between items-center">
              <span>tax price: </span>
              <span>{formatIDR(order.taxPrice)}</span>
            </div>
            <div className="text-sm flex justify-between items-center">
              <span>total amount: </span>
              <span>{formatIDR(order.totalAmount)}</span>
            </div>
            {order.payment.isPaid ||
            order.status == "Cancelled" ||
            order.payment.status != null ? null : (
              <Button
                onClick={() => push(path + "/pay")}
                className={"mx-auto w-28 block my-4"}
              >
                Pay
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailOrderPage;

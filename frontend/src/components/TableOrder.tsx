"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import apiService from "@/lib/axios";
import type { Pagination } from "@/types";
import { Button } from "./ui/button";
import TableSkeleton from "./TableSkeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PaginationOrder from "./Pagination";
import { useToast } from "./ui/use-toast";
import AlertDialog from "./AlertDialog";
import { formatIDR, formatDate } from "@/utils";
import { ORDER_STATUS } from "@/constant";
import { OrderDetail } from "@/types/order";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
interface Data {
  orders: OrderDetail[];
  pagination: Pagination;
}
interface Props {
  setError: Dispatch<SetStateAction<string>>;
}
const TableOrders = ({ setError }: Props) => {
  const [orders, setOrders] = useState<OrderDetail[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const page = searchParams.get("page");
  const params = searchParams.toString();
  const { data, isLoading } = useSWR<Data>(
    `/orders?limit=10&page=${page || 1}`,
    fetcher
  );
  const handleDeleteOrder = async (id: string) => {
    try {
      const res = await apiService.delete(`/orders/${id}`);
      toast({
        title: "Delete order success",
        description: `order with id ${id} deleted.`,
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Delete order failed",
      });
      console.error(error);
    }
  };

  const variantBadge = (str: string) => {
    if (str == ORDER_STATUS.Pending) return "orange";
    if (str == ORDER_STATUS.Not_processed) return "orange";
    if (str == ORDER_STATUS.Cancelled) return "danger";
    return "success";
  };

  useEffect(() => {
    if (!page) replace(`${pathname}?page=${1}`);
    if (data) setOrders(data.orders as OrderDetail[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, data]);
  return (
    <>
      <Table>
        <TableCaption>
          {!isLoading ? (orders ? "List Order" : "no orders") : "Loading..."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">No</TableHead>
            <TableHead>id</TableHead>
            <TableHead>status</TableHead>
            <TableHead>Total price</TableHead>
            <TableHead className="">Tax price</TableHead>
            <TableHead className="">shipping price</TableHead>
            <TableHead className="">Total Amount</TableHead>
            <TableHead className="">isPaid</TableHead>
            <TableHead className="">Payment</TableHead>
            <TableHead className="">isDelivered</TableHead>
            <TableHead className="">DeliveredAt</TableHead>
            <TableHead className="">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading ? (
            orders?.map((order, idx) => (
              <TableRow key={idx}>
                <TableCell className="">{idx + 1}</TableCell>
                <TableCell className="text-sm max-w-[130px] truncate ">
                  {order._id}
                </TableCell>
                <TableCell className="text-sm">
                  <Badge variant={variantBadge(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {formatIDR(order.totalPrice)}
                </TableCell>
                <TableCell className="text-sm">
                  {formatIDR(order.taxPrice)}
                </TableCell>
                <TableCell className="text-sm">
                  {formatIDR(order.shipping.price)}
                </TableCell>
                <TableCell className="text-sm">
                  {formatIDR(order.totalAmount)}
                </TableCell>
                <TableCell className="text-sm">
                  <Badge variant={order.payment.isPaid ? "success" : "danger"}>
                    {String(order.payment.isPaid)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {order.payment.method}
                </TableCell>
                <TableCell className="text-sm">
                  <Badge variant={order.isDelivered ? "success" : "danger"}>
                    {String(order.isDelivered)}
                  </Badge>
                </TableCell>

                <TableCell className="text-sm w-[50px]">
                  {order.isDelivered
                    ? formatDate(new Date(order.deliveredAt))
                    : "-"}
                </TableCell>
                <TableCell className="flex gap-2 items-center">
                  <Button
                    size={"xs"}
                    variant={"default"}
                    onClick={() => push(`${pathname}/update/${order._id}`)}
                    disabled={order.status === ORDER_STATUS.Delivered}
                  >
                    Update
                  </Button>
                  <Button
                    size={"xs"}
                    variant={"outline"}
                    onClick={() => push(`${pathname}/detail/${order._id}`)}
                  >
                    Detail
                  </Button>
                  <Button
                    onClick={() => setOpen(!open)}
                    size={"xs"}
                    variant={"destructive"}
                  >
                    <AlertDialog
                      title={"Delete order"}
                      description={`apakah anda yakin ingin menghapus order.  id:${order._id}`}
                      open={open}
                      onContinue={() => {
                        handleDeleteOrder(order._id);
                        setOpen(!open);
                      }}
                      onCancel={() => setOpen(false)}
                    />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableSkeleton row={12} key={idx} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
      {data?.pagination ? (
        <PaginationOrder totalPages={data.pagination.totalPages} />
      ) : null}
    </>
  );
};

export default TableOrders;

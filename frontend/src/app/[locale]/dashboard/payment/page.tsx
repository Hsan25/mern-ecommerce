"use client";
import { fetcher } from "@/lib/fetcher";
import { Pagination, Pay } from "@/types";
import React, { useState } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/TableSkeleton";
import { formatDate } from "@/utils";
import { Button } from "@/components/ui/button";
import AlertDialog from "@/components/AlertDialog";
import apiService from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
const PaymentDashboardPage = () => {
  const [confirm, setConfirm] = useState<boolean>(false);
  const [reject, setReject] = useState<boolean>(false);
  const [id, setId] = useState<string>("");
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const { data, isLoading } = useSWR<{
    payments: Pay[];
    pagination: Pagination;
  }>(`/pay?page=${page}`, fetcher);

  const updateStatusPayment = async (
    id: string,
    status: "success" | "rejected"
  ) => {
    try {
      const res = await apiService.put(`/pay/${id}/${status}`);
      toast({ description: "success update status" });
    } catch (error) {
      console.log(error);
      toast({ description: "failed update status" });
    }
  };
  return (
    <>
      <>
        <AlertDialog
          title={"notif"}
          open={confirm}
          description={`apakah anda yakin ingin mengkonfirmasi pembayaran ini?`}
          onCancel={() => setConfirm(false)}
          onContinue={async () => {
            await updateStatusPayment(id, "success");
            setConfirm(false);
          }}
        />
        <AlertDialog
          title={"notif"}
          open={reject}
          description={`apakah anda yakin ingin menolak pembayaran ini?`}
          onCancel={() => setReject(false)}
          onContinue={async () => {
            await updateStatusPayment(id, "rejected");
            setReject(false);
          }}
        />
      </>
      <div className="flex text-sm">
        <span>note:</span>
        <div className="">
          Silahkan untuk melakukan konfirmasi terhadapa pembayaran yang ada.
          Harap konfirmasi secepatnya.
        </div>
      </div>
      <Table>
        <TableCaption>{!isLoading ? "List Order" : "Loading..."}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">No</TableHead>
            <TableHead>id</TableHead>
            <TableHead>user id</TableHead>
            <TableHead>order id</TableHead>
            <TableHead>status</TableHead>
            <TableHead className="">method</TableHead>
            <TableHead className="">created</TableHead>
            <TableHead className="">action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading
            ? data?.payments.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell className="">{idx + 1}</TableCell>
                  <TableCell className="">{p._id}</TableCell>
                  <TableCell className="">{p.user}</TableCell>
                  <TableCell className="">{p.orderId}</TableCell>
                  <TableCell className="">
                    <Badge
                      variant={
                        p.status == "success"
                          ? "success"
                          : p.status == "rejected"
                          ? "danger"
                          : "orange"
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="">{p.method}</TableCell>
                  <TableCell className="">
                    {formatDate(new Date(p.createdAt), true)}
                  </TableCell>
                  <TableCell className="flex gap-2 items-center">
                    <Button
                      onClick={() => {
                        setId(p._id);
                        setConfirm(true);
                      }}
                      size={"xs"}
                      disabled={p.status != "waiting confirmation"}
                      variant={"default"}
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => {
                        setId(p._id);
                        setReject(true);
                      }}
                      size={"xs"}
                      disabled={p.status != "waiting confirmation"}
                      variant={"destructive"}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            : Array.from({ length: 5 }).map((_, idx) => (
                <TableSkeleton row={8} key={idx} />
              ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PaymentDashboardPage;

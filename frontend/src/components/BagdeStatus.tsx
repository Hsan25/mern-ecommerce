import { StatusOrder } from "@/types";
import React, { HTMLAttributes } from "react";
import { Badge } from "./ui/badge";

type Variant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "orange"
  | "danger"
  | null
  | undefined;
const BadgeStatus = ({ status }: { status: StatusOrder }) => {
  const variant: { status: StatusOrder; variant: Variant }[] = [
    {
      status: "Cancelled",
      variant: "danger",
    },
    {
      status: "Delivered",
      variant: "success",
    },
    {
      status: "Pending",
      variant: "orange",
    },
    {
      status: "Not processed",
      variant: "danger",
    },
    {
      status: "Processing",
      variant: "orange",
    },
    {
      status: "Shipped",
      variant: "success",
    },
  ];
  return (
    <>
      {variant.map((v, idx) => {
        if (v.status == status)
          return (
            <Badge  key={idx} variant={v.variant} className="text-xs">
              {status}
            </Badge>
          );
      })}
    </>
  );
};

export default BadgeStatus;

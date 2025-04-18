import { Metadata } from "next";
import CheckOutPage from "./[id]/page";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "checkout",
};
const LayoutCheckout = ({ children }: { children: ReactNode }) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default LayoutCheckout;

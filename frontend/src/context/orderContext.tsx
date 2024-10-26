"use client";
import { createContext, ReactNode, useState, useContext } from "react";
import { PaymentMethod } from "@/types";
import { NewOrder } from "@/types/order";
import { Address } from "@/types/address";

interface OrderContextType {
  order: NewOrder | null;
  setAddress: (data: Address) => void;
  setShipping: (data: any) => void;
  setPayment: (data: PaymentMethod) => void;
  setOrderItem: (data: string[]) => void; // id
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const OrderContextProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<NewOrder | {}>({});
  const setShipping = (data: any) => {
    setOrder({ ...order, shipping: data });
  };
  const setAddress = (data: Address) => {
    setOrder({ ...order, address: data });
  };
  const setPayment = (data: PaymentMethod) => {
    setOrder({ ...order, payment: data });
  };
  function setOrderItem(data: string[]) {
    setOrder({ ...order, orderItems: data });
  }

  return (
    <OrderContext.Provider value={{ order, setAddress, setOrderItem, setPayment, setShipping }}>
      {children}
    </OrderContext.Provider>
  );
};

// export const useOrder = () => useContext(OrderContext);
// Custom hook to use the Order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderContextProvider");
  }
  return context;
};
export default OrderContextProvider;

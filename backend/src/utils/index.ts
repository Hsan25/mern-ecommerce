import { Types } from "mongoose";
import { Shipping } from "types";
import shipping from "../data/shipping-method.json";
import { PaymentMethod } from "types/payment";
import { StatusOrder } from "types/order";
export const calculateTaxPrice = (price: number): number => {
  const PPN_RATE = 0.11;
  return price * PPN_RATE;
};
// string
export const isValidPaymentMethod = (paymentMethod: PaymentMethod): boolean => {
  const validPaymentMethods: PaymentMethod[] = [
    "Cash On Delivery",
    "Bank Transfer",
    "Dana",
    "Go-Pay",
  ];
  if (!validPaymentMethods.includes(paymentMethod)) return false;
  return true;
};
export const isValidStatusOrder = (status: StatusOrder): boolean => {
  const validStatus: StatusOrder[] = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Not processed",
  ];
  if (!validStatus.includes(status)) return false;
  return true;
};
export const isValidShipping = (s: Shipping) => {
  for (const ship of shipping) {
    if (s.type != ship.type) return false;
  }
  return true;
};
export const ObjectId = (str: string): Types.ObjectId => {
  return new Types.ObjectId(str);
};

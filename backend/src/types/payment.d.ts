export type PaymentMethod =
  | "Cash On Delivery"
  | "Bank Transfer"
  | "Dana"
  | "Go-Pay";
export interface PaymentBody {
  orderId: Types.ObjectId;
  user: Types.ObjectId;
}
export interface OptionPayment {
  limit: number;
  page: number;
}

export interface OrderBody {
  orderItems: Types.ObjectId[];
  shippingAddress: AddressInterface;
  billingAddress?: string;
  shipping: {
    type: string;
    price: number;
  };
  payment: PaymentMethod;
}
export interface UpdateOrder {
  status?: StatusOrder;
  payment?: {
    isPaid?: boolean;
    status?: "success" | "waiting" | "failed";
  };
  isDelivered?: boolean;
}
export interface OptionOrder {
  limit: number;
  page: number;
  search?: string;
  filter?: {
    status: StatusOrder;
  };
}
export type StatusOrder =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Not processed";

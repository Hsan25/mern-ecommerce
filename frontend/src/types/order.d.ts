import { PaymentMethod, StatusOrder } from ".";
import { Address } from "./address";
import { Images } from "./product";

interface Shipping {
  type: string;
  price: number;
}
interface NewOrder {
  shipping?: Shipping;
  address?: Address;
  payment?: PaymentMethod;
  orderItems?: string[]; // cart item id...
}

interface ProductItemOrder {
  _id: string;
  name: string;
  price: number;
  images: Images[];
}

interface OrderItem {
  _id: string;
  isReviewed: boolean;
  product: ProductItemOrder;
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
  status: StatusOrder;
}

interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  status: StatusOrder;
  totalAmount: number;
  createdAt: Date;
}
export interface OrderDetail extends Order {
  taxPrice: number;
  shipping: Shipping;
  shippingAddress: Address;
  totalPrice: number;
  taxPrice: number;
  payment: {
    method: PaymentMethod;
    isPaid: boolean;
    status: "waiting confirmation" | "success" | "rejected" | null;
    paidAt: Date;
  };
  isDelivered: boolean;
  deliveredAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

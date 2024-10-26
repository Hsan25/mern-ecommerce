import { Product } from ".";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images: string;
    seller: {
      _id: string;
      username: string;
    };
  };
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
  status: string;
}

interface Cart {
  _id: string;
  items: CartItem[]
}

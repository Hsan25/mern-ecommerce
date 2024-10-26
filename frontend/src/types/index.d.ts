export interface User {
  username: string;
  email: string;
  _id: string;
  avatar: string | null;
  role: "ADMIN" | "USER";
  updatedAt?: Date;
  createdAt?: Date;
}

export interface Category {
  _id: string;
  name: string;
}

export interface TimeStamp {
  createdAt: Date;
  updatedAT: Date;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  ratings: number;
  sold_count: number;
  categories: Category[];
  reviews: Review[];
  seller: User;
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type StatusOrder =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Not processed";

export type PaymentMethod = "Cash On Delivery" | "Bank Transfer" | "Dana" | "Go-Pay";

export interface Pagination {
  totalPages: number;
  currentPage: number;
  sortBy?: {
    price: "ASC" | "DESC";
  };
}

export interface ApiResponse<data> {
  data: data;
  status: "error" | "success";
  statusCode: number;
  msg: string;
}

export interface Pay {
  method: PaymentMethod;
  status: "success" | "rejected" | "waiting";
  user: string;
  _id: string;
  orderId: string;
  createdAt: Date;
}

export interface ShippingMethod {
  type: string;
  price: number;
}

export interface PayloadJWT {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  role: "ADMIN" | "USER";
}

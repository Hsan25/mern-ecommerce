import signupSchema from "@/lib/zod/schemaSignup";
import { z } from "zod";

export interface User {
  username: string;
  email: string;
  _id: string;
  avatar: {
    id: string | null;
    url: string | null;
  };
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
  images: Images[];
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

export type PaymentMethod =
  | "Cash On Delivery"
  | "Bank Transfer"
  | "Dana"
  | "Go-Pay";

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
  status: "success" | "rejected" | "waiting confirmation";
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
  avatar: {
    id: string | null;
    url: string | null;
  };
  role: "ADMIN" | "USER";
}
// export interface Signup {
//   username: string;
//   email: string;
//   password: string;
//   role?: "ADMIN" | "USER";
// }

export type Signup = z.infer<typeof signupSchema>;

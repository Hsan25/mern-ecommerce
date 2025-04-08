import { Types } from "mongoose";
import { Role } from "../constants";

declare global {
  namespace Express {
    export interface Request {
      fileValidationError?: string;
      user?: {
        _id: Types.ObjectId;
        username: string;
        email: string;
        avatar: {
          url: string | null;
          id: string | null;
        };
        role?: Role.USER | Role.ADMIN;
      };
    }
  }
}

export type ProductType = {
  name: string;
  quantity: number;
  description: string;
  price: number;
  category: number;
  photo: string;
  authorId: string;
  // created_at: Date,
  // updated_at: Date
};

export type UserType = {
  username: string;
  email: string;
  // password: string,
  // description: string,
  avatar: {
    id: string | null;
    url: string | null;
  };
  // firstName: string,
  // lastname: string,
  role: "USER" | "ADMIN";
};

export interface Shipping {
  type: string;
  price: number;
}

export type StatusPayment = "success" | "rejected" | "waiting confirmation";

export interface CloudinaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: Date;
  tags: any[];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  api_key: string;
}

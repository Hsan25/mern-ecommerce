import { Types } from 'mongoose';
import { Role } from '../constants';

declare global {
  namespace Express {
    export interface Request {
      fileValidationError?: string;
      user?: {
        id: Types.ObjectId;
        username: string;
        email: string;
        avatar?: string;
        role: Role.USER | Role.ADMIN;
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
  avatar: string;
  // firstName: string,
  // lastname: string,
  role: 'USER' | 'ADMIN';
};

export interface Shipping {
  type: string;
  price: number;
}

export type StatusPayment = 'success' | 'rejected' | 'waiting confirmation';

import mongoose, { Schema, Types } from "mongoose";
const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    isReviewed: { type: Boolean, default: false },
    quantity: { type: Number, default: 1 },
    purchasePrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
//
export const CartItem = mongoose.model("CartItems", CartItemSchema);
const CartSchema = new Schema(
  {
    items: { type: [Types.ObjectId], ref: "CartItems", default: [] },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
CartSchema.index({ user: 1 });
export const Cart = mongoose.model("Cart", CartSchema);

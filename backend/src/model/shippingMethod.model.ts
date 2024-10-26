import mongoose from "mongoose";
const SchemaShippingMethod = new mongoose.Schema(
  {
    type: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model("Shipping_Method", SchemaShippingMethod);

import mongoose, { Types } from "mongoose";
const SchemaProduct = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    stock: {
      type: Number,
      required: true,
      default: 1,
      maxLengt: 5,
    },
    description: String,
    price: {
      type: Number,
      required: [true, "Please Enter product Price"],
      maxLength: [8, "Price cannot exceed 8 characters"],
    },
    categories: {
      type: [Types.ObjectId],
      ref: "Categories",
    },
    ratings: {
      type: Number,
      default: 0,
      maxLength: 1,
    },
    images: [
      {
        _id: false,
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    seller: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: Types.ObjectId,
        ref: "Reviews",
        default: null,
      },
    ],
    sold_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

SchemaProduct.index({ name: 1, price: 1, categories: 1 });
// on delete


export default mongoose.model("Product", SchemaProduct);

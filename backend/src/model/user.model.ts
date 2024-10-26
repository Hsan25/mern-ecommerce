import { removeImage } from "@utils/removeFile";
import { Role } from "../constants";
import mongoose from "mongoose";
import { Cart, CartItem } from "./cart.model";
import reviewModel from "./review.model";
import productModel from "./product.model";
import addressModel from "./address.model";
const SchemaUser = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: null },
    role: { type: String, default: Role.USER, enum: [Role.USER, Role.ADMIN] },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    }
  },
  { timestamps: true },
);

SchemaUser.index({ username: 1, email: -1 });
// on register
SchemaUser.post("save", async (doc) => {
  const newCart = new Cart({ user: doc._id });
  await newCart.save();
});
// on delete
SchemaUser.post("findOneAndDelete", async (doc) => {
  if (doc) {
    // delete avatar
    if (doc.avatar) {
      await removeImage(doc.avatar.split("/").pop());
    }
    // delete carts
    const cart = await Cart.findOneAndDelete({ user: doc._id });
    if (cart?.items) {
      for (const item of cart.items) {
        await CartItem.deleteOne({ _id: item });
      }
    }
    // delete reviews
    const reviews = await reviewModel.exists({ user: doc._id });
    if (reviews) {
      await reviewModel.deleteMany({ user: doc._id });
    }
    // delete product  [admin or seller]
    if (doc.role != Role.USER) {
      const products = await productModel.countDocuments({ user: doc._id });
      if (products > 0) {
        await productModel.deleteMany({ user: doc._id });
      }
    }
    // delete address
    const address = await addressModel.exists({ user: doc._id });
    if (address) {
      await addressModel.deleteMany({ user: doc._id });
    }
  }
});
// on update
SchemaUser.pre("updateOne", async function (next) {
  const update: any = this.getUpdate();
  if (update.avatar) {
    const docToUpdate = await this.model.findOne(this.getQuery()).exec();
    const filename = docToUpdate.avatar
      ? docToUpdate.avatar.split("/").pop()
      : null;
    filename ? await removeImage(filename) : next();
  }
  // await removeImage(update.avatar.split('/')[4]);
  next();
});
export default mongoose.model("User", SchemaUser);

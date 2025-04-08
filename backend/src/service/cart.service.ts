import { Cart, CartItem } from "@model/cart.model";
import { Types } from "mongoose";
import productModel from "@model/product.model";
import { StatusOrder } from "types/order";

export const addItemCart = async (
  user: Types.ObjectId,
  productId: Types.ObjectId,
) => {
  try {
    let cart = await Cart.findOne({ user }, "items");
    if (!cart) {
      // If the cart does not exist, create a new one
      cart = new Cart({
        user,
        items: [],
      });
      await cart.save();
    }
    const product = await productModel.findById(productId, "price stock");
    if (!product) throw new Error("Product not found");

    const cartProduct = await CartItem.findOne({
      product: productId,
      _id: { $in: cart.items },
    });
    if (cartProduct) {
      if (cartProduct.quantity >= (product.stock as number)) {
        throw new Error("item sudah mencapai batas maksimal");
      }
      return await CartItem.updateOne(
        { _id: cartProduct._id },
        {
          quantity: cartProduct.quantity + 1,
          totalPrice: cartProduct.purchasePrice * (cartProduct.quantity + 1),
          updatedAt: new Date(),
        },
      );
    }

    const cartItem = new CartItem({
      product: productId,
      purchasePrice: Number(product.price),
      totalPrice: product.price,
    });
    // saving cart
    await cartItem.save();
    const doc = await Cart.updateOne(
      { user },
      { $push: { items: cartItem._id }, $set: { updatedAt: Date.now() } },
      { new: true },
    );
    if (!doc) throw new Error("cart not found");
    return doc;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed add Itemcart");
  }
};
export const updateItemCart = async (
  itemCartId: Types.ObjectId,
  body: { quantity: number; status?: StatusOrder },
) => {
  if (!body.quantity) throw new Error("quantity required");
  try {
    const cartExist = await CartItem.findById(itemCartId);
    if (!cartExist) throw new Error("CartItem not found");
    const product = (await productModel.findById(
      cartExist.product,
      "stock",
    )) as { stock: number };
    if (body.quantity > product.stock)
      throw new Error("Quantity melebihi stock product");
    const totalPrice = body.quantity * cartExist.purchasePrice;
    const cart = await CartItem.updateOne(
      { _id: itemCartId },
      { ...body, totalPrice },
    );
    if (cart.modifiedCount == 0) throw new Error("cart item not found");
    return cart.modifiedCount;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed update cart item");
  }
};
export const getCarts = async () => {
  try {
    const carts = await Cart.find()
      .select("-__v -items")
      .populate("user", "-__v -password -createdAt -updatedAt -email");

    return carts;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed fetch carts");
  }
};
export const getCartByUserId = async (id: Types.ObjectId) => {
  try {
    const docs = await Cart.findOne({ user: id })
      .select("-__v -user -updatedAt -createdAt")
      .populate({
        path: "items",
        populate: [
          {
            path: "product",
            select: "price images name seller stock",
            populate: [
              {
                path: "seller",
                select: "username",
              },
            ],
          },
        ],
        select: "-__v -user -updatedAt -createdAt",
      });
    if (!docs) throw new Error("user not found");
    return docs;
  } catch (error) {
    console.error(error);
    throw new Error("user not found");
  }
};
export const getCartById = async (id: Types.ObjectId) => {
  try {
    const docs = await Cart.findOne({ _id: id })
      .select("-__v -user -updatedAt -createdAt")
      .populate({
        path: "items",
        populate: [
          {
            path: "product",
            select: "price images name seller stock",
            populate: [
              {
                path: "seller",
                select: "username",
              },
            ],
          },
        ],
        select: "-__v -user -updatedAt -createdAt",
      });
    if (!docs) throw new Error("user not found");
    return docs;
  } catch (error) {
    console.error(error);
    throw new Error("user not found");
  }
};
export const deleteItemCart = async (
  userId: Types.ObjectId,
  itemId: Types.ObjectId,
) => {
  try {
    await CartItem.deleteOne({ _id: itemId });
    const cart = await Cart.updateOne(
      { user: userId },
      { $pull: { items: itemId }, $set: { updatedAt: Date.now() } },
    );
    if (!cart) throw new Error("cart item not found");
    return cart.modifiedCount;
  } catch (error: any) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("cart item not found");
  }
};

import { Cart, CartItem } from "@model/cart.model";
import Order from "@model/order.model";
import User from "@model/user.model";
import { OrderStatus } from "../constants";
import mongoose, { Types } from "mongoose";
import {
  calculateTaxPrice,
  isValidPaymentMethod,
  isValidShipping,
} from "@utils/index";
import Product from "@model/product.model";
import { OptionOrder, OrderBody, UpdateOrder } from "types/order";
export const createNewOrder = async (user: Types.ObjectId, body: OrderBody) => {
  //
  try {
    // verify user
    const userExist = await User.exists({ _id: user });
    if (!userExist) throw new Error("user not found");
    // cart
    // barang
    let totalPrice = 0;
    for (const id of body.orderItems) {
      let cart = await CartItem.findById(id, "totalPrice product quantity");
      if (!cart) throw new Error("Cart not found");
      await Product.updateOne(
        { _id: cart.product },
        { $inc: { stock: -cart.quantity, sold_count: cart.quantity } },
      );
      totalPrice += cart?.totalPrice || 0;
    }
    // validate payment
    if (!isValidPaymentMethod(body.payment)) {
      throw new Error("Invalid Payment Method");
    }

    // validate shipping
    if (isValidShipping(body.shipping)) {
      throw new Error("Invalid Shipping");
    }

    const taxPrice = calculateTaxPrice(totalPrice);
    const totalAmount = totalPrice + taxPrice + body.shipping.price;
    const newOrder = new Order({
      user,
      orderItems: body.orderItems,
      payment: {
        method: body.payment,
      },
      shipping: body.shipping,
      shippingAddress: body.shippingAddress,
      taxPrice,
      totalAmount,
      totalPrice,
    });
    const doc = await newOrder.save();
    await Cart.updateOne({ user }, { items: [] });
    return doc;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed create Order");
  }
};
export const updateOrder = async (
  orderId: Types.ObjectId,
  update: UpdateOrder,
) => {
  try {
    // verify order id
    const orderExist = await Order.findById({ _id: orderId }, "status");
    if (!orderExist) throw new Error("Order not found");
    if (orderExist.status == "Delivered" || orderExist.status == "Cancelled") {
      throw new Error(
        "Sorry, you cannot change this order data which has Delivered or been cancelled",
      );
    }
    let doc: any;
    if (update.payment) {
      if (update.payment.isPaid) {
        doc = await Order.updateOne(
          { _id: orderId },
          {
            status: OrderStatus.Processing,
            payment: {
              isPaid: true,
              status: "success",
              paidAt: Date.now(),
            },
            updatedAt: Date.now(),
          },
        );
      }
      doc = await Order.updateOne(
        { _id: orderId },
        {
          payment: {
            status: "waiting",
          },
          updatedAt: Date.now(),
        },
      );
    }
    if (update.status === "Delivered") {
      doc = await Order.updateOne(
        { _id: orderId },
        {
          status: OrderStatus.Delivered,
          isDelivered: true,
          deliveredAt: Date.now(),
          updatedAt: Date.now(),
        },
      );
      // await Product.updateOne({_id:doc.})
      return doc;
    }
    doc = await Order.updateOne(
      { _id: orderId },
      { status: update.status, updatedAt: Date.now() },
    );

    return doc;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed Update Order");
  }
};
export const getOrders = async (option: OptionOrder) => {
  const { limit, page, search } = option;
  const skip = (page - 1) * limit;
  try {
    if (search && !mongoose.isValidObjectId(search)) {
      throw new Error("Invalid id");
    }
    const searchCondition = search
      ? {
          _id: new Types.ObjectId(search),
        }
      : {};

    const docs = await Order.find(searchCondition)
      .select("-__v")
      .populate({
        path: "orderItems",
        select: "-__v -createdAt -updatedAt",
        populate: {
          path: "product",
          select: "name images price",
        },
      })
      .skip(skip)
      .limit(limit);
    const total = await Order.countDocuments(searchCondition);
    const pages = Math.ceil(total / limit);
    return {
      orders: docs,
      totalPage: pages,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
export const getOrderByUser = async (
  option: OptionOrder,
  user: Types.ObjectId,
) => {
  const { limit, page, filter, search } = option;
  const skip = (page - 1) * limit;
  try {
    if (user && !mongoose.isValidObjectId(user)) {
      throw new Error("Invalid id");
    }
    const searchCondition = search
      ? {
          // _id: new Types.ObjectId(search),
          user,
        }
      : { user };

    const f = filter?.status
      ? { ...searchCondition, ...filter }
      : { ...searchCondition };
    const docs = await Order.find(f)
      .select("user totalAmount orderItems status createdAt")
      .populate({
        path: "orderItems",
        select: "-__v -createdAt -updatedAt",
        populate: {
          path: "product",
          select: "_id name images price isReviewed",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Order.countDocuments(searchCondition);
    const pages = Math.ceil(total / limit);
    return {
      orders: docs,
      totalPage: pages,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
};
export const getOrderById = async (id: Types.ObjectId) => {
  try {
    const doc = await Order.findById(id)
      .select("-__v")
      .populate({
        path: "orderItems",
        select: "-__v -createdAt -updatedAt",
        populate: {
          path: "product",
          select: "_id name images price isReviewed",
        },
      });

    return doc;
  } catch (error) {
    console.log(error);
    throw new Error("Failed Fetch Order");
  }
};

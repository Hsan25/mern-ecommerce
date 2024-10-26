import Order from "@model/order.model";
import Payment from "@model/payment.model";
import { Types } from "mongoose";
import { StatusPayment } from "types";
import { OptionPayment, PaymentBody } from "types/payment";
export const createPayment = async (body: PaymentBody) => {
  try {
    const order = await Order.findOne({ _id: body.orderId }, "payment");
    if (!order) throw new Error("order not found");
    const newPayment = new Payment({
      ...body,
      status: "waiting confirmation",
      method: order?.payment?.method,
    });
    await Order.updateOne(
      { _id: order._id },
      { $set: { "payment.status": "waiting confirmation" } },
    );
    newPayment.save();
  } catch (error) {
    console.log(error)
    throw new Error("Create payment failed");
  }
};
export const updateStatusPayment = async (
  id: Types.ObjectId,
  status: StatusPayment,
) => {
  try {
    const payment = await Payment.findOneAndUpdate({ _id: id }, { status });
    if (!payment) throw new Error("payment not found");
    if (status == "success") {
      await Order.updateOne(
        { _id: payment.orderId },
        {
          $set: {
            "payment.status": status,
            "payment.isPaid": true,
            "payment.paidAt": Date.now(),
          },
          status: "Processing",
        },
      );
    }
    await Order.updateOne(
      { _id: payment.orderId },
      { $set: { "payment.status": status } },
    );
    return payment._id;
  } catch (error) {
    console.log(error)
    throw new Error(
      error instanceof Error ? error.message : "failed update status payment",
    );
  }
};
export const getAllPayment = async (option: OptionPayment) => {
  try {
    const { limit, page } = option;
    const skip = (page - 1) * limit;
    const docs = await Payment.find().skip(skip).limit(limit);
    const totalDoc = await Payment.countDocuments();
    const totalPage = Math.ceil(totalDoc / limit);
    return {
      docs,
      totalPage,
    };
  } catch (error) {
    console.log(error)
    throw new Error(
      error instanceof Error ? error.message : "Failed fetch paymens",
    );
  }
};

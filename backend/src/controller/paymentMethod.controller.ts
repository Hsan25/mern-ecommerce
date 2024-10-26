import { Request, Response } from "express";
import paymentMethod from "../data/payment-method.json";
import response from "@utils/response";
const PaymentMethodController = {
  getPaymentMethod: (req: Request, res: Response) => {
    return response(res, 200, "success fetch payment method", {
      paymentMethod,
    });
  },
};

export default PaymentMethodController;

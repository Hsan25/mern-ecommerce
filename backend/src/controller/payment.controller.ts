import {
  createPayment,
  getAllPayment,
  updateStatusPayment,
} from "@service/payment.service";
import { ObjectId } from "@utils/index";
import response from "@utils/response";
import { Request, Response } from "express";
import { StatusPayment } from "types";
import { PaymentBody } from "types/payment";

const PaymentController = {
  createPayment: async (req: Request, res: Response) => {
    try {
      const body: PaymentBody = req.body;
      const user = req.user;
      const { orderId } = req.params;
      if (!user) return response(res, 400, "auth required");
       await createPayment({
        user: user.id,
        orderId: ObjectId(orderId),
      
      });
      response(res, 201, "success request confirmation");
    } catch (error) {
      response(res, 400, "failed request confirmation");
    }
  },
  updateStatusPayment: async (req: Request, res: Response) => {
    try {
      const user = req.user;
      const { paymentId, status } = req.params;
      if (!user) return response(res, 400, "auth required");
      await updateStatusPayment(
        ObjectId(paymentId),
        status as StatusPayment,
      );
      response(res, 200, "success update status");
    } catch (error) {
      response(res, 400, "failed update status");
    }
  },
  getAllPayment: async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query;
      const LIMIT = Number(limit) || 5;
      if (!page || !LIMIT) return response(res, 400, "page or limit required");
      if (Number(LIMIT) > 10) return response(res, 400, "max limit 10");
      const { docs, totalPage } = await getAllPayment({
        page: Number(page),
        limit: Number(LIMIT),
      });
      response(res, 200, "success fetch", {
        payments: docs,
        pagination: {
          currentPage: Number(page),
          totalPage,
        },
      });
    } catch (error: any) {
      response(res, 400, error.message);
    }
  },
};

export default PaymentController;

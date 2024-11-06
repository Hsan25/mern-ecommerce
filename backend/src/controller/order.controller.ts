import {
  createNewOrder,
  getOrderById,
  getOrderByUser,
  getOrders,
  updateOrder,
} from "@service/order.service";
import { isValidStatusOrder } from "@utils/index";
import response from "@utils/response";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { OrderBody, StatusOrder, UpdateOrder } from "types/order";
import { z } from "zod";

const OrderController = {
  createNewOrder: async (req: Request, res: Response) => {
    try {
      const body: OrderBody = req.body;
      const user = req.user;
      if (!user) return response(res, 401);
      const newOrder = await createNewOrder(user.id, {
        ...body,
        shippingAddress: {
          ...body.shippingAddress,
          user: user.id,
        },
      });
      response(res, 201, "Success create new order", {
        id: newOrder._id,
      });
    } catch (error: any) {
      console.log(error)
      if (error instanceof Error) {
        return response(res, 400, error.message);
      }
      response(res, 400, "ERROR");
    }
  },
  updateOrder: async (req: Request, res: Response) => {
    const schemaUpdateOrder = z
      .object({
        status: z.string().optional(),
        isPaid: z.boolean().optional(),
        isDelivered: z.boolean().optional(),
      })
      .refine(
        (data) => {
          return (
            data.status !== undefined ||
            data.isPaid !== undefined ||
            data.isDelivered !== undefined
          );
        },
        {
          message: "The field cannot be empty",
        },
      );
    try {
      const { orderId } = req.params;
      const body: UpdateOrder = req.body;
      if (!body) return response(res, 400, "The field cannot be empty");
      const safe = schemaUpdateOrder.parse(body);
      if (body.status) {
        if (!isValidStatusOrder(body.status))
          return response(res, 400, "Invalid Status Format");
      }
      const order = await updateOrder(new Types.ObjectId(orderId), { ...body });
      response(res, 200, "Success update order");
    } catch (error: any) {
      console.log(error)
      if (error instanceof z.ZodError) {
        response(
          res,
          400,
          error.issues[0].path[0] + ": " + error.issues[0].message,
        );
        return;
      }
      response(res, 400, error.message);
    }
  },
  getOrders: async (req: Request, res: Response) => {
    const { page, limit, search } = req.query;
    const LIMIT = Number(limit) || 10;
    if (!page) return response(res, 400, "Params page required");
    try {
      const { orders, totalPage } = await getOrders({
        limit: LIMIT,
        page: Number(page),
        search: String(search || ""),
      });
      response(res, 200, "success fetch orders", {
        orders,
        pagination: {
          totalPages: totalPage,
          currentPage: Number(page),
        },
      });
    } catch (error: any) {
      console.log(error)
      response(res, 400, error.message || "failed fetch orders", null);
    }
  },
  getOrderByUser: async (req: Request, res: Response) => {
    const { page, limit, search, status } = req.query;
    const { user } = req.params;
    const LIMIT = Number(limit) || 10;
    if (!user) return response(res, 400, "user id required");
    if (!page) return response(res, 400, "Params page required");
    try {
      const { orders, totalPage } = await getOrderByUser(
        {
          limit: LIMIT,
          page: Number(page),
          search: String(search || ""),
          filter: {
            status: status as StatusOrder,
          },
        },
        new Types.ObjectId(user),
      );
      response(res, 200, "success fetch orders", {
        orders,
        pagination: {
          totalPages: totalPage,
          currentPage: Number(page),
        },
      });
    } catch (error: any) {
      console.log(error)
      response(res, 400, error.message || "failed fetch orders", null);
    }
  },
  getOrderById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const order = await getOrderById(new Types.ObjectId(id));
      response(res, 200, "success fetch order", { order });
    } catch (error) {
      console.log(error)
      response(res, 400, "failed fetch order", null);
    }
  },
};
export default OrderController;

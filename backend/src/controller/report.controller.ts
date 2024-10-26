import Order from "@model/order.model";
import Product from "@model/product.model";
import User from "@model/user.model";
import response from "@utils/response";
import { Request, Response } from "express";
const ReportController = {
  getReportEcommerce: async (req: Request, res: Response) => {
    try {
      const totalAdmin = await User.countDocuments({ role: "ADMIN" });
      const totalUser = await User.countDocuments({ role: "USER" });
      const totalProduct = await Product.countDocuments();
      const countOrderPending = await Order.countDocuments({
        status: "Pending",
      });
      const countOrderProcessing = await Order.countDocuments({
        status: "Processing",
      });
      const totalOrder = await Order.countDocuments();

      return response(res, 200, "success fetch report ecommerce", {
        user: {
          admin: totalAdmin,
          user: totalUser,
        },
        totalProduct: totalProduct,
        order: {
          pending: countOrderPending,
          processing: countOrderProcessing,
          total: totalOrder,
        },
      });
    } catch (error) {
      console.error(error);
      return res.sendStatus(400);
    }
  },
};

export default ReportController;

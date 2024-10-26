import express from "express";
const router = express.Router();
import ProductRouter from "./product.route";
import UserRouter from "./user.route";
import AuthRouter from "./auth.route";
import categoriesRouter from "./categories.route";
import CartRouter from "./cart.route";
import AddressRouter from "./address.route";
import OrderRouter from "./order.route";
import PaymentRouter from "./payment.route";
import ShippingMethodRouter from "./shippingMethod.route";
import PaymentMethodRouter from "./paymentMethod.route";
import { verifyAdmin } from "middlewares/verifyAdmin";
import ReportController from "@controller/report.controller";
// product route
router.use("/products", ProductRouter);
//user route
router.use("/users", UserRouter);
// auth
router.use("/auth", AuthRouter);
//categories
router.use("/categories", categoriesRouter);
// cart
router.use("/carts", CartRouter);
// address
router.use("/address", AddressRouter);
// order
router.use("/orders", OrderRouter);
//pay
router.use("/pay", PaymentRouter);
//shipping method
router.use("/shipping-method", ShippingMethodRouter);
//payment-method
router.use("/payment-method", PaymentMethodRouter);
//report
router.get(
  "/report-ecommerce",
  verifyAdmin,
  ReportController.getReportEcommerce,
);

// docs api
router.get("/docs", (req, res) => {
  return res.json({
    title: "API DOCS",
    message:
      "for other endpoints, please look in the routes folder in the backend.",
    endpoint: {
      "/api/products": {
        status: "success | error",
        message: "string",
        data: {
          products: "array of object",
          pagination: { totalPage: "number", currentPage: "number" },
        },
      },
    },
  });
});
export default router;

import PaymentController from "@controller/payment.controller";
import express from "express";
import { verifyAdmin } from "@midlewares/verifyAdmin";
import { verifyUser } from "@midlewares/verifyUser";
const router = express.Router();

router.get("/", verifyAdmin, PaymentController.getAllPayment);
router.post("/:orderId", verifyUser, PaymentController.createPayment);
router.put(
  "/:paymentId/:status",
  verifyAdmin,
  PaymentController.updateStatusPayment,
);
export default router;

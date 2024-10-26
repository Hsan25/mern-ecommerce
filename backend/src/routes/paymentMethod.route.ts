import PaymentMethodController from "@controller/paymentMethod.controller";
import express from "express";
const router = express.Router();

router.get("/", PaymentMethodController.getPaymentMethod);

export default router;

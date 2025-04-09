import OrderController from "@controller/order.controller";
import express from "express";
import { verifyAdmin } from "@midlewares/verifyAdmin";
import { verifyUser } from "@midlewares/verifyUser";
const router = express.Router();
// admin
router.get("/", verifyAdmin, OrderController.getOrders);

router.get("/:id", verifyUser, OrderController.getOrderById);
router.get("/user/:user", verifyUser, OrderController.getOrderByUser);
router.post("/", verifyUser, OrderController.createNewOrder);
router.put("/:orderId", verifyUser, OrderController.updateOrder);
export default router;

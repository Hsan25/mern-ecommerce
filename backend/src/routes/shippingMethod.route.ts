import shippingMethodController from "@controller/shippingMethod.controller";
import express from "express";
import { verifyAdmin } from "middlewares/verifyAdmin";
const router = express.Router();

router.get("/", shippingMethodController.getShippingMethods);
router.get("/:id", shippingMethodController.getShippingMethodById);
router.put("/:id", verifyAdmin, shippingMethodController.updateShippingMethod);
router.delete(
  "/:id",
  verifyAdmin,
  shippingMethodController.deleteShippingMethod,
);
router.post("/", verifyAdmin, shippingMethodController.createNewShippingMethod);
export default router;

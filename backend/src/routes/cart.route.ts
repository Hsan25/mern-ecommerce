import CartController from "@controller/cart.controller";
import express from "express";
import { verifyAdmin } from "@midlewares/verifyAdmin";
import { verifyUser } from "@midlewares/verifyUser";
const router = express.Router();

// all the list cart user
router.get("/", verifyAdmin, CartController.getAllCart);
//
router.post("/:userId/add_item", verifyUser, CartController.addItemCart);
router.get("/:id", verifyUser, CartController.getCartByUserId);
router.get("/:id/:user", verifyUser, CartController.getCartById);
router.delete("/:item_cart_id", verifyUser, CartController.deleteItemCart);
router.put("/:item_cart_id", verifyUser, CartController.updateItemCart);

export default router;

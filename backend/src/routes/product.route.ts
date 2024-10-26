import { upload } from "lib/multer";
import productController from "@controller/product.controller";
import ReviewController from "@controller/review.controller";
import express from "express";
import { verifyAdmin } from "middlewares/verifyAdmin";
import { verifyUser } from "middlewares/verifyUser";
const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.get("/category/:category", productController.getProductsByCategory);
// only admin or seller
router.put("/:id", verifyAdmin, productController.updateProduct);
router.post("/", verifyAdmin, productController.createProduct);
router.delete("/:id", verifyAdmin, productController.deleteProduct);
// review
router.post("/:id/reviews", verifyUser, ReviewController.addReview);
router.get("/:id/reviews", ReviewController.getReviewsByProduct);
router.delete("/:id/reviews/:review_id", ReviewController.deleteReview);
export default router;

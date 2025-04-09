import categoryController from "@controller/category.controller";

import express from "express";
import { verifyAdmin } from "@midlewares/verifyAdmin";
const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
router.post("/", verifyAdmin, categoryController.createCategory);
export default router;

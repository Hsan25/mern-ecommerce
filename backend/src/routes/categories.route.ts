import categoryController from "@controller/category.controller";

import express from "express";
import { verifyAdmin } from "middlewares/verifyAdmin";
const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.delete("/:id", categoryController.deleteCategory);
router.post("/", verifyAdmin, categoryController.createCategory);
export default router;
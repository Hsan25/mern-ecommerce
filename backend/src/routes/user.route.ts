import UserController from "@controller/user.controller";
import express from "express";
import { verifyAdmin } from "@midlewares/verifyAdmin";
import { verifyUser } from "@midlewares/verifyUser";
import { upload } from "../lib/multer";
const router = express.Router();

router.get("/:id", verifyUser, UserController.getUserById);
// admin route
router.get("/", verifyAdmin, UserController.getUsers);
// auth required
router.delete("/:id", verifyUser, UserController.deleteUserById);
router.put(
  "/:id",
  verifyUser,
  upload.single("avatar"),
  UserController.updateUserById,
);

export default router;

import UserController from "@controller/user.controller";
import express from "express";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { verifyUser } from "middlewares/verifyUser";
const router = express.Router();

router.post("/register", UserController.register);
router.get("/:id", verifyUser, UserController.getUserById);
// admin route
router.get("/", verifyAdmin, UserController.getUsers);
// auth required
router.delete("/:id", verifyUser, UserController.deleteUserById);
router.put("/:id", verifyUser, UserController.updateUserById);

export default router;

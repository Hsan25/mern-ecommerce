import AuthController from "@controller/auth.controller";
import express from "express";
import { verifyUser } from "middlewares/verifyUser";
const router = express.Router();
router.post("/login", AuthController.Login);
router.delete("/logout", verifyUser, AuthController.LogOut);
router.get("/token", AuthController.refreshToken);
export default router;

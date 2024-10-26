import User from "@model/user.model";
import response from "@utils/response";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { z } from "zod";
import { getProfileUser } from "@service/user.service";
import { Types } from "mongoose";
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(60),
});

const AuthController = {
  Login: async (req: Request, res: Response) => {
    const { email, password }: Partial<{ email: string; password: string }> =
      req.body;
    try {
      const parse = LoginSchema.parse({ email, password });
      const user = await User.findOne({ email: parse.email });
      if (!user) throw new Error("Incorrect email or password");
      const isValidPassword = await bcrypt.compare(
        parse.password,
        user.password,
      );
      if (!isValidPassword) throw new Error("Incorrect email or password");
      const day = 24 * 60 * 60 * 1000;
      const accessToken = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET || "",
        {
          expiresIn: "15m",
        },
      );
      const refreshToken = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET || "",
        {
          expiresIn: "30d",
        },
      );
      // add refresh token to database
      await User.updateOne(
        { _id: user._id },
        {
          refreshToken,
        },
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        path: "/",
        maxAge: 15 * 60 * 1000, // 15 minute
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        path: "/",
        maxAge: 30 * day,
      });

      return response(res, 200, "", {
        username: user.username,
        email: user.email,
        token: accessToken,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        response(
          res,
          400,
          error.issues[0].path[0] + ": " + error.issues[0].message,
        );
        return;
      }
      console.log(error);
      response(res, 400, error.message);
    }
  },
  LogOut: async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    await User.updateOne({ _id: req.user.id }, { refreshToken: null });
    return response(res, 200, "success logout", {
      redirectUrl: "/",
    });
    // res.sendStatus(200).end();
  },
  refreshToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    try {
      if (!refreshToken) return res.sendStatus(401);
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || "",
      );
      const user = await User.findOne(
        { refreshToken },
        "username email avatar role",
      );
      if (!user) return res.sendStatus(401);
      const accessToken = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET || "",
        {
          expiresIn: "15m",
        },
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        path: "/",
        maxAge: 15 * 60 * 1000, // 15 minute
      });
      return res.status(200).json({
        token: accessToken,
      });
    } catch (error) {
      console.log(error)
      if (error instanceof JsonWebTokenError) {
        if (req.user)
          await User.updateOne({ _id: req.user.id }, { refreshToken: null });
        return res.sendStatus(401);
      }
      return res.sendStatus(401);
    }
  },
  userProfile: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await getProfileUser(new Types.ObjectId(id));
      response(res, 200, "Success get profile", { user });
    } catch (error) {
      console.log("error: " + error);
      response(res, 404, `user with id: ${id}.  NOT FOUND`);
    }
  },
};

export default AuthController;

import User from "@model/user.model";
import response from "@utils/response";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { z } from "zod";
import { getUserById, register } from "@service/user.service";
import { UserBody } from "types/user";
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(60),
});

const AuthController = {
  signup: async (req: Request, res: Response) => {
    const schema = z.object({
      username: z.string().min(5).max(15),
      password: z.string().min(6).max(20),
      email: z.string().email(),
      role: z.enum(["USER", "ADMIN"]).optional(), //for admin only
    });
    try {
      const body: UserBody & { role: "ADMIN" | "USER" } = req.body;
      const token = req.headers["authorization"]?.split(" ")[1] || "";
      if (token && body.role) {
        const decoded = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET || "",
        ) as { _id: any };
        const user = await getUserById(decoded._id);
        if (user.role === "ADMIN") {
          const parse = schema.parse(body);
          const doc = await register({ ...parse });
          response(res, 201, "register success", {
            id: doc._id,
          });
          return;
        }
      }

      if (body.role) {
        return res.sendStatus(403);
      }
      const parse = schema.parse(body);
      const doc = await register({ ...parse });
      response(res, 201, "register success", {
        id: doc._id,
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
      console.error(error);
      response(res, 400, error.message);
    }
  },
  login: async (req: Request, res: Response) => {
    const { email, password }: Partial<{ email: string; password: string }> =
      req.body;
    try {
      const parse = LoginSchema.parse({ email, password });
      const user = await User.findOne(
        { email: parse.email, provider: "credentials" },
        "username email avatar password",
      );
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
        },
        process.env.ACCESS_TOKEN_SECRET || "",
        {
          expiresIn: "5m",
        },
      );
      const refreshToken = jwt.sign(
        {
          _id: user._id,
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
        maxAge: 5 * 60 * 1000, // 5 minute
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        partitioned: process.env.NODE_ENV == "production",

        // domain:
        //   process.env.NODE_ENV === "production"
        //     ? process.env.DOMAIN_CLIENT
        //     : "localhost",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        path: "/",
        maxAge: 30 * day, //30 day
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

        partitioned: process.env.NODE_ENV == "production",

        // domain:
        //   process.env.NODE_ENV === "production"
        //     ? process.env.DOMAIN_CLIENT
        //     : "localhost",
      });

      return response(res, 200, "success login", {
        user: {
          _id: user._id,
          username: user.username,
        },
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
      console.error(error);
      response(res, 400, error.message);
    }
  },
  logout: async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    await User.updateOne({ _id: req.user._id }, { refreshToken: null });
    return response(res, 200, "success logout", {
      redirectUrl: "/",
    });
  },
  refreshToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    console.log(req.cookies)
    try {
      if (!refreshToken) return res.sendStatus(401);
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || "",
      ) as { _id: string };
      const user = await User.findOne(
        { _id: decoded._id },
        "username email avatar",
      );
      if (!user) return res.sendStatus(401);
      const accessToken = jwt.sign(
        {
          _id: user._id,
        },
        process.env.ACCESS_TOKEN_SECRET || "",
        {
          expiresIn: "5m",
        },
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        path: "/",
        maxAge: 5 * 60 * 1000, // 5 minute
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

        partitioned: process.env.NODE_ENV == "production",

        // domain:
        //   process.env.NODE_ENV === "production"
        //     ? process.env.DOMAIN_CLIENT
        //     : "localhost",
      });
      return res.status(200).json({
        token: accessToken,
      });
    } catch (error) {
      console.error("refresh token", error);
      if (error instanceof TokenExpiredError) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        await User.updateOne({ refreshToken }, { refreshToken: null });
        return res.status(401).json({ msg: "sesi anda sudah habis..." });
      }
      return res.sendStatus(401);
    }
  },
  me: async (req: Request, res: Response) => {
    try {
      const { accessToken } = req.cookies;
      if (!accessToken) return response(res, 401, "Unauthorized");
      if (!req.user) return response(res, 404, "User not found");
      response(res, 200, "User authenticated", { user: req.user });
    } catch (error) {
      console.error(error);
      response(res, 401, "Unauthorized");
    }
  },
  googleCallback: async (req: Request, res: Response) => {
    if (!req.user) {
      return response(res, 400, "email is already use");
    }
    const { accessToken, refreshToken } = req.user as unknown as {
      accessToken: string;
      refreshToken: string;
    };

    const day = 24 * 60 * 60 * 1000;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      path: "/",
      maxAge: 5 * 60 * 1000, // 5 minute
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      partitioned: process.env.NODE_ENV == "production",

      // domain:
      //   process.env.NODE_ENV === "production"
      //     ? process.env.DOMAIN_CLIENT
      //     : "localhost",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      path: "/",
      maxAge: 30 * day, //30 day
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      partitioned: process.env.NODE_ENV == "production",

      // domain:
      //   process.env.NODE_ENV === "production"
      //     ? process.env.DOMAIN_CLIENT
      //     : "localhost",
    });
    const clientUrl = process.env.CLIENT_URL || "/";
    res.redirect(clientUrl); // Redirect ke halaman setelah login
  },
};

export default AuthController;

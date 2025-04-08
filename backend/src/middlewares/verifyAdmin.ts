import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { getUserById } from "@service/user.service";
import { ObjectId } from "@utils/index";

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"]?.split(" ")[1] || "";
  if (!token) return res.sendStatus(401);
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "",
      async (e, decoded: any) => {
        if (e || !decoded) {
          console.log(e);
          return res.sendStatus(400).end();
        }
        const user = await getUserById(ObjectId(decoded._id));
        if (!user) return res.sendStatus(401);
        if (user?.role !== "ADMIN") return res.sendStatus(403);
        req.user = {
          _id: user._id,
          email: user.email,
          role: user.role,
          username: user.username,
          avatar: user?.avatar ?? { url: null, id: null },
        };
        next();
      },
    );
  } catch (error) {
    console.error(error);
    return res.sendStatus(401);
  }
};

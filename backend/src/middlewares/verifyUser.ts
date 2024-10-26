import { getUserById } from "@service/user.service";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// verify Token cookie
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"]?.split(" ")[1] || req.body.token as string;
  if (!token) return res.sendStatus(401);
  try {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "",
      async (err, decoded: any) => {
        if (err) {
          console.log(err);
          return res.sendStatus(401);
        }
        const user = await getUserById(decoded._id);
        if (!user) return res.sendStatus(401);
        req.user = {
          avatar: user.avatar,
          id: user._id,
          email: user.email,
          role: user.role,
          username: user.username,
        };
        next();
      },
    );
  } catch (error) {
    console.log(error)
    return res.sendStatus(401);
  }
};

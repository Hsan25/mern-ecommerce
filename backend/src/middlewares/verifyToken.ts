import { getUserById } from "@service/user.service";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// verify Token cookie
export const verifyToken = async (
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
        next();
      },
    );
  } catch (error) {
    console.log(error)
    return res.sendStatus(401);
  }
};

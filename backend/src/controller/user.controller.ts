import { upload } from "lib/multer";
import response from "@utils/response";
import {
  register,
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
} from "@service/user.service";
import { Request, Response } from "express";
import multer from "multer";
import { UserType } from "types";
import { z } from "zod";
import { Types } from "mongoose";
import { ObjectId } from "@utils/index";
import { UserBody } from "types/user";

const uploadAvatar = upload.single("avatar");
const UserController = {
  register: async (req: Request, res: Response) => {
    const schema = z.object({
      username: z.string().min(5).max(60),
      password: z.string().min(6).max(60),
      email: z.string().email(),
      role: z.enum(["USER", "ADMIN"]).optional(),
    });
    try {
      const body: UserBody & { role: "ADMIN" | "USER" } = req.body;
      if (req.user && req.user?.role != "ADMIN" && body.role == "ADMIN")
        return res.sendStatus(401);
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
      console.log(error);
      response(res, 400, error.message);
    }
  },
  getUsers: async (req: Request, res: Response) => {
    const { page, search, limit } = req.query;
    const MAX_LIMIT = 15;
    const limitNum = Number(limit) || 5;
    if (limitNum > MAX_LIMIT || limitNum < 5)
      return response(res, 400, "Max Limit:15 & Min : 5");
    try {
      const { users, totalPage } = await getUsers({
        limit: limitNum,
        page: Number(page) || 1,
        search: String(search || ""),
      });
      response(res, 200, "Success get users", {
        users,
        pagination: {
          totalPage,
          currentPage: Number(page),
        },
      });
    } catch (error) {
      console.log("error: " + error);
      response(res, 400, "ERROR");
    }
  },
  getUserById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await getUserById(new Types.ObjectId(id));
      response(res, 200, "Success get user by id: " + id, { user });
    } catch (error) {
      console.log("error: " + error);
      response(res, 404, `user with id: ${id}. NOT FOUND`);
    }
  },
  deleteUserById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await deleteUserById(ObjectId(id));
      response(res, 200, "Success delete user id: " + id);
    } catch (error) {
      response(res, 404, `user with id: ${id}.  NOT FOUND`);
    }
  },
  updateUserById: async (req: Request, res: Response) => {
    uploadAvatar(req, res, async (err) => {
      if (req.fileValidationError) {
        return response(res, 400, req.fileValidationError);
      }
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return response(res, 400, "File too large. Max size is 5MB");
          }
        } else {
          return response(res, 400, "Failed update user");
        }
      }
      const { id } = req.params;
      const validId = new Types.ObjectId(id);
      const schemaUpdate = z.optional(
        z.object({
          username: z.optional(z.string().min(5).max(60)),
          avatar: z.optional(z.string().min(5).max(60)),
          email: z.optional(z.string().email()),
          role: z.optional(z.enum(["USER", "ADMIN"])),
        }),
      );
      const image = req.file;
      try {
        const body: Partial<UserType> = req.body.user;
        const parse = body ? schemaUpdate.parse(body) : null;
        !image
          ? await updateUserById(validId, { ...parse })
          : await updateUserById(
              validId,
              parse
                ? {
                    ...parse,
                    avatar: `${process.env.BASE_URL_IMAGE}/${image.filename}`,
                  }
                : { avatar: `${process.env.BASE_URL_IMAGE}/${image.filename}` },
            );

        response(res, 200, "Success update user. id: " + id, { id });
      } catch (error) {
        if (error instanceof z.ZodError) {
          response(
            res,
            400,
            error.issues[0].path[0] + ": " + error.issues[0].message,
          );
          return;
        }
        console.log("error: " + error);
        response(res, 404, "Failed update user");
      }
    });
  },
};
export default UserController;

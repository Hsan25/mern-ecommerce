import response from "@utils/response";
import {
  getUsers,
  deleteUserById,
  updateUserById,
  getUserById,
} from "@service/user.service";
import { Request, Response } from "express";
import { UserType } from "types";
import { z } from "zod";
import { Types } from "mongoose";
import { ObjectId } from "@utils/index";
import { updateImage, uploadImage } from "../lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
const schemaUpdate = z.optional(
  z.object({
    username: z.optional(z.string().min(5).max(15)),
    email: z.optional(z.string().email()),
    role: z.optional(z.enum(["USER", "ADMIN"])),
  }),
);
const UserController = {
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
      // const user = await getUserById(new Types.ObjectId(id));
      response(res, 200, "Success get user by id: " + id, { user: req.user });
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
    if (req.fileValidationError) {
      return response(res, 400, req.fileValidationError);
    }
    const { id } = req.params; //user id
    const validId = new Types.ObjectId(id);
    const image = req.file;
    let cldRes: UploadApiResponse | null = null;
    if (image) {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + req.file?.mimetype + ";base64," + b64;
      cldRes = req.user?.avatar.id
        ? await updateImage(dataURI, req.user.avatar.id)
        : await uploadImage(dataURI);
    }

    try {
      let body: Partial<UserType> = req.body.user;
      // if (!body) return res.status(400).json({ msg: "the field cannot be empty" });
      body = body && typeof body === "string" ? JSON.parse(body) : body;
      if (req.user?.role && body.role) {
        return res.sendStatus(403);
      }
      const parse = body ? schemaUpdate.parse(body) : {};

      cldRes != null
        ? await updateUserById(validId, {
            ...parse,
            avatar: {
              id: cldRes.public_id,
              url: cldRes.secure_url,
            },
          })
        : await updateUserById(validId, {
            ...parse,
          });

      response(res, 200, "Success update user. id: " + id, { id });
    } catch (error: any) {
      console.log("error: " + error);

      if (error instanceof z.ZodError) {
        response(
          res,
          400,
          error.issues[0].path[0] + ": " + error.issues[0].message,
        );
        return;
      }
      response(res, 400, error.message);
    }
  },
};
export default UserController;

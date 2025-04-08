import {
  createAddress,
  deleteAddress,
  getAddressByUser,
  getAllAddress,
  updateAddress,
} from "@service/address.service";
import { Request, Response } from "express";
import response from "@utils/response";
import { Types, isValidObjectId } from "mongoose";
import { z } from "zod";
import { AddressInterface } from "types/address";
import { AddressSchema } from "lib/zodSchema/address.schema";
const AddressController = {
  createAddress: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const body = req.body as AddressInterface;
      const safe = AddressSchema.parse(body);
      const address = await createAddress(new Types.ObjectId(userId), safe);
      response(res, 201, "success create address", { address });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.error(error);
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
  getAllAddress: async (req: Request, res: Response) => {
    try {
      const docs = await getAllAddress();
      response(res, 200, "success fetch address", { address: docs });
    } catch (error: any) {
      response(res, 400, error.message);
    }
  },
  getAddressByUser: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return response(res, 400, "Invalid id");
    }
    try {
      const doc = await getAddressByUser(new Types.ObjectId(id));
      response(res, 200, "success fetch address", { address: doc });
    } catch (error: any) {
      response(res, 404, error.message);
    }
  },
  updateAddress: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return response(res, 400, "Invalid id");
    }
    const body: Partial<AddressInterface> = req.body;
    if (!body) return response(res, 400, "the field cannot be empty");
    try {
      const doc = await updateAddress(new Types.ObjectId(id), body);
      response(res, 200, "success update address");
    } catch (error: any) {
      response(res, 400, error.message);
    }
  },
  deleteAddress: async (req: Request, res: Response) => {
    const { userId, id } = req.params;
    if (!isValidObjectId(id)) {
      return response(res, 400, "Invalid id");
    }
    try {
      const doc = await deleteAddress(
        new Types.ObjectId(userId),
        new Types.ObjectId(id),
      );
      if (!doc) {
        response(res, 400, "failed delete address");
        return;
      }
      response(res, 200, "success delete address");
    } catch (error: any) {
      response(res, 404, error.message);
    }
  },
};

export default AddressController;

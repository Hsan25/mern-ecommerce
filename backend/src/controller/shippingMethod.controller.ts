import {
  createNewShippingMethod,
  deleteShippingMethod,
  getShippingMethodById,
  getShippingMethods,
  updateShippingMethod,
} from "@service/shippingMethod.service";
import { ObjectId } from "@utils/index";
import response from "@utils/response";
import { Request, Response } from "express";
import { Types } from "mongoose";

const ShippingMethodController = {
  createNewShippingMethod: async (req: Request, res: Response) => {
    try {
      const body = req.body;
      if (!body) return response(res, 400, "body is empty");
      const newShippingMethod = await createNewShippingMethod(body);
      return response(res, 201, "success add new shipping method", {
        shippingMethod: newShippingMethod,
      });
    } catch (error: any) {
      return response(res, 400, error.message);
    }
  },
  updateShippingMethod: async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const { id } = req.params;
      const modifiedCount = await updateShippingMethod(body, ObjectId(id));
      if(!modifiedCount) throw new Error('Error')
      return response(res, 200, "success update shipping method");
    } catch (error) {
      console.log(error);
      return response(res, 400, "Failed update shipping method");
    }
  },
  deleteShippingMethod: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleteCount = await deleteShippingMethod(ObjectId(id));
      return response(res, 200, "success delete shipping method");
    } catch (error) {
      console.log(error);
      return response(res, 400, "Failed delete shipping method");
    }
  },
  getShippingMethods: async (req: Request, res: Response) => {
    try {
      const docs = await getShippingMethods();
      return response(res, 200, "success fetch shipping method", {
        shippingMethod: docs,
      });
    } catch (error) {
      console.log(error);
      return response(res, 400, "Failed fetch shipping method");
    }
  },
  getShippingMethodById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) return response(res, 400);
      const doc = await getShippingMethodById(ObjectId(id));
      return response(res, 200, "success fetch shipping method", {
        shippingMethod: doc,
      });
    } catch (error) {
      console.log(error);
      return response(res, 400, "Failed fetch shipping method");
    }
  },
};

export default ShippingMethodController;

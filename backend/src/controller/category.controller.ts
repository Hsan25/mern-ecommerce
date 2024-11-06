import categoriesModel from "@model/categories.model";
import {
  createCategory,
  deleteCategoryById,
  getCategories,
  getCategoryById,
} from "@service/categories.service";
import response from "@utils/response";
import { Response, Request } from "express";
import { isValidObjectId, Types } from "mongoose";
import { z } from "zod";

const categoryController = {
  createCategory: async (req: Request, res: Response) => {
    const { name } = req.body;
    const schema = z.string().min(2).max(60);
    const capitalize = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    try {
      const parse = schema.parse(name);
      const newCategory = await createCategory(capitalize(parse));
      response(res, 201, "success create category", {
        id: newCategory._id,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.log(error);
        response(res, 400, "name: " + error.issues[0].message);
        return;
      }
      response(res, 400, error.message);
    }
  },
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await getCategories();
      response(res, 200, "success fetch categories", {
        categories,
      });
    } catch (error) {
      response(res, 200, "failed fetch categories");
    }
  },
  getCategoryById: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return response(res, 400, "Invalid id");

    try {
      const categories = await getCategoryById(new Types.ObjectId(id));
      response(res, 200, "success fetch category", {
        categories,
      });
    } catch (error) {
      response(res, 400, "failed fetch category");
    }
  },
  deleteCategory: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      if (!isValidObjectId(id)) return response(res, 400, "Invalid id");

      await deleteCategoryById(new Types.ObjectId(id));
      response(res, 200, "success delete category");
    } catch (error) {
      response(res, 400, "failed delete category");
    }
  },
  updateCategory: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.sendStatus(400);
    try {
      if (!isValidObjectId(id)) return response(res, 400, "Invalid id");
      await categoriesModel.updateOne({ _id: id }, { name });
      response(res, 200, "success update category");
    } catch (error) {
      response(res, 400, "failed update category");
    }
  },
};

export default categoryController;
